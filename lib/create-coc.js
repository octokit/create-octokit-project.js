module.exports = createCoc;

const { readFileSync } = require("fs");
const { join: pathJoin } = require("path");

const writePrettyFile = require("./write-pretty-file");

const cocText = readFileSync(
  pathJoin(__dirname, "..", "vendor", "code-of-conduct.en.md"),
  "utf8"
);

async function createCoc(email) {
  const contributorCovenantText = cocText.replace(
    "[INSERT EMAIL ADDRESS]",
    email
  );
  await writePrettyFile("CODE_OF_CONDUCT.md", contributorCovenantText);
}
