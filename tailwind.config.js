const navy = {
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
};

const gold = {
  50: '#FBF3E3',
  100: '#F5E4BE',
  200: '#EBCB86',
  300: '#DFB158',
  400: '#D4A93E',
  500: '#C9962E',
  600: '#A97A22',
  700: '#87601B',
};

module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Figtree Variable"',
          'Figtree',
          'system-ui',
          '-apple-system',
          '"Segoe UI"',
          'Roboto',
          'Arial',
          'sans-serif',
        ],
        display: ['"Fraunces Variable"', 'Fraunces', 'Georgia', '"Times New Roman"', 'serif'],
      },
      colors: {
        // Sémantique : les écrans emploient ces noms, qui disent le rôle et non la teinte
        ink: { DEFAULT: '#1F1C17', 2: '#5B5348', 3: '#8A8174' },
        canvas: '#FAF8F4',
        surface: '#FFFFFF',
        muted: '#F4F0E8',
        line: { DEFAULT: '#E8E2D6', strong: '#D7CEBE' },
        success: { DEFAULT: '#2D6A4F', soft: '#E9F4EE', line: '#BFDECB' },
        danger: { DEFAULT: '#B4382D', soft: '#FBEDEB', line: '#F1C9C3' },
        warning: { DEFAULT: '#9A5B0E', soft: '#FCF3E3', line: '#F1D6A6' },
        info: { DEFAULT: '#2C5A82', soft: '#EBF2F8', line: '#C7D9EA' },

        // Marque : navy, et or réservé à l'action principale
        brand: navy,
        accent: gold,

        // Alias de compatibilité avec les pages déjà écrites
        navy,
        gold,
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],
      },
      letterSpacing: {
        eyebrow: '0.08em',
      },
      boxShadow: {
        xs: '0 1px 2px rgba(31, 28, 23, 0.05)',
        card: '0 1px 2px rgba(31, 28, 23, 0.04), 0 1px 3px rgba(31, 28, 23, 0.04)',
        'card-hover': '0 2px 4px rgba(31, 28, 23, 0.04), 0 12px 28px rgba(31, 28, 23, 0.08)',
        pop: '0 4px 12px rgba(31, 28, 23, 0.06), 0 16px 40px rgba(31, 28, 23, 0.10)',
        focus: '0 0 0 3px rgba(30, 75, 120, 0.18)',
        // Ancien nom, désormais sans halo coloré
        cta: '0 1px 2px rgba(31, 28, 23, 0.08)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      maxWidth: {
        page: '1200px',
        wide: '1440px',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};
