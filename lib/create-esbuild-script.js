export { createEsbuildScript };

import { writePrettyFile } from "./write-pretty-file.js";

async function createEsbuildScript(answers) {
  const nodeBuildOptions = `  // Build an ESM Node.js bundle
  await esbuild.build({
    entryPoints,
    outdir: "pkg/dist-node",
    bundle: true,
    platform: "node",
    target: "node18",
    format: "esm",
    ...sharedOptions,
  })`;
  const browserBuildOptions = `  // Build an ESM browser bundle
  await esbuild.build({
    entryPoints,
    outdir: "pkg/dist-web",
    bundle: true,
    platform: "browser",
    format: "esm",
    ...sharedOptions,
  });`;
  const dualBuildOptions = `  await esbuild.build({
    entryPoints,
    outdir: "pkg/dist-bundle",
    bundle: true,
    platform: "neutral",
    format: "esm",
    ...sharedOptions,
  }),
]);`;
  const nodeJSExports = `exports: {
  ".": {
    types: "./dist-types/index.d.ts",
    import: "./dist-node/index.js",
    // Tooling currently are having issues with the "exports" field when there is no "default", ex: TypeScript, eslint
    default: "./dist-node/index.js",
  },
}`;
  const browserExports = `exports: {
  ".": {
    types: "./dist-types/index.d.ts",
    import: "./dist-browser/index.js",
    // Tooling currently are having issues with the "exports" field when there is no "default", ex: TypeScript, eslint
    default: "./dist-browser/index.js",
  },
}`;
  const dualExports = `exports: {
  ".": {
    types: "./dist-types/index.d.ts",
    import: "./dist-bundle/index.js",
    // Tooling currently are having issues with the "exports" field when there is no "default", ex: TypeScript, eslint
    default: "./dist-bundle/index.js",
  },
}`;

  await writePrettyFile(
    "scripts/esbuild.mjs",
    `// @ts-check
import esbuild from "esbuild";
import { copyFile, readFile, writeFile, rm } from "node:fs/promises";
import { glob } from "glob";

/**
 * @type {esbuild.BuildOptions}
 */
const sharedOptions = {
  sourcemap: "external",
  sourcesContent: true,
  minify: false,
  allowOverwrite: true,
  packages: "external",
};

async function main() {
  // Start with a clean slate
  await rm("pkg", { recursive: true, force: true });
  // Build the source code for a neutral platform as ESM
  await esbuild.build({
    entryPoints: await glob(["./src/*.ts", "./src/**/*.ts"]),
    outdir: "pkg/dist-src",
    bundle: false,
    platform: "neutral",
    format: "esm",
    ...sharedOptions,
    sourcemap: false,
  });

  // Remove the types file from the dist-src folder
  const typeFiles = await glob([
    "./pkg/dist-src/**/types.js.map",
    "./pkg/dist-src/**/types.js",
  ]);
  for (const typeFile of typeFiles) {
    await rm(typeFile);
  }

  const entryPoints = ["./pkg/dist-src/index.js"];\n
      ${
        answers.supportsBrowsers && answers.supportsNode
          ? dualExports
          : answers.supportsNode
            ? nodeJSExports
            : answers.supportsBrowsers
              ? browserExports
              : ""
      }\n
  // Copy the README, LICENSE to the pkg folder
  await copyFile("LICENSE", "pkg/LICENSE");
  await copyFile("README.md", "pkg/README.md");

  // Handle the package.json
  let pkg = JSON.parse((await readFile("package.json", "utf8")).toString());
  // Remove unnecessary fields from the package.json
  delete pkg.scripts;
  delete pkg.prettier;
  delete pkg.release;
  delete pkg.jest;
  await writeFile(
    "pkg/package.json",
    JSON.stringify(
      {
        ...pkg,
        files: ["dist-*/**", "bin/**"],
        types: "dist-types/index.d.ts",
        source: "dist-src/index.js",
        ${
          answers.supportsBrowsers && answers.supportsNode
            ? dualBuildOptions
            : answers.supportsNode
              ? nodeBuildOptions
              : answers.supportsBrowsers
                ? browserBuildOptions
                : ""
        },\n
        sideEffects: false,
      },
      null,
      2
    )
  );
}
main();
`,
  );
}
