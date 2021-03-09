module.exports = createBranchProtection;

async function createBranchProtection(octokit, { owner, repo }) {
  await octokit.request(
    "PUT /repos/{owner}/{repo}/branches/{branch}/protection",
    {
      mediaType: {
        previews: ["luke-cage"],
      },
      owner,
      repo,
      branch: "main",
      enforce_admins: null,
      required_pull_request_reviews: {
        dismiss_stale_reviews: true,
      },
      required_status_checks: {
        strict: false,
        contexts: ["WIP", "test"],
      },
      restrictions: null,
    }
  );
}
