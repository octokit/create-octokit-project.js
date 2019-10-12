module.exports = prompts;

const inquirer = require("inquirer");

async function prompts({ username, name, email, website }) {
  return inquirer.prompt([
    {
      type: "input",
      name: "packageName",
      message:
        "What npm package name should the project have? (Example: octokit-plugin-hello-world)"
    },
    {
      type: "input",
      name: "description",
      message: "Description for npm package and the GitHub repository"
    },
    {
      type: "input",
      name: "exportName",
      message: answers =>
        `What is the main export of the module? (Example: "Octokit" for "import { Octokit } of '${answers.packageName}'")`
    },
    {
      type: "confirm",
      name: "publicAccess",
      message: answers =>
        `Should the package ${answers.packageName} be publicly accessible?`,
      default: true,
      when: answers => answers.packageName.startsWith("@")
    },
    {
      type: "confirm",
      name: "supportsNode",
      message: `Will the package work with Node?`,
      default: true
    },
    {
      type: "confirm",
      name: "supportsBrowsers",
      message: `Will the package work with browsers?`,
      default: true
    },
    {
      type: "input",
      name: "repository",
      message:
        "Full name of then repository (Example: octocat/octokit-plugin-hello-world)",
      default: answers => [username, answers.packageName].join("/"),
      validate: input => input.includes("/")
    },
    {
      type: "input",
      name: "packageAuthor",
      message: 'Value for "author" key in package.json',
      default: () => {
        if (!name) return;
        let author = name;

        if (email) {
          author += ` <${email}>`;
        }

        if (website) {
          author += ` (${website})`;
        }

        return author;
      }
    },
    {
      type: "input",
      name: "cocEmail",
      message: "Email for Code of Conduct",
      default: email
    },
    {
      type: "input",
      name: "licenseName",
      message: "Name for license",
      default: name
    },
    {
      type: "input",
      name: "path",
      message: `Folder path to initialize the project in, relative to current path. If the path it does not yet exist it will be created. Current path is ${process.cwd()})`
    }
  ]);
}
