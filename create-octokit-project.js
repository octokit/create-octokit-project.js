#!/usr/bin/env node

const { inspect } = require("util");
const { mkdir, writeFile } = require("fs").promises;

const { Octokit } = require("@octokit/core");

const authenticate = require("./lib/authenticate");
const command = require("./lib/command");
const createBranchProtection = require("./lib/create-branch-protection");
const createCoc = require("./lib/create-coc");
const createLicense = require("./lib/create-license");
const createPackageJson = require("./lib/create-package-json");
const createPullRequest = require("./lib/create-pull-request");
const createReadme = require("./lib/create-readme");
const createReleaseAction = require("./lib/create-release-action");
const createTestAction = require("./lib/create-test-action");
const createRepository = require("./lib/create-repository");
const inviteCollaborators = require("./lib/invite-collaborators");
const prompts = require("./lib/prompts");

main();

async function main() {
  console.log(
    `"create-octokit-project" needs to create a personal access token using username & password. Your credentials are not stored and the token will be deleted on completion.`
  );

  const { auth, tokenId, username } = await authenticate();
  console.log(`token created for ${username}.`);

  const octokit = new Octokit({ auth });
  octokit.hook.before("request", async options => {
    const { method, url, ...parameters } = octokit.request.endpoint.parse(
      options
    );
    console.log(`> ${method} ${url.replace("https://api.github.com", "")}`);
    for (const [name, value] of Object.entries(parameters.headers)) {
      console.log(`  ${name}: ${value}`);
    }
    if (parameters.body) {
      console.log(``);
      for (const [name, value] of Object.entries(parameters.body)) {
        console.log(`  ${name}: ${inspect(value)}`);
      }
    }
  });

  const {
    data: { name, email, blog: website }
  } = await octokit.request("GET /user");

  try {
    const answers = await prompts({ username, name, email, website });
    const [owner, repo] = answers.repository.split("/");
    const isUserRepo = answers.repository.startsWith(username);

    // create project folder and chdir into it
    console.log(`Creating ${answers.path}`);
    await mkdir(answers.path, { recursive: true });
    process.chdir(answers.path);

    await command("git init");

    await createReadme({
      addWip: true,
      repo,
      description: answers.description
    });
    console.log(`README.md created`);

    createLicense(answers.licenseName);
    console.log(`LICENSE created`);

    createCoc(answers.cocEmail);
    console.log(`CODE_OF_CONDUCT.md created`);

    await command("git add LICENSE");
    await command("git commit -m 'docs(LICENSE): MIT'");

    await command("git add README.md");
    await command("git commit -m 'docs(README): initial version'");

    await command("git add CODE_OF_CONDUCT.md");
    await command(
      "git commit -m 'docs(CODE_OF_CONDUCT): Contributor Covenant'"
    );

    await createRepository(octokit, {
      isUserRepo,
      repo,
      description: answers.description
    });

    await command(
      `git remote add origin git@github.com:${answers.repository}.git`
    );
    await command(`git push -u origin HEAD`);
    await command(`git checkout -b initial-version`);

    createReadme({
      repo,
      description: answers.description
    });

    await command(`git commit README.md -m 'docs(README): remove WIP note'`);
    await command(`git push -u origin HEAD`);

    await createPullRequest(octokit, {
      owner,
      repo,
      head: "initial-version",
      base: "master",
      title: "🚧 Initial version",
      body: `- [ ] Implement features. Create separate \`feat: ...\` commits for each feature of the initial version
- [ ] 100% test coverage`
    });

    await createPackageJson(answers);
    await command(`git add package.json`);
    await command(`git commit -m 'build(package): initial version'`);

    console.log("Install dependencies");
    await command(
      "npm install --save-dev @pika/pack @pika/plugin-build-node @pika/plugin-build-web @pika/plugin-ts-standard-pkg @types/jest @types/node jest prettier semantic-release semantic-release-plugin-update-version-in-files ts-jest typescript"
    );
    await command(`git add package-lock.json`);
    await command(`git commit -m 'build(package): lock file'`);

    if (!isUserRepo) {
      console.log("Inviting collaborators...");
      await inviteCollaborators(octokit, { isUserRepo });
    }

    console.log("Create branch protection for master");
    await createBranchProtection(octokit, { owner, repo });

    await writeFile(
      ".gitignore",
      ["coverage/", "node_modules/", "pkg/"].join("\n") + "\n"
    );
    await command(`git add .gitignore`);
    await command(
      `git commit -m 'build(gitignore): coverage, node_modules, pkg'`
    );

    writeFile(
      "tsconfig.json",
      JSON.stringify(
        {
          compilerOptions: {
            esModuleInterop: true,
            module: "esnext",
            moduleResolution: "node",
            strict: true,
            target: "es2018"
          },
          include: ["src/**/*"]
        },
        null,
        2
      ) + "\n"
    );
    await command(`git add tsconfig.json`);
    await command(`git commit -m 'build(typescript): configuration for pika'`);

    console.log("create smoke test");
    await mkdir("test");
    await writeFile(
      "test/smoke.test.ts",
      `import { ${answers.exportName} } from "../src";

describe("Smoke test", () => {
  it("is a function", () => {
    expect(${answers.exportName}).toBeInstanceOf(Function);
  });
});`
    );

    await command(`git add test`);
    await command(`git commit -m 'test: initial version'`);

    await createReadme({
      addBadges: true,
      repo,
      description: answers.description,
      packageName: answers.packageName,
      repository: answers.repository
    });
    await command(`git commit README.md -m 'docs(README): badges'`);

    console.log("Create actions");
    await mkdir(".github/workflows", { recursive: true });
    await createReleaseAction();
    await command(`git add .github/workflows/release.yml`);
    await command(`git commit -m 'ci(release): initial version'`);

    await createTestAction();
    await command(`git add .github/workflows/test.yml`);
    await command(`git commit -m 'ci(test): initial version'`);

    await command(`git push`);

    console.log(`Your new repository is here:
https://github.com/${answers.repository}
    
Install the following apps on the new ${answers.repository} repository
    
- https://github.com/apps/greenkeeper
- https://github.com/apps/pika-ci

Create an npm token and store it as a secret in the repository

- Create at: https://www.npmjs.com/settings/<your npm username>/tokens/create (with "Read and Publish" selected)
- Then create secret at https://github.com/${answers.repository}/secrets with the name "NPM_TOKEN"

To change into the new directory, do 
$ cd ${answers.path}`);
  } catch (error) {
    console.log(error);
  }

  console.log(
    "Deleting personal access token (might ask for two-factor code again) ..."
  );
  await octokit.request("DELETE /authorizations/:authorization_id", {
    authorization_id: tokenId
  });
  console.log("All done.");
}
