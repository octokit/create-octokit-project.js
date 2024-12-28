import { writePrettyFile } from "./write-pretty-file.js";
export { createVitestConfig };

async function createVitestConfig() {
  const config = `import { defineConfig } from "vite";

export default defineConfig({
  test: {
    coverage: {
      include: ["src/**/*.ts"],
      exclude: ["src/methods/get-oauth-client-code.ts"], // Exclude this file from coverage as it isn't exported
      reporter: ["html"],
      thresholds: {
        branches: 98,
        functions: 100,
        lines: 100,
        statements: 100,
      },
    },
  },
});
`;

  await writePrettyFile("vitest.config.js", config);
}
