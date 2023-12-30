/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ['./app/**/*.{ts,tsx,jsx,js}'],
  theme: {
    extend: {
      fontWeight: {
        normal: '300',
        bold: '700',
      },
      fontFamily: {
        sans: ['Manrope', ...defaultTheme.fontFamily.sans],
        serif: ['Noto Serif', 'Helvetica'],
      },
      colors: {
        primary: {
          DEFAULT: '#2d7ef4',
          '50': '#eff6ff',
          '100': '#d9e9fd',
          '200': '#bbd9fc',
          '300': '#8dc2fa',
          '400': '#57a2f7',
          '500': '#2d7ef4',
          '600': '#1660ea',
          '700': '#104dd8',
          '800': '#1840af',
          '900': '#1b3b8a',
        },
        secondary: {
          DEFAULT: '#9f78ff',
          '50': '#f5f3ff',
          '100': '#e9e5fb',
          '200': '#d6cef9',
          '300': '#bba9fb',
          '400': '#9f78ff',
          '500': '#8845ff',
          '600': '#7b1bf6',
          '700': '#6d0ede',
          '800': '#5b19b8',
          '900': '#4c1d95',
        },
        background: '#fbfbfb',
        foreground: '#2e2e2e',
        neutral: {
          '50': '#fafafa',
          '100': '#f8f8f8',
          '200': '#ededed',
          '300': '#dedede',
          '400': '#adadad',
          '500': '#7c7c7c',
          '600': '#5c5c5c',
          '700': '#494949',
          '800': '#2e2e2e',
          '900': '#181818',
        },

        green: {
          DEFAULT: '#a1dd84',
          50: '#f3fcf0',
          100: '#e0f6da',
          200: '#c5ebb8',
          300: '#a1dd84',
          400: '#85cd49',
          500: '#73b60e',
          600: '#5f9700',
          700: '#4b7811',
          800: '#3b6018',
          900: '#305019',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(45deg, #2d7ef4, #1660ea)',
        'gradient-secondary': 'linear-gradient(45deg, #9f78ff, #7b1bf6)',
        // More gradient definitions...
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("@tailwindcss/forms")],
};

/**
 * TO USE:
 *
 * <body class="bg-background text-foreground dark:bg-foreground dark:text-background"></div>
 */
