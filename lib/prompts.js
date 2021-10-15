module.exports = prompts;

const inquirer = require("inquirer");
const camelCase = require("camelcase");

function getDefaultExportName(answers) {
  if (answers.isAuthenticationStrategy) {
    const matches = answers.packageName.match(/\bauth-(.*)$/);
    return matches ? camelCase(`create ${matches[1]} auth`) : "Example";
  }

  const matches = answers.packageName.match(/\bplugin-(.*)$/);
  return matches ? camelCase(matches[1]) : "Example";
}

function getDefaultRepository(username, answers) {
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
      type: "confirm",
      name: "isPlugin",
      message: `Is the project an Octokit plugin?`,
      default: true,
    },
    {
      type: "confirm",
      name: "isAuthenticationStrategy",
      message: `Is the project an Octokit authentication strategy?`,
      default: true,
      when: (answers) => !answers.isPlugin,
    },
    {
      type: "input",
      name: "packageName",
      message(answers) {
        const scopePrefix = useOctokitOrg ? "@octokit/" : "octokit-";
        const typePrefix = answers.isPlugin
          ? "plugin-"
          : answers.isAuthenticationStrategy
          ? "auth-"
          : "";
        const example = `${scopePrefix}${typePrefix}example`;
        return `What npm package name should the project have? (Example: ${example})`;
      },
      validate(input, answers) {
        if (answers.isPlugin) {
          const prefix = (useOctokitOrg ? "@octokit/" : "octokit-") + "plugin-";
          if (input.startsWith(prefix)) return true;

          return `Octokit plugin package name must start with ${prefix}`;
        }

        if (answers.isAuthenticationStrategy) {
          const prefix = (useOctokitOrg ? "@octokit/" : "octokit-") + "auth-";
          if (input.startsWith(prefix)) return true;

          return `Octokit authentication strategy package name must start with ${prefix}`;
        }

        return true;
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
      type: "input",
      name: "description",
      message: "Description for npm package and the GitHub repository",
    },
    {
      type: "input",
      name: "exportName",
      message: (answers) => {
        const type = answers.isPlugin
          ? "plugin"
          : answers.isAuthenticationStrategy
          ? "authentication strategy"
          : "module";

        const example = getDefaultExportName(answers);
        const question = `What is the main export of the ${type}?`;
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
        if (answers.isAuthenticationStrategy) {
          return `Provide the most simple standalone usage example for the authentication strategy, without the ${answers.exportName} import/require statement`;
        }

        return `Provide the most simple usage example, without the ${answers.exportName} import/require statement`;
      },
      default(answers) {
        if (answers.isPlugin) {
          return `const MyOctokit = Octokit.plugin(${answers.exportName});
const octokit = new MyOctokit({ auth: "secret123" });

octokit. // TODO add usage example with comments here
          `;
        }

        if (answers.isAuthenticationStrategy) {
          return `const auth = ${answers.exportName}({ /* add strategy options here */ })
          
// [describe behavior of auth here]
const authentication = await auth({ /* add authentication options here */ })`;
        }
      },
    },
    {
      type: "editor",
      name: "octokitUsageExample",
      message: (answers) => {
        return `Provide the most simple usage example as Octokit authStrategy option, without the ${answers.exportName} and Octokit import/require statements`;
      },
      default(answers) {
        return `const octokit = new Octokit({
  authStrategy: ${answers.exportName},
  auth: { /* add strategy options here */ }
})

// [describe behavior of auth.hook here]
octokit.request("GET /user")
`;
      },
      when: (answers) => answers.isAuthenticationStrategy,
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
        const example = getDefaultRepository(username, answers);
        return `Full name of the repository (Example: ${example})`;
      },
      default: getDefaultRepository.bind(null, username),
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
