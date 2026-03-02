/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // SpotlightReady brand palette – dark, professional, performance-oriented
        brand: {
          50: '#f0f4ff',
          100: '#dde6ff',
          200: '#c0cfff',
          300: '#93adff',
          400: '#607dff',
          500: '#3b52ff',  // primary
          600: '#2130f5',
          700: '#1a25e0',
          800: '#1b22b5',
          900: '#1c228f',
          950: '#111355',
        },
        accent: {
          cyan: '#00e5ff',
          green: '#00e676',
          amber: '#ffab00',
          red: '#ff1744',
        },
        surface: {
          // Dark surfaces for immersive simulation environment
          950: '#0a0a0f',
          900: '#111118',
          800: '#1a1a24',
          700: '#24243a',
          600: '#2e2e4a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.4s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'score-reveal': 'scoreReveal 1.2s ease-out',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        scoreReveal: { from: { strokeDashoffset: '283' }, to: { strokeDashoffset: '0' } },
      },
    },
  },
  plugins: [],
}
