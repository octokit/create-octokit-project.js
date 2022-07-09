module.exports = createTestAction;

const writePrettyFile = require("./write-pretty-file");

async function createTestAction() {
  await writePrettyFile(
    ".github/workflows/test.yml",
    `name: Test
on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize]

jobs:
  test_matrix:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node_version: ["12", "14", "16"]

    steps:
      - uses: actions/checkout@v2
      - name: Use Node.js \${{ matrix.node_version }}
        uses: actions/setup-node@v2
        with:
          node-version: \${{ matrix.node_version }}
      - uses: actions/cache@v1
        with:
          path: ~/.npm
          key: \${{ runner.os }}-node-\${{ hashFiles('**/package-lock.json') }}
          restore-keys: |
            \${{ runner.os }}-node-
      - run: npm ci
      - run: npm test --ignore-scripts # run lint only once
    
  test:
    runs-on: ubuntu-latest
    needs: test_matrix
    steps:
      - uses: actions/checkout@v2
      - run: npm ci
      - run: npm run lint
`
  );
}
