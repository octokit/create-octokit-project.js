export { createReleaseAction };

import { writePrettyFile } from "./write-pretty-file.js";

async function createReleaseAction({ owner }) {
  const npmTokenSecretName =
    owner === "octokit" ? "OCTOKITBOT_NPM_TOKEN" : "NPM_TOKEN";
  await writePrettyFile(
    ".github/workflows/release.yml",
    `name: Release
on:
  push:
    branches:
      - main
      - next
      - beta
      - "*.x" # maintenance release branches, e.g. v1.x
# These are recommended by the semantic-release docs: https://github.com/semantic-release/npm#npm-provenance
permissions:
    contents: write # to be able to publish a GitHub release
    issues: write # to be able to comment on released issues
    pull-requests: write # to be able to comment on released pull requests
    id-token: write # to enable use of OIDC for npm provenance

jobs:
  release:
    name: release
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "lts/*"
          cache: npm
      - run: npm ci
      - run: npm run build
      - run: npx semantic-release
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: \${{ secrets.${npmTokenSecretName} }}
`,
  );
}
