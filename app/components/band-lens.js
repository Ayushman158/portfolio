/*
 * The curved "VR screen" look for the Exploration band (exploration-band.jsx),
 * drawn with WebGL in two steps:
 *
 *   1. Flat: every photo or video is drawn as a rounded card with a soft
 *      shadow, exactly where the band's layout puts it, into an off-screen
 *      picture.
 *   2. Lens: that picture is shown through a curved lens. Toward the left and
 *      right edges it is magnified (taller and wider), so card edges flare
 *      outward in a smooth curve, it smears sideways, and the red and blue
 *      parts split slightly (the pink and cyan fringe of a real lens). The
 *      middle stays flat and sharp.
 *
 * lensMap() is the same bend in plain JS, used to work out which card is under
 * the pointer. Returns null from createLens() if WebGL isn't available; the
 * band then falls back to its plain CSS version.
 */

const FLAT_VS = `
attribute vec2 aPos;
uniform vec4 uRect;     // x, y, w, h in canvas pixels (top-left origin)
uniform vec2 uRes;
varying vec2 vPx;
void main() {
  vPx = uRect.xy + aPos * uRect.zw;
  vec2 clip = vec2(vPx.x / uRes.x * 2.0 - 1.0, 1.0 - vPx.y / uRes.y * 2.0);
  gl_Position = vec4(clip, 0.0, 1.0);
}`

const FLAT_FS = `
precision mediump float;
uniform sampler2D uTex;
uniform vec4 uCard;     // the card itself: x, y, w, h
uniform vec2 uTexSize;
uniform float uHasTex;
uniform float uRadius;
uniform float uScale;   // device pixel ratio
uniform float uLift;    // 0 to 1, hover
varying vec2 vPx;
float box(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}
void main() {
  vec2 hs = uCard.zw * 0.5;
  vec2 p = vPx - (uCard.xy + hs);
  float d = box(p, hs, uRadius);
  float a = 1.0 - smoothstep(-0.75, 0.75, d);
  // soft shadow: offset down, grows a little on hover
  float off = (14.0 + 8.0 * uLift) * uScale;
  float ds = box(p - vec2(0.0, off), hs - 6.0 * uScale, uRadius);
  float sh = (0.2 + 0.06 * uLift) * (1.0 - smoothstep(-10.0 * uScale, (30.0 + 10.0 * uLift) * uScale, ds));
  // cover-fit the texture
  vec2 uv = (vPx - uCard.xy) / uCard.zw;
  float ca = uCard.z / uCard.w;
  float ta = uTexSize.x / max(uTexSize.y, 1.0);
  if (ta > ca) uv.x = 0.5 + (uv.x - 0.5) * ca / ta; else uv.y = 0.5 + (uv.y - 0.5) * ta / ca;
  vec3 col = uHasTex > 0.5 ? texture2D(uTex, uv).rgb : vec3(0.937, 0.906, 0.847);
  vec4 card = vec4(col * a, a);
  vec4 shadow = vec4(vec3(0.16, 0.1, 0.06) * sh, sh);
  gl_FragColor = card + shadow * (1.0 - a);
}`

const LENS_VS = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos * 2.0 - 1.0, 0.0, 1.0); }`

const LENS_FS = `
precision mediump float;
uniform sampler2D uScene;
uniform vec2 uRes;
uniform float uMid;      // the cards' vertical centre, canvas px
uniform float uStart;    // where the curve begins (0 = centre, 1 = edge)
uniform float uCurve;    // extra height at the very edge (0.6 = 60% taller)
uniform float uStretch;  // extra width at the very edge
uniform float uSplit;    // colour split at the edge
uniform float uSmear;    // sideways smear at the edge, canvas px
uniform float uFade;     // fade at the edge
float amount(float d) { float t = smoothstep(uStart, 1.0, abs(d)); return t * t; }
vec4 look(vec2 px, float k) {
  float d = (px.x / uRes.x - 0.5) * 2.0;
  float e = amount(d) * k;
  float sd = d / (1.0 + uStretch * e);
  vec2 src = vec2((sd * 0.5 + 0.5) * uRes.x, uMid + (px.y - uMid) / (1.0 + uCurve * e));
  return texture2D(uScene, vec2(src.x / uRes.x, 1.0 - src.y / uRes.y));
}
void main() {
  vec2 px = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);
  float d = (px.x / uRes.x - 0.5) * 2.0;
  float e = amount(d);
  // The flat middle: one plain look, no lens work.
  if (e < 0.0005) { gl_FragColor = texture2D(uScene, vec2(px.x / uRes.x, 1.0 - px.y / uRes.y)); return; }
  vec4 r = vec4(0.0); vec4 g = vec4(0.0); vec4 b = vec4(0.0);
  for (int i = 0; i < 9; i++) {
    float o = (float(i) / 8.0 - 0.5) * uSmear * e;
    vec2 q = px + vec2(o, 0.0);
    r += look(q, 1.0 + uSplit);
    g += look(q, 1.0);
    b += look(q, 1.0 - uSplit);
  }
  r /= 9.0; g /= 9.0; b /= 9.0;
  float a = max(max(r.a, g.a), b.a);
  gl_FragColor = vec4(r.r, g.g, b.b, a) * (1.0 - uFade * e);
}`

// The lens bend in JS: from a point on screen (css px, inside the band canvas)
// back to the flat layout, so the pointer can find the card under it.
export function lensMap(x, y, W, mid, lens) {
  const d = (x / W - 0.5) * 2
  const t = Math.min(1, Math.max(0, (Math.abs(d) - lens.start) / (1 - lens.start || 1)))
  const s = t * t * (3 - 2 * t) // smoothstep, as in the shader
  const e = s * s
  const sd = d / (1 + lens.stretch * e)
  return { x: (sd * 0.5 + 0.5) * W, y: mid + (y - mid) / (1 + lens.curve * e) }
}

function program(gl, vs, fs) {
  const make = (type, src) => {
    const s = gl.createShader(type)
    gl.shaderSource(s, src)
    gl.compileShader(s)
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s))
    return s
  }
  const p = gl.createProgram()
  gl.attachShader(p, make(gl.VERTEX_SHADER, vs))
  gl.attachShader(p, make(gl.FRAGMENT_SHADER, fs))
  gl.linkProgram(p)
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p))
  const u = {}
  const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS)
  for (let i = 0; i < n; i++) { const info = gl.getActiveUniform(p, i); u[info.name] = gl.getUniformLocation(p, info.name) }
  return { p, u, a: gl.getAttribLocation(p, 'aPos') }
}

export function createLens(canvas) {
  const gl = canvas.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: false })
  if (!gl) { console.warn('[band-lens] no WebGL, using the plain band'); return null }
  let flat, lens
  try {
    flat = program(gl, FLAT_VS, FLAT_FS)
    lens = program(gl, LENS_VS, LENS_FS)
  } catch (err) {
    console.warn('[band-lens] WebGL setup failed, using the plain band:', err.message)
    return null
  }
  const quad = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, quad)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]), gl.STATIC_DRAW)

  // Off-screen picture for step 1.
  const sceneTex = gl.createTexture()
  const fbo = gl.createFramebuffer()
  let fw = 0, fh = 0
  const sizeScene = (w, h) => {
    if (w === fw && h === fh) return
    fw = w; fh = h
    gl.bindTexture(gl.TEXTURE_2D, sceneTex)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, sceneTex, 0)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  }

  // One texture per piece, filled from its image or (playing) video.
  const textures = new Map()
  const texFor = (key, source) => {
    let t = textures.get(key)
    if (!t) {
      t = { tex: gl.createTexture(), w: 0, h: 0, time: -1 }
      gl.bindTexture(gl.TEXTURE_2D, t.tex)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      textures.set(key, t)
    }
    if (!source) return t
    const isVideo = source instanceof HTMLVideoElement
    const ready = isVideo ? source.readyState >= 2 : source.complete && source.naturalWidth > 0
    if (!ready) return t
    const time = isVideo ? source.currentTime : 0
    if (t.w && time === t.time) return t // nothing new to upload
    gl.bindTexture(gl.TEXTURE_2D, t.tex)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source)
    t.w = isVideo ? source.videoWidth : source.naturalWidth
    t.h = isVideo ? source.videoHeight : source.naturalHeight
    t.time = time
    return t
  }

  const bindQuad = (prog) => {
    gl.bindBuffer(gl.ARRAY_BUFFER, quad)
    gl.enableVertexAttribArray(prog.a)
    gl.vertexAttribPointer(prog.a, 2, gl.FLOAT, false, 0, 0)
  }

  /*
   * cards: [{ key, source, x, y, w, h, lift }] in canvas pixels.
   * look: { radius, mid, start, curve, stretch, split, smear, fade } with
   * radius, mid and smear in canvas pixels.
   */
  const draw = (cards, look) => {
    const W = canvas.width, H = canvas.height
    sizeScene(W, H)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)

    // Step 1: flat cards into the off-screen picture.
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
    gl.viewport(0, 0, W, H)
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.useProgram(flat.p)
    bindQuad(flat)
    gl.uniform2f(flat.u.uRes, W, H)
    gl.uniform1f(flat.u.uRadius, look.radius)
    gl.uniform1f(flat.u.uScale, look.scale)
    gl.uniform1i(flat.u.uTex, 0)
    gl.activeTexture(gl.TEXTURE0)
    const pad = 50 * look.scale
    for (const c of cards) {
      const t = texFor(c.key, c.source)
      gl.bindTexture(gl.TEXTURE_2D, t.tex)
      gl.uniform4f(flat.u.uRect, c.x - pad, c.y - pad, c.w + pad * 2, c.h + pad * 2)
      gl.uniform4f(flat.u.uCard, c.x, c.y, c.w, c.h)
      gl.uniform2f(flat.u.uTexSize, t.w || 1, t.h || 1)
      gl.uniform1f(flat.u.uHasTex, t.w ? 1 : 0)
      gl.uniform1f(flat.u.uLift, c.lift || 0)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
    }

    // Step 2: the picture through the lens, onto the canvas.
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.viewport(0, 0, W, H)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.useProgram(lens.p)
    bindQuad(lens)
    gl.bindTexture(gl.TEXTURE_2D, sceneTex)
    gl.uniform1i(lens.u.uScene, 0)
    gl.uniform2f(lens.u.uRes, W, H)
    gl.uniform1f(lens.u.uMid, look.mid)
    gl.uniform1f(lens.u.uStart, look.start)
    gl.uniform1f(lens.u.uCurve, look.curve)
    gl.uniform1f(lens.u.uStretch, look.stretch)
    gl.uniform1f(lens.u.uSplit, look.split)
    gl.uniform1f(lens.u.uSmear, look.smear)
    gl.uniform1f(lens.u.uFade, look.fade)
    gl.drawArrays(gl.TRIANGLES, 0, 6)
  }

  const dispose = () => {
    textures.forEach((t) => gl.deleteTexture(t.tex))
    gl.deleteTexture(sceneTex)
    gl.deleteFramebuffer(fbo)
    gl.deleteBuffer(quad)
    gl.deleteProgram(flat.p)
    gl.deleteProgram(lens.p)
    // The context itself is kept: React may set the band up again on the same canvas.
  }

  return { draw, dispose }
}
