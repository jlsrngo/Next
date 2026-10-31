import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    borderRadius: {
      none: '0px',
      sm: '0px',
      DEFAULT: '0px',
      md: '0px',
      lg: '0px',
      xl: '0px',
      '2xl': '0px',
      '3xl': '0px',
      full: '0px',
    },
    extend: {
      colors: {
        bg: {
          DEFAULT: 'var(--bg)',
          raised: 'var(--bg-raised)',
          sunken: 'var(--bg-sunken)',
        },
        ink: {
          DEFAULT: 'var(--ink)',
          strong: 'var(--ink-strong)',
        },
        muted: 'var(--muted)',
        faint: 'var(--faint)',
        line: {
          DEFAULT: 'var(--line)',
          strong: 'var(--line-strong)',
        },
        'invert-bg': 'var(--invert-bg)',
        'invert-fg': 'var(--invert-fg)',
        accent: {
          DEFAULT: 'var(--accent)',
          light: 'var(--accent-light)',
          dark: 'var(--accent-dark)',
          darker: 'var(--accent-darker)',
          subtle: 'var(--accent-subtle)',
          border: 'var(--accent-border)',
        },
        dark: {
          bg: '#121316',
          sidebar: '#101014',
          card: '#101014',
          border: 'rgba(242, 241, 238, 0.15)',
          text: '#f2f1ee',
          muted: 'rgba(242, 241, 238, 0.6)',
        },
        light: {
          bg: '#f2f1ee',
          sidebar: '#faf9f7',
          card: '#faf9f7',
          border: 'rgba(16, 16, 20, 0.16)',
          text: '#101014',
          muted: 'rgba(16, 16, 20, 0.62)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'var(--font-inter)', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', 'var(--font-instrument)', 'Georgia', 'serif'],
        display: ['Archivo', 'var(--font-archivo)', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
