module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#EAF1F8',
          100: '#D2E2F0',
          200: '#A6C5E0',
          300: '#75A3CC',
          400: '#4A80B3',
          500: '#2E6296',
          600: '#1E4B78',
          700: '#153A5E',
          800: '#0F2E4E',
          900: '#0A2038',
        },
        gold: {
          50: '#FBF3E3',
          100: '#F5E4BE',
          200: '#EBCB86',
          300: '#DFB158',
          400: '#D4A93E',
          500: '#C9962E',
          600: '#A97A22',
          700: '#87601B',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(15, 46, 78, 0.06), 0 4px 16px rgba(15, 46, 78, 0.07)',
        'card-hover': '0 8px 28px rgba(15, 46, 78, 0.14)',
        cta: '0 8px 24px rgba(30, 75, 120, 0.28)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};
