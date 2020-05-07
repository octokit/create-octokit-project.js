module.exports = createReadme;

const { writeFile } = require("fs").promises;

async function createReadme({
  repository,
  repo,
  description,
  packageName,
  addWip,
  addBadges,
  addUsage,
  supportsBrowsers,
  supportsNode,
  isPlugin,
  exportName,
  usageExample
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
[![Build Status](https://github.com/${repository}/workflows/Test/badge.svg)](https://github.com/${repository}/actions?query=workflow%3ATest+branch%3Amaster)
[![Greenkeeper](https://badges.greenkeeper.io/${repository}.svg)](https://greenkeeper.io/)

`;
  }

  if (addUsage) {
    content += `## Usage

<table>
<tbody valign=top align=left>
<tr><th>

Browsers

</th><td width=100%>

`;

    if (supportsBrowsers) {
      if (isPlugin) {
        content += `Load \`${packageName}\` and [\`@octokit/core\`](https://github.com/octokit/core.js) (or core-compatible module) directly from [cdn.pika.dev](https://cdn.pika.dev)

\`\`\`html
<script type="module">
  import { Octokit } from "https://cdn.pika.dev/@octokit/core";
  import { ${exportName} } from "https://cdn.pika.dev/${packageName}";
</script>
\`\`\`

`;
      } else {
        content += `Load \`${packageName}\` directly from [cdn.pika.dev](https://cdn.pika.dev)

\`\`\`html
<script type="module">
  import { ${exportName} } from "https://cdn.pika.dev/${packageName}";
</script>
\`\`\`

`;
      }
    } else {
      content += `\`${packageName}\` is not meant for browser usage.
      
`;
    }

    content += `</td></tr>
<tr><th>

Node

</th><td>

`;
    if (supportsNode) {
      if (isPlugin) {
        content += `Install with \`npm install @octokit/core ${packageName}\`. Optionally replace \`@octokit/core\` with a core-compatible module

\`\`\`js
const { Octokit } = require("@octokit/core");
const { ${exportName} } = require("${packageName}");
\`\`\`

`;
      } else {
        content += `Install with \`npm install @octokit/core ${packageName}\`

\`\`\`js
const { ${exportName} } = require("${packageName}");
\`\`\`

`;
      }
    } else {
      content += `\`${packageName}\` is not meant for Node usage.
      
`;
    }
    content += `</td></tr>
</tbody>
</table>

\`\`\`js
${usageExample}
\`\`\`

`;
  }

  // footer
  content += `## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)
  
## License

[MIT](LICENSE)
`;

  await writeFile(`README.md`, content);
}
