module.exports = createRenovateConfig;

const writePrettyFile = require("./write-pretty-file");

const config = {
  extends: ["github>octokit/.github"],
};

async function createRenovateConfig() {
  await writePrettyFile(".github/renovate.json", JSON.stringify(config));
}
