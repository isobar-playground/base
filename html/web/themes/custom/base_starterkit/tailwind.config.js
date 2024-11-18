/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/*.css',
    './{templates,components,stories}/**/*.twig',
    './node_modules/flowbite/**/*.js',
  ],
  watchOptions: {
    ignored: /node_modules/,
    usePolling: true,  // Enables polling to monitor changes
    interval: 1000,    // Checks for changes every 1 second
  },
  theme: {
    extend: {},
  },
   plugins: [
    require('flowbite/plugin')
  ],
};

