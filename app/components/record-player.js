'use client'

/*
 * The record on the footer turntable, as real sound. It lives here, outside
 * any component, so the music keeps playing when you open a case study (the
 * site moves between pages without reloading). A full reload stops it.
 *
 * Anything can ask how loud the music is right now (`levels`) to move with it:
 * the tick bar on case studies does, as a small easter egg.
 *
 * The song: set TRACK to a file in /public (for example '/music/record.mp3')
 * and that plays, looped. While TRACK is null, a placeholder plays instead: a
 * slow lo-fi loop made in the browser (electric-piano chords, a soft kick, a
 * brushed hat and vinyl crackle), so there is no file to license.
 */
const TRACK = null
const VOLUME = 0.32
const BPM = 72

let ctx = null
let analyser = null
let master = null
let audio = null // the <audio> element when TRACK is set
let timer = 0 // the placeholder's scheduler
let playing = false
const listeners = new Set()
const notify = () => listeners.forEach((fn) => fn(playing))

export const isPlaying = () => playing

/** Call fn(playing) whenever the record starts or stops. Returns an unsubscribe. */
export function subscribe(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

function setup() {
  if (ctx) return
  ctx = new (window.AudioContext || window.webkitAudioContext)()
  analyser = ctx.createAnalyser()
  analyser.fftSize = 128 // 64 frequency bands: plenty for 33 ticks
  analyser.smoothingTimeConstant = 0.75
  master = ctx.createGain()
  master.gain.value = 0
  master.connect(analyser)
  analyser.connect(ctx.destination)
  if (TRACK) {
    audio = new Audio(TRACK)
    audio.loop = true
    audio.crossOrigin = 'anonymous'
    ctx.createMediaElementSource(audio).connect(master)
  }
}

/** Drop the needle. Must run from a click (browsers only allow sound after one). */
export function start() {
  setup()
  if (playing) return
  playing = true
  ctx.resume()
  // Fade in over half a second, like the needle settling into the groove.
  const now = ctx.currentTime
  master.gain.cancelScheduledValues(now)
  master.gain.setValueAtTime(master.gain.value, now)
  master.gain.linearRampToValueAtTime(VOLUME, now + 0.5)
  if (audio) audio.play().catch(() => stop())
  else startLoop()
  notify()
}

/** Lift the needle: a quick fade, then silence. */
export function stop() {
  if (!playing) return
  playing = false
  const now = ctx.currentTime
  master.gain.cancelScheduledValues(now)
  master.gain.setValueAtTime(master.gain.value, now)
  master.gain.linearRampToValueAtTime(0, now + 0.25)
  setTimeout(() => {
    if (playing) return
    if (audio) audio.pause()
    clearInterval(timer)
    timer = 0
  }, 300)
  notify()
}

/**
 * How loud each band of the music is right now, low to high, 0 to 1.
 * Pass a Uint8Array of `bands()` length to fill.
 */
export function levels(out) {
  if (analyser) analyser.getByteFrequencyData(out)
  return out
}
export const bands = () => 64

/* ---- The placeholder song ------------------------------------------------ */

// Four bars, one chord each: Fmaj7, Em7, Dm7, Cmaj7 (as frequencies in Hz).
const CHORDS = [
  [174.61, 220.0, 261.63, 329.63],
  [164.81, 196.0, 246.94, 293.66],
  [146.83, 174.61, 220.0, 261.63],
  [130.81, 164.81, 196.0, 246.94],
]
const BASS = [87.31, 82.41, 73.42, 65.41]
const BEAT = 60 / BPM

let noise = null
const noiseBuffer = () => {
  if (noise) return noise
  noise = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate)
  const d = noise.getChannelData(0)
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
  return noise
}

// A soft electric-piano note: a sine with a little triangle on top, a quick
// attack and a long decay, through a low-pass so it sounds warm and far away.
function key(freq, at, length, gain) {
  const out = ctx.createGain()
  out.gain.setValueAtTime(0, at)
  out.gain.linearRampToValueAtTime(gain, at + 0.02)
  out.gain.exponentialRampToValueAtTime(0.0001, at + length)
  const lp = ctx.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = 1400
  out.connect(lp).connect(master)
  ;[['sine', 1, 1], ['triangle', 2, 0.18]].forEach(([type, mult, g]) => {
    const o = ctx.createOscillator()
    const og = ctx.createGain()
    o.type = type
    o.frequency.value = freq * mult
    o.detune.value = (Math.random() - 0.5) * 8 // slightly out of tune, like tape
    og.gain.value = g
    o.connect(og).connect(out)
    o.start(at)
    o.stop(at + length + 0.05)
  })
}

function kick(at) {
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  o.frequency.setValueAtTime(110, at)
  o.frequency.exponentialRampToValueAtTime(42, at + 0.18)
  g.gain.setValueAtTime(0.9, at)
  g.gain.exponentialRampToValueAtTime(0.0001, at + 0.4)
  o.connect(g).connect(master)
  o.start(at)
  o.stop(at + 0.45)
}

function hat(at, gain) {
  const s = ctx.createBufferSource()
  s.buffer = noiseBuffer()
  const hp = ctx.createBiquadFilter()
  hp.type = 'highpass'
  hp.frequency.value = 6500
  const g = ctx.createGain()
  g.gain.setValueAtTime(gain, at)
  g.gain.exponentialRampToValueAtTime(0.0001, at + 0.07)
  s.connect(hp).connect(g).connect(master)
  s.start(at, Math.random())
  s.stop(at + 0.08)
}

// Vinyl: a quiet hiss under everything, with the odd click.
function crackle(at, length) {
  const s = ctx.createBufferSource()
  s.buffer = noiseBuffer()
  s.loop = true
  const bp = ctx.createBiquadFilter()
  bp.type = 'bandpass'
  bp.frequency.value = 3000
  const g = ctx.createGain()
  g.gain.value = 0.025
  s.connect(bp).connect(g).connect(master)
  s.start(at)
  s.stop(at + length)
  for (let t = 0; t < length; t += 0.15 + Math.random() * 0.5) hat(at + t, 0.04 + Math.random() * 0.05)
}

// Schedules one bar (four beats) at a time, a little ahead, so timing stays
// exact even if the page is busy.
function startLoop() {
  let bar = 0
  let next = ctx.currentTime + 0.05
  const schedule = () => {
    while (next < ctx.currentTime + 1.5) {
      const c = bar % 4
      CHORDS[c].forEach((f, i) => key(f, next + i * 0.012, BEAT * 3.6, 0.07))
      key(CHORDS[c][3] * 2, next + BEAT * 2.5, BEAT * 1.4, 0.035) // a high note answering
      key(BASS[c], next, BEAT * 1.8, 0.22)
      key(BASS[c], next + BEAT * 2, BEAT * 1.6, 0.18)
      kick(next)
      kick(next + BEAT * 2)
      if (bar % 2) kick(next + BEAT * 2.75)
      for (let b = 0; b < 4; b++) hat(next + b * BEAT + BEAT / 2, 0.09)
      crackle(next, BEAT * 4)
      next += BEAT * 4
      bar++
    }
  }
  schedule()
  clearInterval(timer)
  timer = setInterval(schedule, 400)
}
