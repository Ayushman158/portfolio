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
export default function SkillsGravity({ items }) {
  const wellRef = useRef(null)
  const tileRefs = useRef([])

  useEffect(() => {
    const well = wellRef.current
    if (!well) return

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

    // One body per tile, dropped from above the well with a little spin.
    const bodies = tileRefs.current.filter(Boolean).map((el, i) => {
      const r = el.offsetWidth / 2
      const body = Bodies.circle(
        W * (0.12 + (0.76 / Math.max(1, tileRefs.current.filter(Boolean).length - 1)) * i) + (Math.random() * 16 - 8),
        -80 - i * 90,
        r,
        { restitution: 0.45, friction: 0.28, frictionAir: 0.012, density: 0.0012 }
      )
      Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.18)
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
  }, [items])

  return (
    <div
      ref={wellRef}
      // The tools are named in server-rendered text above; these are their marks.
      // Decorative, so the whole well is hidden from assistive tech rather than
      // read out a second time.
      aria-hidden="true"
      className="relative mt-6 h-[260px] w-full overflow-hidden rounded-lg border border-rule bg-raised"
    >
      {items.map((item, i) => (
        <div
          key={item.label}
          ref={(el) => (tileRefs.current[i] = el)}
          title={item.label}
          className="absolute left-0 top-0 flex h-14 w-14 select-none items-center justify-center rounded-full border border-rule bg-ground shadow-sm will-change-transform"
          // Resting layout along the floor of the well, wrapping at four so it
          // still fits the 327px well on a 375px screen. Physics overwrites this
          // on its first frame; until then — and if the engine never starts at
          // all, because the chunk failed or the tab is throttled — the tools
          // read as a deliberate arrangement rather than a stack in the corner.
          style={{
            cursor: 'grab',
            transform: `translate3d(${12 + (i % 4) * 62}px, ${190 - Math.floor(i / 4) * 66}px, 0)`,
          }}
        >
          {item.mark}
        </div>
      ))}
    </div>
  )
}
