module.exports = createUpdatePrettierAction;

const writePrettyFile = require("./write-pretty-file");

async function createUpdatePrettierAction({ owner }) {
  const githubTokenSecretName =
    owner === "octokit" ? "OCTOKITBOT_PAT" : "GITHUB_TOKEN";

  await writePrettyFile(
    ".github/workflows/update-prettier.yml",
    `name: Update Prettier
on:
  push:
    branches:
      - "dependabot/npm_and_yarn/prettier-*"
  workflow_dispatch: {}
jobs:
  update_prettier:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "lts/*"
          cache: npm
      - run: npm ci
      - run: npm run lint:fix
      - uses: gr2m/create-or-update-pull-request-action@v1.x
        env:
          GITHUB_TOKEN: \${{ secrets.${githubTokenSecretName} }}
        with:
          title: "Prettier updated"
          body: "An update to prettier required updates to your code."
          branch: \${{ github.ref }}
          commit-message: "style: prettier"
`
  );
}
