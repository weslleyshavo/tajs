import { defineConfig } from "cypress";
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import preprocessor from "@badeball/cypress-cucumber-preprocessor";
import createESBuildPlugin from "@badeball/cypress-cucumber-preprocessor/esbuild";

async function setupNodeEvents(on, config) {
  await preprocessor.addCucumberPreprocessorPlugin(on, config);
  on(
    "file:preprocessor",
    createBundler({
      plugins: [createESBuildPlugin.default(config)],
    })
  );

  return config;
}

const { WEB_SERVER_URL } = process.env;
if (!WEB_SERVER_URL) {
  console.error("Missing WEB_SERVER_URL environment variable!");
  process.exit(1);
}

export default defineConfig({
  e2e: {
    setupNodeEvents,
    specPattern: "cypress/e2e/features/*.feature",
    baseUrl: WEB_SERVER_URL,
  },
});
