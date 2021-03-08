module.exports = prompts;

const inquirer = require("inquirer");
const camelCase = require("camelcase");

function getDefaultExportName(answers) {
  const matches = answers.packageName.match(/\bplugin-(.*)$/);
  const defaultExport = matches ? camelCase(matches[1]) : "helloWorld";
  return defaultExport;
}

function getDefaultRepository(answers) {
  if (answers.packageName.startsWith("@octokit")) {
    return answers.packageName.substr(1) + ".js";
  }

  return answers.packageName.startsWith("@")
    ? answers.packageName.substr(1)
    : [username, answers.packageName].join("/");
}

async function prompts({ username, name, email, website, useOctokitOrg }) {
  return inquirer.prompt([
    {
      type: "input",
      name: "packageName",
      message() {
        const example = useOctokitOrg
          ? "@octokit/plugin-hello-world"
          : "octokit-plugin-hello-world";
        return `What npm package name should the project have? (Example: ${example})`;
      },
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
        const example = getDefaultExportName(answers);
        const question = answers.isPlugin
          ? "What is the main export of the plugin?"
          : "What is the main export of the module?";
        return `${question} (Example: "${example}" for "import { ${example} } of '${answers.packageName}'")`;
      },
      default: getDefaultExportName,
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
      message(answers) {
        const example = getDefaultRepository(answers);
        return `Full name of the repository (Example: ${example})`;
      },
      default: getDefaultRepository,
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
      message: `Folder path to initialize the project in, relative to current path. If the path does not yet exist it will be created. Current path is ${process.cwd()})`,
      default: (answers) => answers.repository.split("/")[1],
    },
  ]);
}
