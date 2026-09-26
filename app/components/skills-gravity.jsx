'use client'

import { useEffect, useRef } from 'react'
import Matter from 'matter-js'

/**
 * A physics well: the tool marks drop in, pile up, and can be grabbed and
 * thrown. Built on matter-js, the same engine the fancycomponents gravity
 * component uses.
 *
 * Written focused rather than ported whole. The upstream component is 510 lines
 * covering SVG-path body sampling, a debug renderer and lodash-debounced
 * resizing; none of that is used here, and dead branches in a physics loop are
 * worse than absent ones. What is kept is the part that matters: bodies derived
 * from real DOM elements, walls, and a mouse constraint so the pile is
 * throwable.
 *
 * The engine only runs while the section is on screen — a physics loop ticking
 * behind four screens of scroll is pure cost. Reduced motion never mounts this
 * at all; the caller renders a static row instead.
 */
/*
 * Resting places, as fractions of the well, for the moment before physics
 * takes over (and for good, with reduced motion): the tags along the top, the
 * buttons along the floor. Physics overwrites these on its first frame.
 */
const REST_TAGS = [[0.1, 0.16], [0.4, 0.1], [0.42, 0.46], [0.66, 0.6]]
const REST_BALLS = [[0.16, 0.5], [0.24, 0.74], [0.36, 0.7], [0.5, 0.76], [0.74, 0.22]]

export default function SkillsGravity({ tools, tags, still = false }) {
  const wellRef = useRef(null)
  const tileRefs = useRef([])
  const items = [
    ...tags.map((t) => ({ kind: 'tag', label: t })),
    ...tools.map((t) => ({ kind: 'ball', ...t })),
  ]

  useEffect(() => {
    const well = wellRef.current
    if (!well || still) return

    const { Engine, Runner, Bodies, Composite, Mouse, MouseConstraint, Body } = Matter

    const engine = Engine.create({ gravity: { x: 0, y: 1 } })
    const runner = Runner.create()

    const W = well.clientWidth
    const H = well.clientHeight
    const WALL = 200 // thick walls stop fast bodies tunnelling through

    const walls = [
      Bodies.rectangle(W / 2, H + WALL / 2, W + WALL * 2, WALL, { isStatic: true }),
      Bodies.rectangle(-WALL / 2, H / 2, WALL, H * 4, { isStatic: true }),
      Bodies.rectangle(W + WALL / 2, H / 2, WALL, H * 4, { isStatic: true }),
    ]
    Composite.add(engine.world, walls)

    // One body per piece, dropped from above the well with a little spin: a
    // circle for each button, a rounded rectangle for each paper tag.
    const els = tileRefs.current.filter(Boolean)
    const bodies = els.map((el, i) => {
      el.style.left = '0px'
      el.style.top = '0px'
      const x = W * (0.1 + (0.8 / Math.max(1, els.length - 1)) * i) + (Math.random() * 16 - 8)
      const y = -80 - i * 70
      const feel = { restitution: 0.4, friction: 0.3, frictionAir: 0.014, density: 0.0012 }
      const body = el.dataset.kind === 'tag'
        ? Bodies.rectangle(x, y, el.offsetWidth, el.offsetHeight, { ...feel, chamfer: { radius: 3 }, angle: (Math.random() - 0.5) * 0.12 })
        : Bodies.circle(x, y, el.offsetWidth / 2, feel)
      Body.setAngularVelocity(body, (Math.random() - 0.5) * (el.dataset.kind === 'tag' ? 0.06 : 0.18))
      return { el, body }
    })
    Composite.add(engine.world, bodies.map((b) => b.body))

    // Grab and throw.
    const mouse = Mouse.create(well)
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.18, render: { visible: false } },
    })
    Composite.add(engine.world, mouseConstraint)
    // Let the page keep scrolling over the well instead of the canvas eating it.
    mouse.element.removeEventListener('wheel', mouse.mousewheel)
    mouse.element.removeEventListener('DOMMouseScroll', mouse.mousewheel)

    let frame
    const sync = () => {
      for (const { el, body } of bodies) {
        el.style.transform =
          `translate3d(${body.position.x - el.offsetWidth / 2}px, ${body.position.y - el.offsetHeight / 2}px, 0)` +
          ` rotate(${body.angle}rad)`
      }
      frame = requestAnimationFrame(sync)
    }

    // Only simulate while the section is actually on screen.
    // Device tilt steers gravity, so the pile slides the way the phone leans.
    //
    // Deliberately no permission request. iOS 13+ gates orientation behind
    // DeviceOrientationEvent.requestPermission() called from a user gesture, and
    // a motion-access prompt on a portfolio is friction and mild suspicion spent
    // on a decorative effect. Where the events flow freely they are used; where
    // they do not, the pile stays bottom-heavy and drag-to-throw still works.
    // Nobody is shown a prompt and nobody is told they are missing anything.
    const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))
    const onTilt = (e) => {
      if (!running || e.gamma == null || e.beta == null) return
      const rad = Math.PI / 180
      engine.gravity.x = clamp(Math.sin(e.gamma * rad), -1, 1)
      // Upright (beta ~90) pulls straight down; flat on a table pulls barely at
      // all, which is what actually happens when "down" points into the screen.
      engine.gravity.y = clamp(Math.sin(e.beta * rad), 0.2, 1)
    }

    let running = false
    const start = () => {
      if (running) return
      running = true
      Runner.run(runner, engine)
      frame = requestAnimationFrame(sync)
      window.addEventListener('deviceorientation', onTilt)
    }
    const stop = () => {
      if (!running) return
      running = false
      Runner.stop(runner)
      cancelAnimationFrame(frame)
      window.removeEventListener('deviceorientation', onTilt)
      // Hand the pile back to plain downward gravity when the section leaves.
      engine.gravity.x = 0
      engine.gravity.y = 1
    }

    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0.15 }
    )
    io.observe(well)

    return () => {
      io.disconnect()
      stop()
      Composite.clear(engine.world, false)
      Engine.clear(engine)
    }
  }, [still])

  return (
    // A drawer pulled out towards you: the tray the pieces sit in, and its
    // front panel with a handle. Physics lives in the tray only.
    <div className="skills-drawer">
    <div
      ref={wellRef}
      // Everything in here is named in server-rendered text beside it; these
      // are the same words and marks as things to play with, so the well is
      // hidden from assistive tech rather than read out a second time.
      aria-hidden="true"
      className="skills-well relative h-[260px] w-full overflow-hidden sm:h-[300px]"
    >
      {items.map((item, i) => {
        const rest = item.kind === 'tag' ? REST_TAGS[i] : REST_BALLS[i - tags.length]
        return (
          <div
            key={item.label}
            ref={(el) => (tileRefs.current[i] = el)}
            data-kind={item.kind}
            title={item.label}
            className={`absolute select-none will-change-transform ${item.kind === 'tag' ? 'skill-tag' : 'skill-ball flex items-center justify-center rounded-full'}`}
            style={{
              cursor: still ? 'default' : 'grab',
              left: `${(rest?.[0] ?? 0.1) * 100}%`,
              top: `${(rest?.[1] ?? 0.5) * 100}%`,
              ...(item.kind === 'ball' ? { '--ball': item.ball } : { transform: `rotate(${i % 2 ? 1.5 : -1.5}deg)` }),
            }}
          >
            {item.kind === 'tag' ? item.label : item.mark}
          </div>
        )
      })}
    </div>
    <div aria-hidden="true" className="drawer-front relative h-9">
      <span className="drawer-handle absolute left-1/2 top-1/2 block h-2 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full" />
    </div>
    </div>
  )
}
