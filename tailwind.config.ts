import type { Config } from 'tailwindcss';
import scrollbarPlugin from 'tailwind-scrollbar';

const config: Config = {
  content: ['./src/pages/**/*.{js,ts,jsx,tsx,mdx}', './src/components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {},
  },
  plugins: [scrollbarPlugin],
};
export default config;
