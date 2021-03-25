module.exports = createRepository;

async function createRepository(
  octokit,
  { isUserRepo, owner, repo, description }
) {
  const createRepoOptions = {
    name: repo,
    description: description,
    has_wiki: false,
    has_projects: false,
    allow_merge_commit: false,
    delete_branch_on_merge: true,
  };

  if (isUserRepo) {
    return octokit.request("POST /user/repos", createRepoOptions);
  }

  return octokit.request("POST /orgs/{org}/repos", {
    org: owner,
    ...createRepoOptions,
  });
}
