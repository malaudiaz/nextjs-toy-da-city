import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        yellow:{
            "100" : "#FBEEDA",
            "200" : "#F9E6C7",
            "300" : "#F6DDB4",
            "400" : "#F4D5A2",
            "500" : "#F2CC8F",
            "600" : "#CAAA77",
            "700" : "#A1885F",
            "800" : "#796648",
            "900" : "#514430",
          }
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        mono: ['var(--font-roboto-mono)'],
      },
      borderRadius: {
        'figma-sm': '4px',
        'figma-lg': '12px',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
  ],
};

export default config;


