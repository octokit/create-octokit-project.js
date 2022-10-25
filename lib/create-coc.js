export default createCoc;

import { readFileSync } from "fs";
import { join as pathJoin } from "path";

import writePrettyFile from "./write-pretty-file.js";

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

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
