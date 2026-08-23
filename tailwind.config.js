/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],
      },
      colors: {
        background: ({ opacityValue }) => opacityValue !== undefined ? `rgba(var(--background-rgb), ${opacityValue})` : `rgb(var(--background-rgb))`,
        foreground: ({ opacityValue }) => opacityValue !== undefined ? `rgba(var(--foreground-rgb), ${opacityValue})` : `rgb(var(--foreground-rgb))`,
        card: {
          DEFAULT: ({ opacityValue }) => opacityValue !== undefined ? `rgba(var(--card-rgb), ${opacityValue})` : `rgb(var(--card-rgb))`,
          foreground: ({ opacityValue }) => opacityValue !== undefined ? `rgba(var(--card-foreground-rgb), ${opacityValue})` : `rgb(var(--card-foreground-rgb))`,
        },
        popover: {
          DEFAULT: ({ opacityValue }) => opacityValue !== undefined ? `rgba(var(--popover-rgb), ${opacityValue})` : `rgb(var(--popover-rgb))`,
          foreground: ({ opacityValue }) => opacityValue !== undefined ? `rgba(var(--popover-foreground-rgb), ${opacityValue})` : `rgb(var(--popover-foreground-rgb))`,
        },
        muted: {
          DEFAULT: ({ opacityValue }) => opacityValue !== undefined ? `rgba(var(--muted-rgb), ${opacityValue})` : `rgb(var(--muted-rgb))`,
          foreground: ({ opacityValue }) => opacityValue !== undefined ? `rgba(var(--muted-foreground-rgb), ${opacityValue})` : `rgb(var(--muted-foreground-rgb))`,
        },
        accent: {
          DEFAULT: ({ opacityValue }) => opacityValue !== undefined ? `rgba(var(--accent-rgb), ${opacityValue})` : `rgb(var(--accent-rgb))`,
          foreground: ({ opacityValue }) => opacityValue !== undefined ? `rgba(var(--accent-foreground-rgb), ${opacityValue})` : `rgb(var(--accent-foreground-rgb))`,
        },
        border: ({ opacityValue }) => opacityValue !== undefined ? `rgba(var(--border-rgb), ${opacityValue})` : `rgb(var(--border-rgb))`,
        input: ({ opacityValue }) => opacityValue !== undefined ? `rgba(var(--input-rgb), ${opacityValue})` : `rgb(var(--input-rgb))`,
        ring: ({ opacityValue }) => opacityValue !== undefined ? `rgba(var(--ring-rgb), ${opacityValue})` : `rgb(var(--ring-rgb))`,
      },
      animation: {
        'marquee': 'marquee 25s linear infinite',
        'gradient-shift': 'gradient-shift 15s ease infinite',
        'gradient-flow': 'gradient-flow 8s ease infinite',
        'float': 'float 20s ease-in-out infinite',
        'float-hero': 'float-hero 15s ease-in-out infinite',
        'wave': 'wave 10s ease-in-out infinite',
        'wave-slow': 'wave-slow 15s ease-in-out infinite',
        'wave-slower': 'wave-slower 20s ease-in-out infinite',
        'pause-marquee': 'paused',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        'gradient-shift': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        'gradient-flow': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': '0% 50%'
          },
          '50%': {
            'background-size': '400% 400%',
            'background-position': '100% 50%'
          },
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0px) translateX(0px)',
            opacity: '0.3',
          },
          '33%': {
            transform: 'translateY(-20px) translateX(10px)',
            opacity: '0.6',
          },
          '66%': {
            transform: 'translateY(10px) translateX(-10px)',
            opacity: '0.4',
          },
        },
        'float-hero': {
          '0%, 100%': {
            transform: 'translateY(0px) translateX(0px)',
            opacity: '0.4',
          },
          '33%': {
            transform: 'translateY(-30px) translateX(20px)',
            opacity: '0.8',
          },
          '66%': {
            transform: 'translateY(20px) translateX(-15px)',
            opacity: '0.5',
          },
        },
        wave: {
          '0%, 100%': {
            transform: 'translateX(0%)',
          },
          '50%': {
            transform: 'translateX(-25%)',
          },
        },
        'wave-slow': {
          '0%, 100%': {
            transform: 'translateX(0%) translateY(0px)',
          },
          '50%': {
            transform: 'translateX(-15%) translateY(-10px)',
          },
        },
        'wave-slower': {
          '0%, 100%': {
            transform: 'translateX(0%) translateY(0px)',
          },
          '50%': {
            transform: 'translateX(10%) translateY(5px)',
          },
        },
      },
    },
  },
  plugins: [],
};
