export default writePrettyFile;

import { mkdir, writeFile } from "fs/promises";
import { extname, dirname } from "path";

import { format } from "prettier";

async function writePrettyFile(path, content) {
  const ext = extname(path);

  // make sure the path exists
  await mkdir(dirname(path), { recursive: true });

  if (!ext) {
    return writeFile(path, content + "\n");
  }

  const parser = {
    ".json": "json",
    ".md": "markdown",
    ".ts": "typescript",
    ".yml": "yaml",
    ".js": "babel",
    ".mjs": "babel",
  }[ext];

  if (!parser) throw new Error(`Define parser for ${path}`);

  await writeFile(
    path,
    format(content, {
      parser,
    })
  );
}
