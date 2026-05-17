const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: 'jdt4xd',
  allowCypressEnv: false,
  pageLoadTimeout: 120000,
  defaultCommandTimeout: 15000,

  e2e: {
    specPattern: "e2e/**/*.cy.{js,ts}",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
