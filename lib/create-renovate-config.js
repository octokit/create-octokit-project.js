export { createRenovateConfig };

import { writePrettyFile } from "./write-pretty-file.js";

const config = {
  extends: ["github>octokit/.github"],
};

async function createRenovateConfig() {
  await writePrettyFile(".github/renovate.json", JSON.stringify(config));
}
