module.exports = createReleaseAction;

const writePrettyFile = require("./write-pretty-file");

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

jobs:
  release:
    name: release
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: "lts/*"
      - uses: actions/cache@v1
        with:
          path: ~/.npm
          key: \${{ runner.os }}-node-\${{ hashFiles('**/package-lock.json') }}
          restore-keys: |
            \${{ runner.os }}-node-
      - run: npm ci
      - run: npm run build
      - run: npx semantic-release
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: \${{ secrets.${npmTokenSecretName} }}
`
  );
}
