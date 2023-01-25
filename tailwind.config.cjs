/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',

      // Main light colors
      white: 'rgb(255 255 255 / <alpha-value>)',

      // Main dark colors
      black: 'rgb(0 0 0 / <alpha-value>)',
      bunker: 'rgb(12 15 18 / <alpha-value>)',
      woodsmoke: 'rgb(19 22 27 / <alpha-value>)',
      pearl: 'rgb(21 25 30 / <alpha-value>)',
      shark: 'rgb(26 29 34 / <alpha-value>)',
      cinder: 'rgb(30 34 39 / <alpha-value>)',
      balticSea: 'rgb(40 43 48 / <alpha-value>)',
      arsenic: 'rgb(56 61 70 / <alpha-value>)',

      // Main green colors
      green: 'rgb(48 131 109 / <alpha-value>)',
      jungleGreen: 'rgb(34 161 128 / <alpha-value>)',
      lightGreen: 'rgb(61 187 154 / <alpha-value>)',

      // Main red colors
      claret: 'rgb(147 22 54 / <alpha-value>)',
      oldRose: 'rgb(183 53 86 / <alpha-value>)',
      magenta: 'rgb(237 50 98 / <alpha-value>)',

      // Main yellow codq_ui_kitlors
      yellow: 'rgb(181 130 70 / <alpha-value>)',
      lightYellow: 'rgb(248 180 100 / <alpha-value>)',
    },
    extend: {
      fontFamily: {
        Ubuntu: 'Ubuntu, sans-serif',
        Montserrat: 'Montserrat, sans-serif',
      },
      gridTemplateColumns: {
        'with-sidebar': '200px 3fr',
        'workspace-frame': `1px 1fr 1px`,
       
      },
      gridTemplateRows:{
        'with-header': 'auto 1fr',
        'workspace-frame': `1px 1fr 1px`,
      },
    },
    screens: {
      sm: '540px',
      md: '720px',
      lg: '960px',
      xl: '1140px',
      xxl: '1440px',
      xxxl: '1900px',
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [
    // for vertical text overflow
    // https://www.npmjs.com/package/@tailwindcss/line-clamp
    require('@tailwindcss/line-clamp'),
    require('tailwind-scrollbar-hide'),
  ],
}
