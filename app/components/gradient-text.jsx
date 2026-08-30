'use client'

/**
 * Flowing gradient sweep across a run of text. Replaces the marker highlight,
 * which put ink on a yellow ground and failed contrast in both themes.
 *
 * Every stop in the gradient is a token that already passes contrast against
 * the page ground, so the text stays readable at every point in the sweep
 * rather than only at the ends. The animation is CSS, so it runs off the main
 * thread, and it stops entirely under prefers-reduced-motion, settling on ink.
 */
export default function GradientText({ children, className = '' }) {
  return <span className={`gradient-text ${className}`.trim()}>{children}</span>
}
