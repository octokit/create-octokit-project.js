module.exports = createPackageJson;

const { writeFile } = require("fs").promises;

async function createPackageJson(answers) {
  const pkg = {
    name: answers.packageName,
    version: "0.0.0-development",
    description: answers.description,
    scripts: {
      build: "pika build",
      lint: "prettier --check '{src,test}/**/*' README.md package.json",
      "lint:fix": "prettier --write '{src,test}/**/*' README.md package.json",
      pretest: "npm run -s lint",
      test: "jest --coverage",
    },
    repository: `https://github.com/${answers.repository}`,
    keywords: ["github", "api", "sdk", "toolkit"],
    author: answers.packageAuthor,
    license: "MIT",
    dependencies: {},
    devDependencies: {},
    jest: {
      preset: "ts-jest",
      coverageThreshold: {
        global: {
          statements: 100,
          branches: 100,
          functions: 100,
          lines: 100,
        },
      },
    },
    "@pika/pack": {
      pipeline: [["@pika/plugin-ts-standard-pkg"]],
    },
    release: {
      plugins: [
        "@semantic-release/commit-analyzer",
        "@semantic-release/release-notes-generator",
        "@semantic-release/github",
        [
          "@semantic-release/npm",
          {
            pkgRoot: "./pkg",
          },
        ],
        [
          "semantic-release-plugin-update-version-in-files",
          {
            files: ["pkg/dist-web/*", "pkg/dist-node/*", "pkg/*/version.*"],
          },
        ],
      ],
    },
  };

  if (answers.publicAccess) {
    pkg.publishConfig = {
      access: "public",
    };
  }

  if (answers.supportsNode) {
    pkg["@pika/pack"].pipeline.push(["@pika/plugin-build-node"]);
  }
  if (answers.supportsBrowsers) {
    pkg["@pika/pack"].pipeline.push(["@pika/plugin-build-web"]);
  }

  await writeFile("package.json", JSON.stringify(pkg, null, 2) + "\n");
}
