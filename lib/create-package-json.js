export { createPackageJson };

import { writePrettyFile } from "./write-pretty-file.js";

const OCTOKIT_PLUGIN_PEER_DEPENDENCIES = {
  "@octokit/core": ">= 3",
};

async function createPackageJson(answers) {
  const pkg = {
    name: answers.packageName,
    version: "0.0.0-development",
    description: answers.description,
    scripts: {
      build: "node scripts/build.mjs && tsc -p tsconfig.json",
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
      transform: {
        "^.+\\.tsx?$": [
          "ts-jest",
          {
            tsconfig: "test/tsconfig.json",
          },
        ],
      },
      moduleNameMapper: {
        "^(.+)\\.jsx?$": "$1",
      },
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
      provenance: true,
    };
  }

  if (answers.isPlugin) {
    Object.assign(pkg.peerDependencies, OCTOKIT_PLUGIN_PEER_DEPENDENCIES);
  }

  await writePrettyFile("package.json", JSON.stringify(pkg));
}
