module.exports = createPullRequest;

async function createPullRequest(octokit, options) {
  await octokit.request("POST /repos/:owner/:repo/pulls", options);
}
