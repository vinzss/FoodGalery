/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FAF6F0',
          100: '#F4EDE2',
          200: '#E9DEC9',
          300: '#DCCBae',
        },
        charcoal: {
          900: '#1F1D1A',
          800: '#33302B',
          700: '#4D4840',
          600: '#6E675F',
          500: '#8F877D',
        },
        terracotta: {
          50: '#FDF3EF',
          100: '#FBE3D9',
          DEFAULT: '#D96C45',
          light: '#E58563',
          dark: '#B8522E',
        },
        olive: {
          50: '#F3F5EE',
          100: '#E5E9DC',
          DEFAULT: '#637048',
          light: '#7E8C60',
          dark: '#4B5635',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'warm': '0 10px 30px -8px rgba(51, 40, 28, 0.07), 0 2px 6px -1px rgba(51, 40, 28, 0.04)',
        'warm-hover': '0 20px 40px -12px rgba(217, 108, 69, 0.18), 0 4px 12px -2px rgba(51, 40, 28, 0.06)',
        'warm-lg': '0 24px 48px -12px rgba(51, 40, 28, 0.12)',
      },
    },
  },
  plugins: [],
}
