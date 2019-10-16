module.exports = inviteCollaborators;

async function inviteCollaborators(octokit, { owner, repo }) {
  await octokit.request("PUT /repos/:owner/:repo/collaborators/:username", {
    owner,
    repo,
    username: "octokitbot"
  });

  const {
    data: { id }
  } = await octokit.request("GET /orgs/:org/teams/:team_slug", {
    org: owner,
    team_slug: "JS"
  });

  await octokit.request("PUT /teams/:team_id/repos/:owner/:repo", {
    mediaType: { previews: ["hellcat"] },
    owner,
    repo,
    team_id: id
  });
}
