module.exports = createRepository;

async function createRepository(octokit, { isUserRepo, repo, description }) {
  const createRepoOptions = {
    name: repo,
    description: description,
    has_wiki: false,
    has_projects: false,
    allow_merge_commit: false
  };

  if (isUserRepo) {
    await octokit.request("POST /user/repos", createRepoOptions);
    return;
  }

  await octokit.request("POST /orgs/:org/repos", {
    org: owner,
    ...createRepoOptions
  });
}
