/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/*.css',
    './{templates,components,stories}/**/*.twig',
    './node_modules/flowbite/**/*.js',
  ],
  watchOptions: {
    ignored: /node_modules/,
    usePolling: true,  // Włącza polling, by monitorować zmiany
    interval: 1000,    // Sprawdza zmiany co 1 sekundę
  },
  theme: {
    extend: {},
  },
   plugins: [
    require('flowbite/plugin')
  ],
};

