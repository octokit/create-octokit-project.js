module.exports = createPullRequest;

async function createPullRequest(octokit, { owner, repo }) {
  let body = `- [ ] Implement features. Create separate \`feat: ...\` commits for each feature of the initial version
- [ ] 100% test coverage
- [ ] Install https://github.com/apps/pika-ci
`;

  if (owner !== "octokit") {
    body += `- [ ] Create npm token at \`https://www.npmjs.com/settings/<your npm username>/tokens/create\` (with "Read and Publish" selected) and add it as \`NPM_TOKEN\` at Then create secret at https://github.com/${answers.repository}/settings/secrets`;
  }

  const options = {
    owner,
    repo,
    head: "initial-version",
    base: "main",
    title: "🚧 Initial version",
    body,
  };
  await octokit.request("POST /repos/:owner/:repo/pulls", options);
}
