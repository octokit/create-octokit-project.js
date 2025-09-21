import { writePrettyFile } from "./write-pretty-file.js";
export { createVitestConfig };

async function createVitestConfig() {
  const config = `import { defineConfig } from "vite";

export default defineConfig({
  test: {
    coverage: {
      include: ["src/**/*.ts"],
      reporter: ["html"],
      thresholds: {
        100: true,
      },
    },
  },
});
`;

  await writePrettyFile("vitest.config.js", config);
}
