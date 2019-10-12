module.exports = createCoc;

const {
  readFileSync,
  promises: { writeFile }
} = require("fs");
const { join: pathJoin } = require("path");

const cocText = readFileSync(
  pathJoin(__dirname, "..", "vendor", "code-of-conduct.en.md"),
  "utf8"
);

async function createCoc(email) {
  const contributorCovenantText = cocText.replace(
    "[INSERT EMAIL ADDRESS]",
    email
  );
  await writeFile("CODE_OF_CONDUCT.md", contributorCovenantText + "\n");
}
