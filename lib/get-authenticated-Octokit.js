module.exports = getAuthenticatedOctokit;

const inquirer = require("inquirer");
const { Octokit } = require("@octokit/core");
const { createBasicAuth } = require("@octokit/auth-basic");

function getAuthenticatedOctokit({ username, password }) {
  return new Octokit({
    authStrategy: createBasicAuth,
    auth: {
      username,
      password,
      token: {
        scopes: ["repo", "workflow"],
      },
      async on2Fa() {
        const { code } = await inquirer.prompt([
          {
            type: "input",
            name: "code",
            message: "What is your GitHub two-factor authentication code?",
          },
        ]);
        return code;
      },
    },
  });
}
