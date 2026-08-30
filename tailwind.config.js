/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        caveat: ['var(--font-caveat)', 'cursive'],
        'reenie-beanie': ['var(--font-reenie-beanie)', 'cursive'],
      },
      colors: {
        ground: 'var(--ground)',
        raised: 'var(--raised)',
        ink: 'var(--ink)',
        muted: 'var(--muted)',
        faint: 'var(--faint)',
        rule: 'var(--rule)',
        accent: 'var(--accent)',
      },
      maxWidth: {
        measure: 'var(--measure)',
      },
      transitionTimingFunction: {
        'smooth-out': 'cubic-bezier(0.22, 1, 0.36, 1)',
        'ease-out-strong': 'cubic-bezier(0.23, 1, 0.32, 1)',
      },
    },
  },
  plugins: [],
}
