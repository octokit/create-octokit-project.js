module.exports = createPullRequest;

async function createPullRequest(
  octokit,
  { owner, repo, ownerId, repositoryId }
) {
  let body = `- [ ] Implement features. Create separate \`feat: ...\` commits for each feature of the initial version
- [ ] 100% test coverage
`;

  if (owner === "octokit") {
    body += `- [ ] [Install the WIP app](https://github.com/apps/wip/installations/new/permissions?suggested_target_id=${ownerId}&repository_ids[]=${repositoryId})
- [ ] [Install the Renovate app](https://github.com/apps/renovate/installations/new/permissions?suggested_target_id=${ownerId}&repository_ids[]=${repositoryId})
- [ ] [Install the Octokit JS Board app](https://github.com/apps/octokit-js-project-board/installations/new/permissions?suggested_target_id=${ownerId}&repository_ids[]=${repositoryId})
`;
  } else {
    body += `- [ ] Create npm token at \`https://www.npmjs.com/settings/<your npm username>/tokens/new\` (with "Automation" selected) and add it as \`NPM_TOKEN\` at Then create secret at https://github.com/${owner}/${repo}/settings/secrets`;
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
