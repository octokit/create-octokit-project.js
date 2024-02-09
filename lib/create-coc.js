export { createCoc };

import { readFileSync } from "node:fs";
import { join as pathJoin } from "node:path";
import { fileURLToPath } from "node:url";

import { writePrettyFile } from "./write-pretty-file.js";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const cocText = readFileSync(
  pathJoin(__dirname, "..", "vendor", "code-of-conduct.en.md"),
  "utf8",
);

async function createCoc(email) {
  const contributorCovenantText = cocText.replace(
    "[INSERT EMAIL ADDRESS]",
    email,
  );
  await writePrettyFile("CODE_OF_CONDUCT.md", contributorCovenantText);
}
