/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#006C4C',
        'primary-light': '#00A86B',
        surface: '#FBFDF9',
        'surface-variant': '#DCE5DC',
        'on-surface': '#1A1C19',
        'on-surface-variant': '#414941',
        'secondary-container': '#D4E8D7',
        'on-secondary-container': '#0F1F13',
      },
      fontFamily: {
        sans: ['Roboto', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
