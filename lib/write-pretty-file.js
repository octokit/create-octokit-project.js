module.exports = writePrettyFile;

const { mkdir, writeFile } = require("fs").promises;
const { extname, dirname } = require("path");

const pretier = require("prettier");

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
  }[ext];

  if (!parser) throw new Error(`Define parser for ${path}`);

  await writeFile(
    path,
    pretier.format(content, {
      parser,
    })
  );
}
