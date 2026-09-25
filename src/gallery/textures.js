import { CARD_ASPECT } from './config'

// Card textures are composed on a 2D canvas: project image (or a generated poster)
// plus the title label and round button, so each card is a single draw call.

const CARD_W = 1280
const CARD_H = Math.round(CARD_W / CARD_ASPECT)
const UI_FONT = '"Inter Tight", "Helvetica Neue", Arial, sans-serif'
const DISPLAY_FONT = '"Instrument Serif", Georgia, serif'

export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Failed to load ${src}`))
    img.src = src
  })
}

export async function ensureFonts() {
  if (!document.fonts?.load) return
  try {
    await Promise.all([
      document.fonts.load(`400 40px ${UI_FONT}`),
      document.fonts.load(`500 40px ${UI_FONT}`),
      document.fonts.load(`italic 400 120px ${DISPLAY_FONT}`),
      document.fonts.load(`400 120px ${DISPLAY_FONT}`),
    ])
  } catch {
    // Fall back to system fonts silently.
  }
}

function drawCover(ctx, img, w, h) {
  const scale = Math.max(w / img.width, h / img.height)
  const dw = img.width * scale
  const dh = img.height * scale
  ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh)
}

/**
 * Generated editorial poster used wherever a real project image is missing.
 * `variant` changes the composition so case-study placeholders don't repeat.
 */
export function drawPoster(ctx, project, w, h, variant = 0) {
  const [bg, accent, ink] = project.palette || ['#161616', '#bbbbbb', '#f2f2f2']
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)

  // Soft light falloff.
  const glow = ctx.createRadialGradient(w * (variant % 2 ? 0.25 : 0.7), h * 0.35, 0, w * 0.5, h * 0.5, w * 0.75)
  glow.addColorStop(0, hexToRgba(accent, 0.28))
  glow.addColorStop(1, hexToRgba(accent, 0))
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, w, h)

  // Fine grid.
  ctx.strokeStyle = hexToRgba(ink, 0.07)
  ctx.lineWidth = Math.max(1, w / 1280)
  const cell = w / 16
  for (let x = cell; x < w; x += cell) line(ctx, x, 0, x, h)
  for (let y = cell; y < h; y += cell) line(ctx, 0, y, w, y)

  const pad = w * 0.05
  ctx.fillStyle = ink
  ctx.textBaseline = 'alphabetic'

  if (variant % 3 === 0) {
    // Big italic title, centred.
    fitText(ctx, project.title, `italic 400 {s}px ${DISPLAY_FONT}`, w * 0.78, h * 0.34)
    ctx.textAlign = 'center'
    ctx.fillText(project.title, w / 2, h * 0.56)
  } else if (variant % 3 === 1) {
    // Statement layout: summary as large set text.
    ctx.textAlign = 'left'
    const size = Math.round(h * 0.085)
    ctx.font = `400 ${size}px ${DISPLAY_FONT}`
    wrapText(ctx, project.summary, pad, h * 0.3, w - pad * 2, size * 1.08)
  } else {
    // Detail crop: oversized initial.
    ctx.textAlign = 'right'
    ctx.font = `italic 400 ${Math.round(h * 1.05)}px ${DISPLAY_FONT}`
    ctx.fillStyle = hexToRgba(accent, 0.9)
    ctx.fillText(project.title.charAt(0), w - pad * 0.5, h * 0.92)
    ctx.fillStyle = ink
  }

  // Small meta line, top-left.
  ctx.textAlign = 'left'
  ctx.font = `500 ${Math.round(h * 0.026)}px ${UI_FONT}`
  ctx.fillStyle = hexToRgba(ink, 0.7)
  ctx.fillText(project.category.toUpperCase(), pad, pad + h * 0.02)
}

function newCanvas() {
  const canvas = document.createElement('canvas')
  canvas.width = CARD_W
  canvas.height = CARD_H
  return canvas
}

/**
 * Card media still: the project's poster/cover image (cover-fitted), or a generated
 * typographic poster when there is none or it fails to load. Videos play over this.
 */
export async function composeMedia(project) {
  const canvas = newCanvas()
  const ctx = canvas.getContext('2d')
  const src = project.poster || project.cover
  if (src) {
    try {
      drawCover(ctx, await loadImage(src), CARD_W, CARD_H)
      return canvas
    } catch {
      // Graceful fallback to the generated poster below.
    }
  }
  drawPoster(ctx, project, CARD_W, CARD_H, 0)
  return canvas
}

/** Transparent overlay: bottom shade, title and round arrow button. */
export function composeLabel(project) {
  const canvas = newCanvas()
  const ctx = canvas.getContext('2d')

  const shade = ctx.createLinearGradient(0, CARD_H * 0.62, 0, CARD_H)
  shade.addColorStop(0, 'rgba(0,0,0,0)')
  shade.addColorStop(1, 'rgba(0,0,0,0.55)')
  ctx.fillStyle = shade
  ctx.fillRect(0, CARD_H * 0.6, CARD_W, CARD_H * 0.4)

  const pad = CARD_W * 0.03
  ctx.fillStyle = '#fff'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  ctx.font = `500 ${Math.round(CARD_H * 0.05)}px ${UI_FONT}`
  ctx.fillText(project.title, pad, CARD_H - pad * 0.95)

  const r = CARD_H * 0.03
  const cx = CARD_W - pad - r
  const cy = CARD_H - pad - r * 0.45
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.fillStyle = '#0b0b0b'
  ctx.fill()
  ctx.strokeStyle = '#fff'
  ctx.lineWidth = 2.6
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  const a = r * 0.36
  line(ctx, cx - a, cy, cx + a, cy)
  ctx.beginPath()
  ctx.moveTo(cx + a * 0.1, cy - a * 0.85)
  ctx.lineTo(cx + a, cy)
  ctx.lineTo(cx + a * 0.1, cy + a * 0.85)
  ctx.stroke()

  return canvas
}

const posterCache = new Map()

/** Data-URL placeholder for the DOM case-study column. */
export function posterDataURL(project, variant = 0) {
  const key = `${project.id}-${variant}`
  if (posterCache.has(key)) return posterCache.get(key)
  const canvas = document.createElement('canvas')
  canvas.width = 1200
  canvas.height = 800
  drawPoster(canvas.getContext('2d'), project, canvas.width, canvas.height, variant)
  const url = canvas.toDataURL('image/jpeg', 0.86)
  posterCache.set(key, url)
  return url
}

function line(ctx, x1, y1, x2, y2) {
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()
}

function fitText(ctx, text, fontTemplate, maxW, maxSize) {
  let size = maxSize
  ctx.font = fontTemplate.replace('{s}', size)
  const measured = ctx.measureText(text).width
  if (measured > maxW) size = Math.floor(size * (maxW / measured))
  ctx.font = fontTemplate.replace('{s}', size)
}

function wrapText(ctx, text, x, y, maxW, lineH) {
  let lineStr = ''
  for (const word of text.split(' ')) {
    const test = lineStr ? `${lineStr} ${word}` : word
    if (ctx.measureText(test).width > maxW && lineStr) {
      ctx.fillText(lineStr, x, y)
      lineStr = word
      y += lineH
    } else {
      lineStr = test
    }
  }
  if (lineStr) ctx.fillText(lineStr, x, y)
}

function hexToRgba(hex, alpha) {
  const v = hex.replace('#', '')
  const n = parseInt(v.length === 3 ? v.replace(/./g, '$&$&') : v, 16)
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`
}
