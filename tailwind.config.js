const colors = require('tailwindcss/colors')

function withOpacityValue(variable) {
  return ({ opacityValue }) => {
    if (opacityValue === undefined) {
      return `rgb(var(${variable}))`
    }
    return `rgb(var(${variable}) / ${opacityValue})`
  }
}

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "main-bg": "var(--color-bg)", 
        "nav-top-bg": "var(--color-nav-top-bg)", 
        "nav-left-bg": "var(--color-nav-left-bg)", 
        "nav-title-bg": "var(--color-nav-title-bg)", 
        card: "var(--color-bg-card)", 
        primary: "var(--color-primary)", 
        secondary: "var(--color-secondary)", 
        tersiary: "var(--color-border)",  
        success: "var(--color-success)", 
        info: "var(--color-info)", 
        warning: "var(--color-warning)", 
        error: "var(--color-error)", 
        "hero-bg": "var(--color-secondary)",  
        "panel-bg": "var(--color-bg-card)",  
        "input-bg": "var(--color-input-bg)", 
        "input-text": "var(--color-input-text)", 
        "input-border": "var(--color-border-hover)", // Contoh menggunakan border hover
        "input-bg-active": "var(--color-input-bg-active)", 
        "input-text-active": "var(--color-input-text-active)", 
        "input-border-active": colors.white, // Tetap menggunakan warna Tailwind jika diinginkan
      },
    },
  },
  plugins: [],
}