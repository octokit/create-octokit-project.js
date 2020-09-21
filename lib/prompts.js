module.exports = prompts;

const inquirer = require("inquirer");
const camelCase = require('camelcase');

async function prompts({ username, name, email, website }) {
  return inquirer.prompt([
    {
      type: "input",
      name: "packageName",
      message:
        "What npm package name should the project have? (Example: octokit-plugin-hello-world)",
    },
    {
      type: "input",
      name: "description",
      message: "Description for npm package and the GitHub repository",
    },
    {
      type: "confirm",
      name: "isPlugin",
      message: `Is the project an Octokit plugin?`,
      default: true,
    },
    {
      type: "input",
      name: "exportName",
      message: (answers) => {
        if (answers.isPlugin) {
          const matches = answers.packageName.match(/\bplugin-(.*)$/);
          const defaultExport = matches ? camelCase(matches[1]) : 'helloWorld'
          return `What is the main export of the plugin? (Example: "${defaultExport}" for "import { ${defaultExport} } of '${answers.packageName}'")`;
        }

        return `What is the main export of the module? (Example: "Octokit" for "import { Octokit } of '${answers.packageName}'")`;
      },
    },
    {
      type: "editor",
      name: "usageExample",
      message: (answers) => {
        if (answers.isPlugin) {
          return `Provide the most simple usage example, without the ${answers.exportName} and Octokit import/require statements`;
        }

        return `Provide the most simple usage example, without the ${answers.exportName} import/require statement`;
      },
    },
    {
      type: "confirm",
      name: "publicAccess",
      message: (answers) =>
        `Should the package ${answers.packageName} be publicly accessible?`,
      default: true,
      when: (answers) => answers.packageName.startsWith("@"),
    },
    {
      type: "confirm",
      name: "supportsNode",
      message: `Will the package work with Node?`,
      default: true,
    },
    {
      type: "confirm",
      name: "supportsBrowsers",
      message: `Will the package work with browsers?`,
      default: true,
    },
    {
      type: "input",
      name: "repository",
      message:
        "Full name of the repository (Example: octocat/octokit-plugin-hello-world)",
      default: (answers) => {
        if (answers.packageName.startsWith("@octokit")) {
          return answers.packageName.substr(1) + ".js";
        }

        return answers.packageName.startsWith("@")
          ? answers.packageName.substr(1)
          : [username, answers.packageName].join("/");
      },
      validate: (input) => input.includes("/"),
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
      },
    },
    {
      type: "input",
      name: "cocEmail",
      message: "Email for Code of Conduct",
      default: (answers) =>
        answers.packageName.startsWith("@octokit")
          ? "opensource+octokit@github.com"
          : email,
    },
    {
      type: "input",
      name: "licenseName",
      message: "Name for license",
      default: (answers) =>
        answers.packageName.startsWith("@octokit")
          ? "Octokit contributors"
          : name,
    },
    {
      type: "input",
      name: "path",
      message: `Folder path to initialize the project in, relative to current path. If the path it does not yet exist it will be created. Current path is ${process.cwd()})`,
      default: (answers) => answers.repository.split("/")[1],
    },
  ]);
}
