module.exports = createPullRequest;

async function createPullRequest(octokit, { owner, repo }) {
  let body = `- [ ] Implement features. Create separate \`feat: ...\` commits for each feature of the initial version
- [ ] 100% test coverage
`;

  if (owner === "octokit") {
    body += `- [ ] Install https://github.com/apps/renovate`;
  } else {
    body += `- [ ] Create npm token at \`https://www.npmjs.com/settings/<your npm username>/tokens/create\` (with "Read and Publish" selected) and add it as \`NPM_TOKEN\` at Then create secret at https://github.com/${owner}/${repo}/settings/secrets`;
  }

  const options = {
    owner,
    repo,
    head: "initial-version",
    base: "main",
    title: "🚧 Initial version",
    body,
  };
  await octokit.request("POST /repos/{owner}/{repo}/pulls", options);
}
