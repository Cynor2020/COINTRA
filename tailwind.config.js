const withOpacityValue = (variable) => {
  return ({ opacityValue } = {}) => {
    if (opacityValue === undefined) {
      return `rgb(var(${variable}))`;
    }
    return `rgb(var(${variable}) / ${opacityValue})`;
  };
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'bg-900': withOpacityValue('--color-bg-900'),
        'bg-800': withOpacityValue('--color-bg-800'),
        surface: withOpacityValue('--color-surface'),
        card: withOpacityValue('--color-card'),
        muted: withOpacityValue('--color-muted'),
        'primary-text': withOpacityValue('--color-primary-text'),
        'accent-blue': withOpacityValue('--color-accent-blue'),
        'accent-green': withOpacityValue('--color-accent-green'),
        'accent-red': withOpacityValue('--color-accent-red'),
        'accent-orange': '#f97316',
        'neutral-weak': withOpacityValue('--color-neutral-weak'),
      },
      fontFamily: {
        sans: ['Inter', 'Space Grotesk', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft-glow': '0 6px 18px rgba(59,130,246,0.06)',
        neon: '0 6px 30px rgba(59,130,246,0.10)',
        orange: '0 0 25px rgba(249, 115, 22, 0.45)',
        'orange-glow': '0 0 30px rgba(249, 115, 22, 0.5)',
        'orange-glow-lg': '0 0 50px rgba(249, 115, 22, 0.6)',
      },
      backgroundImage: {
        'grid-glow': 'linear-gradient(120deg, rgba(249,115,22,0.08), transparent)',
      },
    },
  },
  plugins: [],
};