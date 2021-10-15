module.exports = createReadme;

const writePrettyFile = require("./write-pretty-file");

async function createReadme({
  repository,
  repo,
  description,
  packageName,
  addWip,
  addBadges,
  useOctokitOrg,
  addUsage,
  supportsBrowsers,
  supportsNode,
  isPlugin,
  isAuthenticationStrategy,
  octokitUsageExample,
  exportName,
  usageExample,
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
[![Build Status](https://github.com/${repository}/workflows/Test/badge.svg)](https://github.com/${repository}/actions?query=workflow%3ATest+branch%3Amain)

`;
  }

  if (addUsage) {
    if (useOctokitOrg) {
      content += `<details>
<summary>Table of contents</summary>

<!-- toc -->

</details>

`;
    }

    const UsageTitle = octokitUsageExample ? "Standalone usage" : "usage";
    content += `## ${UsageTitle}

<table>
<tbody valign=top align=left>
<tr><th>

Browsers

</th><td width=100%>

`;

    if (supportsBrowsers) {
      if (isPlugin) {
        content += `Load \`${packageName}\` and [\`@octokit/core\`](https://github.com/octokit/core.js) (or core-compatible module) directly from [cdn.skypack.dev](https://cdn.skypack.dev)

\`\`\`html
<script type="module">
  import { Octokit } from "https://cdn.skypack.dev/@octokit/core";
  import { ${exportName} } from "https://cdn.skypack.dev/${packageName}";
</script>
\`\`\`

`;
      } else {
        content += `Load \`${packageName}\` directly from [cdn.skypack.dev](https://cdn.skypack.dev)

\`\`\`html
<script type="module">
  import { ${exportName} } from "https://cdn.skypack.dev/${packageName}";
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
        content += `Install with \`npm install @octokit/core ${packageName}\`. Optionally replace \`@octokit/core\` with a compatible module

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

    if (octokitUsageExample) {
      content += `## Usage with Octokit

<table>
<tbody valign=top align=left>
<tr><th>

Browsers

</th><td width=100%>

`;

      if (supportsBrowsers) {
        content += `Load \`${packageName}\` and [\`@octokit/core\`](https://github.com/octokit/core.js) (or core-compatible module) directly from [cdn.skypack.dev](https://cdn.skypack.dev)

\`\`\`html
<script type="module">
  import { Octokit } from "https://cdn.skypack.dev/@octokit/core";
  import { ${exportName} } from "https://cdn.skypack.dev/${packageName}";
</script>
\`\`\`

`;
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
        content += `Install with \`npm install @octokit/core ${packageName}\`. Optionally replace \`@octokit/core\` with a compatible module

\`\`\`js
const { Octokit } = require("@octokit/core");
const { ${exportName} } = require("${packageName}");
\`\`\`

`;
      } else {
        content += `\`${packageName}\` is not meant for Node usage.

`;
      }
      content += `</td></tr>
</tbody>
</table>

\`\`\`js
${octokitUsageExample}
\`\`\`

`;
    } // octokitUsageExample

    if (isPlugin) {
      content += `## Options

<table width="100%">
  <thead align=left>
    <tr>
      <th width=150>
        name
      </th>
      <th width=70>
        type
      </th>
      <th>
        description
      </th>
    </tr>
  </thead>
  <tbody align=left valign=top>
    <tr>
      <th>
        <code>option name</code>
      </th>
      <th>
        <code>option type</code>
      </th>
      <td>
        <strong>Required.</strong> Description here
      </td>
    </tr>
  </tbody>
</table>`;
    } // plugin options

    if (isAuthenticationStrategy) {
      content += `## \`${exportName}(options)\`

The \`${exportName}\` method accepts a single \`options\` object as argument

<table width="100%">
  <thead align=left>
    <tr>
      <th width=150>
        name
      </th>
      <th width=70>
        type
      </th>
      <th>
        description
      </th>
    </tr>
  </thead>
  <tbody align=left valign=top>
    <tr>
      <th>
        <code>options.myOption</code>
      </th>
      <th>
        <code>string</code>
      </th>
      <td>
        <strong>Required</strong>. Description here
      </td>
    </tr>
  </tbody>
</table>

## \`auth(options)\`

The async \`auth()\` method returned by \`${exportName}(options)\` accepts the following options

<table width="100%">
  <thead align=left>
    <tr>
      <th width=150>
        name
      </th>
      <th width=70>
        type
      </th>
      <th>
        description
      </th>
    </tr>
  </thead>
  <tbody align=left valign=top>
    <tr>
      <th>
        <code>options.myOption</code>
      </th>
      <th>
        <code>string</code>
      </th>
      <td>
        <strong>Required.</strong> Description here
      </td>
    </tr>
  </tbody>
</table>

## Authentication object

The async \`auth(options)\` method resolves to an object with the following properties

<table width="100%">
  <thead align=left>
    <tr>
      <th width=150>
        name
      </th>
      <th width=70>
        type
      </th>
      <th>
        description
      </th>
    </tr>
  </thead>
  <tbody align=left valign=top>
    <tr>
      <th>
        <code>type</code>
      </th>
      <th>
        <code>string</code>
      </th>
      <td>
        <code>"myType"</code>
      </td>
    </tr>
  </tbody>
</table>

## \`auth.hook(request, route, parameters)\` or \`auth.hook(request, options)\`

\`auth.hook()\` hooks directly into the request life cycle. It amends the request to authenticate correctly based on the request URL.

The \`request\` option is an instance of [\`@octokit/request\`](https://github.com/octokit/request.js#readme). The \`route\`/\`options\` parameters are the same as for the [\`request()\` method](https://github.com/octokit/request.js#request).

\`auth.hook()\` can be called directly to send an authenticated request

\`\`\`js
const { data: user } = await auth.hook(request, "GET /user");
\`\`\`

Or it can be passed as option to [\`request()\`](https://github.com/octokit/request.js#request).

\`\`\`js
const requestWithAuth = request.defaults({
  request: {
    hook: auth.hook,
  },
});

const { data: user } = await requestWithAuth("GET /user");
\`\`\`
`;
    }
  } // Usage

  // footer
  content += `
  
## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)
  
## License

[MIT](LICENSE)
`;

  await writePrettyFile(`README.md`, content);
}
