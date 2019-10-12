module.exports = createReadme;

const { writeFile } = require("fs").promises;

async function createReadme({
  repository,
  repo,
  description,
  packageName,
  addWip,
  addBadges
}) {
  let content = "";

  if (addWip) {
    // WIP banner
    content += `# 🚧 WORK IN PROGRESS. See [#1](https://github.com/${repository}/pull/1)

`;
  }

  // header
  content += `# ${repo}

> ${description}

`;

  if (addBadges) {
    content += `[![@latest](https://img.shields.io/npm/v/${packageName}.svg)](https://www.npmjs.com/package/${packageName})
[![Build Status](https://github.com/${repository}/workflows/Test/badge.svg)](https://github.com/${repository}/actions?workflow=Test)
[![Greenkeeper](https://badges.greenkeeper.io/${repository}.svg)](https://greenkeeper.io/)

`;
  }

  // footer
  content += `## License

[MIT](LICENSE)
`;

  await writeFile(`README.md`, content);
}
