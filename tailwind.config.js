/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bk: {
          bg:       '#080808',
          card:     '#111111',
          card2:    '#191919',
          border:   '#1e1e1e',
          border2:  '#2a2a2a',
          primary:  '#ff6b00',
          text:     '#f0f0f0',
          muted:    '#555555',
          muted2:   '#333333',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        orange: '0 0 24px rgba(255,107,0,0.25)',
      },
      animation: {
        'slide-up':      'slideUp 0.32s cubic-bezier(0.32,0.72,0,1)',
        'fade-in':       'fadeIn 0.2s ease',
        'pulse-dot':     'pulseDot 2s ease-in-out infinite',
        'gorilla-sway':  'gorillaSway 3s ease-in-out infinite',
        'gorilla-bob':   'gorillaBob 0.65s ease-in-out infinite',
        'gorilla-jump':  'gorillaJump 0.9s ease-in-out infinite',
        'toast-in':      'toastIn 0.28s cubic-bezier(0.22,1,0.36,1)',
        'toast-out':     'toastOut 0.2s ease-in forwards',
      },
      keyframes: {
        slideUp: {
          from: { transform: 'translateY(100%)' },
          to:   { transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(5px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        toastIn: {
          from: { opacity: '0', transform: 'translateX(calc(100% + 16px)) scale(0.95)' },
          to:   { opacity: '1', transform: 'translateX(0) scale(1)' },
        },
        toastOut: {
          from: { opacity: '1', transform: 'translateX(0) scale(1)' },
          to:   { opacity: '0', transform: 'translateX(calc(100% + 16px)) scale(0.95)' },
        },
        pulseDot: {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(255,107,0,0.5)' },
          '50%':     { boxShadow: '0 0 0 6px rgba(255,107,0,0)' },
        },
        gorillaSway: {
          '0%,100%': { transform: 'rotate(-2deg) translateY(0px)' },
          '50%':     { transform: 'rotate(2deg) translateY(-3px)' },
        },
        gorillaBob: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':     { transform: 'translateY(-6px)' },
        },
        gorillaJump: {
          '0%,100%': { transform: 'translateY(0px) scale(1)' },
          '40%':     { transform: 'translateY(-14px) scale(1.05)' },
          '60%':     { transform: 'translateY(-10px) scale(1.03)' },
        },
      },
    },
  },
  plugins: [],
}
