module.exports = authenticate;

const inquirer = require("inquirer");
const { createBasicAuth } = require("@octokit/auth-basic");

async function authenticate() {
  const { username, password } = await inquirer.prompt([
    {
      type: "input",
      name: "username",
      message: "What is your GitHub username?",
    },
    {
      type: "password",
      name: "password",
      message: "What is your GitHub password?",
    },
  ]);

  const auth = createBasicAuth({
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
  });

  const authentication = await auth({
    type: "token",
  });

  debugger;

  return { auth, tokenId: authentication.id, username };
}
