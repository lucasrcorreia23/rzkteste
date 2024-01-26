/** @type {import('tailwindcss').Configuration} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {      
      colors: {
        brandfont: '#091D42',
        brandgreen: '#5ABF9A',
      },
    },
  },
  plugins: [],
}
