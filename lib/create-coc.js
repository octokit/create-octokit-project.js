module.exports = createCoc;

const {
  readFileSync,
  promises: { writeFile }
} = require("fs");
const { join: pathJoin } = require("path");

const cocText = readFileSync(
  pathJoin(process.cwd(), "node_modules/conduct/vendor/code-of-conduct.en.md"),
  "utf8"
);

async function createCoc(email) {
  const contributorCovenantText = cocText.replace(
    "[INSERT EMAIL ADDRESS]",
    email
  );
  await writeFile("CODE_OF_CONDUCT.md", contributorCovenantText + "\n");
}
