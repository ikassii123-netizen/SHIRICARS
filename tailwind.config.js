/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        marine: {
          50:  '#f0f4ff',
          100: '#e0e9ff',
          600: '#1a3a6b',
          700: '#0f2a52',
          800: '#0a1e3d',
          900: '#060f24',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
