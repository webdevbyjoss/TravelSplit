const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173', // Vite default
    specPattern: 'cypress/e2e/**/*.cy.{js,ts}',
    supportFile: false,
  },
}); 