// 🎨 Najla Cardeal - QA/Designer
// Configuração do Tailwind CSS com design system Apple-like

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Apple Colors - Light Mode
        apple: {
          white: '#FFFFFF',
          gray: {
            100: '#F5F5F7',
            200: '#E8E8ED',
            300: '#D2D2D7',
            400: '#B0B0B8',
            500: '#86868B',
            600: '#6E6E73',
          },
          text: '#1D1D1F',
          blue: '#0071E3',
          accent: '#0066CC',
        },
        // Dark Mode
        dark: {
          bg: '#000000',
          surface: '#1C1C1E',
          elevated: '#2C2C2E',
          text: '#F5F5F7',
          blue: '#0A84FF',
        },
        // Financial Colors
        financial: {
          success: '#34C759',
          danger: '#FF3B30',
          warning: '#FF9500',
          info: '#0071E3',
        }
      },
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display': ['48px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'h1': ['34px', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
        'h2': ['28px', { lineHeight: '1.3', letterSpacing: '-0.008em', fontWeight: '600' }],
        'h3': ['22px', { lineHeight: '1.4', letterSpacing: '-0.006em', fontWeight: '600' }],
        'body': ['17px', { lineHeight: '1.5', letterSpacing: '-0.004em', fontWeight: '400' }],
        'caption': ['13px', { lineHeight: '1.4', fontWeight: '400' }],
        'overline': ['11px', { lineHeight: '1.4', fontWeight: '600', textTransform: 'uppercase' }],
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px',
        '3xl': '64px',
      },
      borderRadius: {
        'apple': '18px',
        'apple-sm': '10px',
        'apple-lg': '24px',
        'pill': '980px',
      },
      boxShadow: {
        'apple': '0 4px 30px rgba(0, 0, 0, 0.08)',
        'apple-lg': '0 8px 50px rgba(0, 0, 0, 0.12)',
        'apple-sm': '0 2px 15px rgba(0, 0, 0, 0.06)',
      },
      backdropBlur: {
        'apple': '20px',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}