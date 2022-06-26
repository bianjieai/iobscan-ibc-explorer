const spacing = {
  0: 0,
  4: '4px',
  8: '8px',
  12: '12px',
  16: '16px'
}

module.exports = {
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    variants: {
      extend: {},
    },
    plugins: [
      require('@tailwindcss/line-clamp'),
    ],
    theme: {
      margin: spacing,
      padding: spacing
    }
  }