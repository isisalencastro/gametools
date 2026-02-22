import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#0A66C2',
          dark: '#0B1220',
          yellow: '#F5C542'
        }
      }
    }
  },
  plugins: []
};

export default config;
