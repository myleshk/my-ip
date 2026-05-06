import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5050",
    specPattern: "cypress/integration/**/*.spec.{js,ts,jsx,tsx}",
    supportFile: "cypress/support/index.ts",
  },
});
