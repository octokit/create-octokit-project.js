module.exports = createPackageJson;

const writePrettyFile = require("./write-pretty-file");

const OCTOKIT_PLUGIN_PEER_DEPENDENCIES = {
  "@octokit/core": ">= 3",
};

async function createPackageJson(answers) {
  const pkg = {
    name: answers.packageName,
    version: "0.0.0-development",
    description: answers.description,
    scripts: {
      build: "pika-pack build",
      lint: "prettier --check '{src,test}/**/*' README.md package.json",
      "lint:fix": "prettier --write '{src,test}/**/*' README.md package.json",
      pretest: "npm run -s lint",
      test: "jest --coverage",
    },
    repository: `github:${answers.repository}`,
    keywords: ["github", "api", "sdk", "toolkit"],
    author: answers.packageAuthor,
    license: "MIT",
    dependencies: {},
    devDependencies: {},
    peerDependencies: {},
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
      branches: [
        "+([0-9]).x",
        "main",
        "next",
        {
          name: "beta",
          prerelease: true,
        },
      ],
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
  if (answers.isPlugin) {
    Object.assign(pkg.peerDependencies, OCTOKIT_PLUGIN_PEER_DEPENDENCIES);
  }

  await writePrettyFile("package.json", JSON.stringify(pkg));
}
