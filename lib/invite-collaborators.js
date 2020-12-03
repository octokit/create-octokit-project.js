module.exports = inviteCollaborators;

async function inviteCollaborators(octokit, { owner, repo }) {
  // https://developer.github.com/v3/repos/collaborators/#check-if-a-user-is-a-collaborator
  await octokit.request("PUT /repos/{owner}/{repo}/collaborators/{username}", {
    owner,
    repo,
    username: "octokitbot",
  });

  // https://developer.github.com/v3/teams/#get-team-by-name
  const {
    data: { id },
  } = await octokit.request("GET /orgs/{org}/teams/{team_slug}", {
    org: owner,
    team_slug: "JS",
  });

  // https://developer.github.com/v3/teams/#add-or-update-team-repository
  await octokit.request("PUT /teams/{team_id}/repos/{owner}/{repo}", {
    mediaType: { previews: ["hellcat"] },
    owner,
    repo,
    team_id: id,
    permission: "push",
  });
}
