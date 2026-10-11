import * as THREE from 'three'

// Geometry: a flat, finely subdivided card. The vertex shader lays it along the wave
// curve (see curve.js); `aFlat` keeps the flat coordinates for the panel morph.
export function createCardGeometry(width, height) {
  const geometry = new THREE.PlaneGeometry(width, height, 72, 28)
  const pos = geometry.attributes.position
  const flat = new Float32Array(pos.count * 2)
  for (let i = 0; i < pos.count; i++) {
    flat[i * 2] = pos.getX(i)
    flat[i * 2 + 1] = pos.getY(i)
  }
  geometry.setAttribute('aFlat', new THREE.BufferAttribute(flat, 2))
  return geometry
}

export function createCardUniforms(media, label, cardAspect, curve) {
  return {
    uMap: { value: media },
    uLabel: { value: label },
    uCurve: { value: curve.texture },
    uCurveSpan: { value: curve.span },
    uCurveSamples: { value: curve.samples },
    uSlotS: { value: 0 }, // arc-length position of this card's centre on the curve
    uCardsY: { value: 0 },
    uVelocity: { value: 0 },
    uHover: { value: 0 },
    uOpen: { value: 0 },
    uRipple: { value: 0 },
    uWhite: { value: 0 },
    uDim: { value: 0 },
    uOpacity: { value: 1 },
    uFlatScale: { value: new THREE.Vector2(1, 1) },
    uFlatCenter: { value: new THREE.Vector3() },
    uCardAspect: { value: cardAspect },
    uPanelAspect: { value: cardAspect },
    uCorner: { value: 0.04 },
    uTwist: { value: 0 }, // radians of ribbon twist at full strength (0 at rest)
    uHole: { value: 0 }, // radius of the profile hole (world units), 0 = none
    uHoleWobble: { value: 0 },
    uTime: { value: 0 },
    uPanelCorner: { value: 0.03 },
    // Pointer "flow": three soft dents that trail the mouse across the strip.
    // Each is (position along the strip, position across it, strength 0..1).
    uDents: { value: [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()] },
    uDentRadius: { value: 0.6 },
    uVideo: { value: 0 }, // 1 while uMap is a video (needs manual sRGB decoding)
    uVertical: { value: 0 }, // 1 = strip runs top-to-bottom (portrait screens)
    uIntro: { value: 1 }, // 0 → 1: cards grow out of the loader
    uIntroOrigin: { value: new THREE.Vector3() },
    // Where the case study's lead image sits inside the panel (uv: x0, y0, x1, y1).
    // While opening, the card's image travels into this slot as the panel turns white.
    uHero: { value: new THREE.Vector4(0, 0, 1, 1) },
  }
}

export const cardVertexShader = /* glsl */ `
  #define PI 3.141592653589793
  attribute vec2 aFlat;
  uniform sampler2D uCurve;
  uniform float uCurveSpan;
  uniform float uCurveSamples;
  uniform float uSlotS;
  uniform float uCardsY;
  uniform float uTwist;
  uniform float uVelocity;
  uniform float uHover;
  uniform float uOpen;
  uniform float uRipple;
  uniform vec2 uFlatScale;
  uniform vec3 uFlatCenter;
  uniform float uVertical;
  uniform float uIntro;
  uniform vec3 uIntroOrigin;
  uniform vec3 uDents[3];
  uniform float uDentRadius;
  varying vec2 vUv;
  varying vec2 vFlat;
  varying float vShade;
  varying float vDent;

  // Curve lookup with manual linear interpolation (float textures aren't filterable everywhere).
  vec4 curveAt(float s) {
    float f = clamp((s + uCurveSpan) / (2.0 * uCurveSpan), 0.0, 1.0) * (uCurveSamples - 1.0);
    float i0 = floor(f);
    vec4 a = texture2D(uCurve, vec2((i0 + 0.5) / uCurveSamples, 0.5));
    vec4 b = texture2D(uCurve, vec2((min(i0 + 1.0, uCurveSamples - 1.0) + 0.5) / uCurveSamples, 0.5));
    return mix(a, b, f - i0);
  }

  void main() {
    vUv = uv;
    vFlat = aFlat;
    float v = clamp(uVelocity, -6.0, 6.0);

    // The strip runs left-to-right, or top-to-bottom on portrait screens.
    float along = mix(aFlat.x, -aFlat.y, uVertical);
    float across = mix(aFlat.y, aFlat.x, uVertical);
    float s = uSlotS + along;
    vec4 c = curveAt(s);
    vec3 normal = normalize(mix(vec3(-c.w, 0.0, c.z), vec3(0.0, c.w, c.z), uVertical)); // faces the camera
    vec3 side = mix(vec3(0.0, 1.0, 0.0), vec3(1.0, 0.0, 0.0), uVertical);
    vec3 base = mix(vec3(c.x, uCardsY, c.y), vec3(0.0, uCardsY - c.x, c.y), uVertical);

    // Ribbon twist around the strip's own direction: none at the crest (s near 0),
    // growing along the strip, so the far part turns into a thin twisting ribbon.
    float theta = uTwist * sin(clamp(s * 0.22, -1.5, 1.5)) * abs(sin(clamp(s * 0.22, -1.5, 1.5)));
    vec3 p = base + side * cos(theta) * across + normal * sin(theta) * across;

    // Pointer flow: each dent presses the surface away from the viewer and gathers it
    // slightly towards its centre, like a finger dragged across cloth.
    float press = 0.0;
    vec2 gather = vec2(0.0);
    for (int i = 0; i < 3; i++) {
      vec2 to = uDents[i].xy - vec2(s, across);
      float fall = exp(-dot(to, to) / (uDentRadius * uDentRadius)) * uDents[i].z;
      press += fall;
      gather += to * fall;
    }
    press = min(press, 1.4);
    vec3 alongDir = mix(vec3(c.z, 0.0, c.w), vec3(0.0, -c.z, c.w), uVertical);
    p += -normal * press * 0.34 + alongDir * gather.x * 0.22 + side * gather.y * 0.22;
    vDent = press;

    // Intro: every card starts tiny at the loader and grows into place.
    p = mix(uIntroOrigin + (p - uIntroOrigin) * 0.04, p, uIntro);

    // Hover lifts the card towards the viewer. The wave itself carries most of the motion;
    // cards only add a faint paper flex on top.
    float arch = sin(uv.x * PI);
    p += normal * arch * abs(v) * 0.015;
    p.y += (uv.x - 0.5) * v * 0.012;

    // Morph into the flat panel rectangle in front of the camera.
    float t = smoothstep(0.0, 1.0, clamp(uOpen * 1.25 - (1.0 - uv.y) * 0.25, 0.0, 1.0));
    vec3 flatP = vec3(aFlat.x * uFlatScale.x + uFlatCenter.x, aFlat.y * uFlatScale.y + uFlatCenter.y, uFlatCenter.z);
    p = mix(p, flatP, t);
    p.z += sin(uv.x * 6.0 - uOpen * 8.0) * sin(uv.y * PI) * uRipple * 0.18;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    // Soft falloff towards the ends of the strip (sides, or top/bottom when vertical).
    float edge = mix(abs(atan(mv.x, -mv.z)), abs(atan(mv.y, -mv.z)) * 2.1, uVertical);
    vShade = 1.0 - smoothstep(0.55, 1.15, edge) * mix(0.5, 0.8, uVertical);
    gl_Position = projectionMatrix * mv;
  }
`

export const cardFragmentShader = /* glsl */ `
  uniform sampler2D uMap;
  uniform sampler2D uLabel;
  uniform float uHover;
  uniform float uOpen;
  uniform float uWhite;
  uniform float uDim;
  uniform float uOpacity;
  uniform float uCardAspect;
  uniform float uPanelAspect;
  uniform float uCorner;
  uniform float uPanelCorner;
  uniform float uSlotS;
  uniform float uHole;
  uniform float uHoleWobble;
  uniform float uTime;
  uniform float uVertical;
  uniform float uVideo;
  uniform vec4 uHero;
  varying vec2 vUv;
  varying vec2 vFlat;
  varying float vShade;
  varying float vDent;

  float roundedBox(vec2 uv, float aspect, float r) {
    vec2 p = (uv - 0.5) * vec2(aspect, 1.0);
    vec2 q = abs(p) - (vec2(aspect, 1.0) * 0.5 - r);
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
  }

  void main() {
    // Profile: an organic hole opens where the ring grows out of the wall. The hole is
    // fixed on the curve (arc length 0), so cards keep sliding through it.
    if (uHole > 0.0) {
      vec2 d = mix(vec2(uSlotS + vFlat.x, vFlat.y), vec2(vFlat.x, vFlat.y - uSlotS), uVertical);
      float a = atan(d.y, d.x);
      float wob = 0.16 * sin(3.0 * a + uTime * 1.7) + 0.09 * sin(5.0 * a - uTime * 2.3);
      if (length(d) < uHole * (1.0 + uHoleWobble * wob)) discard;
    }

    // Opening: the image shrinks into the case study's lead-image slot while the rest
    // of the card turns into the white panel around it.
    vec4 slot = mix(vec4(0.0, 0.0, 1.0, 1.0), uHero, uOpen);
    vec2 local = (vUv - slot.xy) / (slot.zw - slot.xy);
    vec2 px = fwidth(local);
    vec2 inX = smoothstep(vec2(0.0), px, local) * (1.0 - smoothstep(vec2(1.0) - px, vec2(1.0), local));
    float inSlot = inX.x * inX.y;
    vec3 color = texture2D(uMap, clamp(local, 0.0, 1.0)).rgb;
    // Video frames arrive sRGB-encoded (image textures are decoded by the GPU), so
    // decode them here; otherwise they'd be encoded twice and look washed out.
    vec3 decoded = mix(color / 12.92, pow((color + 0.055) / 1.055, vec3(2.4)), step(0.04045, color));
    color = mix(color, decoded, uVideo);
    vec4 label = texture2D(uLabel, vUv);
    color = mix(color, label.rgb, label.a * (1.0 - smoothstep(0.0, 0.35, uOpen)));
    color = mix(vec3(1.0), color, inSlot);
    // Backs of the cards (seen when the ribbon twists) are near-black with a soft sheen.
    if (!gl_FrontFacing) color = vec3(0.012 + 0.02 * vUv.y);
    // The pressed-in part of a dent sits in shadow.
    color *= mix(vShade * (1.0 - 0.38 * smoothstep(0.0, 1.2, vDent)), 1.0, uOpen);

    float luma = dot(color, vec3(0.2126, 0.7152, 0.0722));
    color = mix(color, vec3(0.07 + luma * 0.1), uDim);
    color = mix(color, vec3(1.0), uWhite);

    float aspect = mix(uCardAspect, uPanelAspect, uOpen);
    float d = roundedBox(vUv, aspect, mix(uCorner, uPanelCorner, uOpen));
    float aa = fwidth(d);
    float mask = 1.0 - smoothstep(-aa, aa, d);

    gl_FragColor = vec4(color, mask * uOpacity);
    #include <colorspace_fragment>
  }
`
