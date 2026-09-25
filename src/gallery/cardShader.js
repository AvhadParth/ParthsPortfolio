import * as THREE from 'three'

// Geometry: a flat, finely subdivided card. The vertex shader lays it along the wave
// curve (see curve.js); `aFlat` keeps the flat coordinates for the panel morph.
export function createCardGeometry(width, height) {
  const geometry = new THREE.PlaneGeometry(width, height, 72, 12)
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
  varying vec2 vUv;
  varying vec2 vFlat;
  varying float vShade;

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

    float s = uSlotS + aFlat.x;
    vec4 c = curveAt(s);
    vec3 normal = normalize(vec3(-c.w, 0.0, c.z)); // faces the camera

    // Ribbon twist around the strip's own direction: none at the crest (s near 0),
    // growing along the strip, so the far part turns into a thin twisting ribbon.
    float theta = uTwist * sin(clamp(s * 0.22, -1.5, 1.5)) * abs(sin(clamp(s * 0.22, -1.5, 1.5)));
    vec3 p = vec3(c.x, uCardsY, c.y) + vec3(0.0, cos(theta), 0.0) * aFlat.y + normal * sin(theta) * aFlat.y;

    // Hover lifts the card towards the viewer. The wave itself carries most of the motion;
    // cards only add a faint paper flex on top.
    float arch = sin(uv.x * PI);
    p += normal * (uHover * 0.06 + arch * abs(v) * 0.015);
    p.y += (uv.x - 0.5) * v * 0.012;

    // Morph into the flat panel rectangle in front of the camera.
    float t = smoothstep(0.0, 1.0, clamp(uOpen * 1.25 - (1.0 - uv.y) * 0.25, 0.0, 1.0));
    vec3 flatP = vec3(aFlat.x * uFlatScale.x + uFlatCenter.x, aFlat.y * uFlatScale.y + uFlatCenter.y, uFlatCenter.z);
    p = mix(p, flatP, t);
    p.z += sin(uv.x * 6.0 - uOpen * 8.0) * sin(uv.y * PI) * uRipple * 0.18;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    // Soft falloff towards the edges of the view.
    vShade = 1.0 - smoothstep(0.55, 1.15, abs(atan(mv.x, -mv.z))) * 0.5;
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
  varying vec2 vUv;
  varying vec2 vFlat;
  varying float vShade;

  float roundedBox(vec2 uv, float aspect, float r) {
    vec2 p = (uv - 0.5) * vec2(aspect, 1.0);
    vec2 q = abs(p) - (vec2(aspect, 1.0) * 0.5 - r);
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
  }

  void main() {
    // Profile: an organic hole opens where the ring grows out of the wall. The hole is
    // fixed on the curve (arc length 0), so cards keep sliding through it.
    if (uHole > 0.0) {
      vec2 d = vec2(uSlotS + vFlat.x, vFlat.y);
      float a = atan(d.y, d.x);
      float wob = 0.16 * sin(3.0 * a + uTime * 1.7) + 0.09 * sin(5.0 * a - uTime * 2.3);
      if (length(d) < uHole * (1.0 + uHoleWobble * wob)) discard;
    }

    vec3 color = texture2D(uMap, vUv).rgb;
    vec4 label = texture2D(uLabel, vUv);
    color = mix(color, label.rgb, label.a);
    // Backs of the cards (seen when the ribbon twists) are near-black with a soft sheen.
    if (!gl_FrontFacing) color = vec3(0.012 + 0.02 * vUv.y);
    color *= 1.0 + uHover * 0.06;
    color *= mix(vShade, 1.0, uOpen);

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
