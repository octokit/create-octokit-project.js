module.exports = createTestAction;

const { writeFile } = require("fs").promises;

async function createTestAction() {
  await writeFile(
    ".github/workflows/test.yml",
    `name: Test
on:
  push:
    branches:
      - "greenkeeper/**"
  pull_request:
    types: [opened, synchronize]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node_version: ["10", "12", "13"]

    steps:
      - uses: actions/checkout@v2
      - name: Use Node.js \${{ matrix.node_version }}
        uses: actions/setup-node@v1
        with:
          node-version: \${{ matrix.node_version }}
      - name: Install
        run: npm ci
      - name: Test
        run: npm test
`
  );
}
