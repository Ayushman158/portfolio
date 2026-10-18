'use client'

import { useEffect, useRef } from 'react'

/*
 * A slow blue wave behind the 3D mockups. Ported from Framer's
 * NewWaveGradient shader (seed 32, its default shape), recoloured to the
 * case study's blues. Colours come from --wave-0..3, so it follows the theme.
 * Holds still for reduced motion, pauses off screen, and falls back to a
 * plain CSS gradient where WebGL isn't available.
 */

const VERT = 'attribute vec2 a_pos; void main() { gl_Position = vec4(a_pos, 0, 1); }'
const FRAG = `
precision highp float;
uniform vec2 u_res; uniform float u_time; uniform float u_seed; uniform vec2 u_mouse;
uniform vec3 u_c0; uniform vec3 u_c1; uniform vec3 u_c2; uniform vec3 u_c3;
const float SPEED = 0.6; const float AMP = 2.1; const float SOFT = 0.74; const float BLEND = 0.54; const float MOUSE = 0.8;
mat2 Rot(float a) { float s = sin(a), c = cos(a); return mat2(c, -s, s, c); }
vec2 hash(vec2 p) {
  vec2 k1 = vec2(2127.1 + u_seed * 13.37, 81.17 + u_seed * 7.31);
  vec2 k2 = vec2(1269.5 + u_seed * 11.13, 283.37 + u_seed * 5.79);
  p = vec2(dot(p, k1), dot(p, k2));
  return fract(sin(p) * (43758.5453 + u_seed * 1.618));
}
float noise(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
  return 0.5 + 0.5 * mix(
    mix(dot(-1.0 + 2.0 * hash(i), f), dot(-1.0 + 2.0 * hash(i + vec2(1,0)), f - vec2(1,0)), u.x),
    mix(dot(-1.0 + 2.0 * hash(i + vec2(0,1)), f - vec2(0,1)), dot(-1.0 + 2.0 * hash(i + vec2(1,1)), f - vec2(1,1)), u.x), u.y);
}
vec2 warpUV(vec2 uv, float t) {
  float fxMod = 0.9 * (1.0 + 0.5 * sin(u_seed * 2.17 + 0.9));
  float fyMod = 6.0 * (1.0 + 0.5 * sin(u_seed * 3.11 + 6.0));
  float phaseX = fract(sin(u_seed * 7.19) * 437.58) * 6.2832;
  float phaseY = fract(cos(u_seed * 3.41) * 291.37) * 6.2832;
  vec2 ruv = Rot(radians(105.0 + sin(u_seed * 2.73) * 30.0)) * uv;
  float a = fyMod * ruv.y - sin(ruv.x * fxMod + ruv.y - t + phaseX);
  a += sin(u_seed * 1.23) * 0.5 * sin(ruv.x * fxMod * 2.0 + ruv.y * 0.5 + t * 0.7 + phaseY);
  a = smoothstep(cos(a) * SOFT, sin(a) * SOFT + 3.0, cos(a - fyMod * ruv.y) - sin(a - fxMod * ruv.x));
  a *= AMP;
  return cos(a) * uv + sin(a) * vec2(-uv.y, uv.x);
}
void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float ratio = u_res.x / u_res.y;
  float t = u_time * SPEED;
  vec2 mouseShift = (u_mouse - vec2(0.5)) * MOUSE * 0.18;
  vec2 tuv = uv - 0.5;
  float degree = noise(vec2(t * 0.1, tuv.x * tuv.y) + vec2(sin(u_seed * 4.37), cos(u_seed * 5.91)) * 100.0);
  tuv.y *= 1.0 / ratio;
  tuv *= Rot(radians((degree - 0.5) * 720.0 + 180.0));
  tuv.y *= ratio;
  vec2 uv2 = (gl_FragCoord.xy * 2.0 - u_res) / (u_res.x + u_res.y) * 2.0;
  uv2 *= Rot(fract(sin(u_seed * 5.63) * 173.29) * 6.2832);
  vec2 warped = warpUV(uv2 + mouseShift, t) * 0.5 + 0.5;
  vec2 b = mix(tuv + mouseShift * 0.5, warped - 0.5, BLEND);
  vec3 l1 = mix(u_c0, u_c2, smoothstep(-0.3, 0.3, (b * Rot(radians(-5.0 + sin(u_seed * 1.83) * 20.0))).x));
  vec3 l2 = mix(u_c3, u_c1, smoothstep(-0.3, 0.3, (b * Rot(radians(10.0 + cos(u_seed * 2.47) * 20.0))).x));
  vec3 col = mix(l1, l2, smoothstep(0.3, -0.3, b.y));
  col = mix(col, col * col + 0.5 * sqrt(col), 0.3);
  gl_FragColor = vec4(col, 1.0);
}`

const hex = (s) => {
  const h = s.trim().replace('#', '')
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
}

export default function Wave({ className = '', children }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const gl = canvas?.getContext('webgl', { premultipliedAlpha: false })
    if (!gl) return
    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s }
    const prog = gl.createProgram()
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT))
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return
    gl.useProgram(prog)
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    const pos = gl.getAttribLocation(prog, 'a_pos')
    gl.enableVertexAttribArray(pos)
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0)
    const u = (n) => gl.getUniformLocation(prog, n)
    const [uRes, uTime, uSeed, uMouse] = ['u_res', 'u_time', 'u_seed', 'u_mouse'].map(u)
    const uC = [0, 1, 2, 3].map((i) => u(`u_c${i}`))

    const colours = () => {
      const cs = getComputedStyle(canvas)
      uC.forEach((loc, i) => gl.uniform3fv(loc, hex(cs.getPropertyValue(`--wave-${i}`) || '#BFE3F8')))
    }
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = canvas.clientWidth * dpr
      canvas.height = canvas.clientHeight * dpr
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    const m = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 }
    const draw = (t) => {
      gl.uniform2f(uRes, canvas.width, canvas.height)
      gl.uniform1f(uTime, t)
      gl.uniform1f(uSeed, 32)
      gl.uniform2f(uMouse, m.x, m.y)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }

    resize(); colours()
    const still = window.matchMedia('(prefers-reduced-motion: reduce)')
    const theme = new MutationObserver(() => { colours(); if (still.matches) draw(4) })
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] })
    const ro = new ResizeObserver(() => { resize(); if (still.matches) draw(4) })
    ro.observe(canvas)
    const move = (e) => { const r = canvas.getBoundingClientRect(); m.tx = (e.clientX - r.left) / r.width; m.ty = 1 - (e.clientY - r.top) / r.height }
    const leave = () => { m.tx = 0.5; m.ty = 0.5 }
    const host = canvas.parentElement
    host.addEventListener('pointermove', move)
    host.addEventListener('pointerleave', leave)

    let raf = 0, visible = false
    const start = performance.now()
    const loop = () => {
      m.x += (m.tx - m.x) * 0.05; m.y += (m.ty - m.y) * 0.05
      draw(4 + (performance.now() - start) / 1000)
      raf = visible && !still.matches ? requestAnimationFrame(loop) : 0
    }
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible && !raf) still.matches ? draw(4) : loop()
    })
    io.observe(canvas)

    return () => {
      cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); theme.disconnect()
      host.removeEventListener('pointermove', move); host.removeEventListener('pointerleave', leave)
      gl.deleteBuffer(buf); gl.deleteProgram(prog)
    }
  }, [])

  return (
    <div
      className={`relative isolate overflow-hidden ${className}`}
      style={{ background: 'radial-gradient(80% 90% at 20% 80%, var(--wave-1), transparent), radial-gradient(80% 90% at 85% 15%, var(--wave-3), transparent), var(--wave-0)' }}
    >
      <canvas ref={ref} aria-hidden="true" className="absolute inset-0 -z-10 block h-full w-full" />
      {children}
    </div>
  )
}
