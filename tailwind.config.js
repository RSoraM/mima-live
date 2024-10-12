import { addDynamicIconSelectors } from '@iconify/tailwind';
import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      'light',
      'dark',
      'synthwave',
      'lofi',
      'dracula',
      'cmyk',
      'business',
      'acid',
    ],
  },
  plugins: [
    daisyui,
    addDynamicIconSelectors(),
  ],
};
