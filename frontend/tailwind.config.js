import { tailwindConfig } from '@neo4j-ndl/base';
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './public/index.html',
    './src/**/*.{html,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

module.exports = {
  presets: [tailwindConfig],
  prefix: '',
  corePlugins: {
    preflight: false,
  },
};