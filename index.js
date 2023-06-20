import { inspect } from "util";
import { mkdir } from "fs/promises";

import inquirer from "inquirer";
import { Octokit } from "@octokit/core";
import { createOAuthDeviceAuth } from "@octokit/auth-oauth-device";
import clipboardy from "clipboardy";

import command from "./lib/command.js";
import createBranchProtection from "./lib/create-branch-protection.js";
import createCoc from "./lib/create-coc.js";
import createContributing from "./lib/create-contributing.js";
import createEsbuildScript from "./lib/create-esbuild-script.js";
import createIssueTemplates from "./lib/create-issue-templates.js";
import createLicense from "./lib/create-license.js";
import createPackageJson from "./lib/create-package-json.js";
import createPullRequest from "./lib/create-pull-request.js";
import createReadme from "./lib/create-readme.js";
import createReleaseAction from "./lib/create-release-action.js";
import createUpdatePrettierAction from "./lib/create-update-prettier-action.js";
import createTestAction from "./lib/create-test-action.js";
import createRenovateConfig from "./lib/create-renovate-config.js";
import createRepository from "./lib/create-repository.js";
import inviteCollaborators from "./lib/invite-collaborators.js";
import prompts from "./lib/prompts.js";
import writePrettyFile from "./lib/write-pretty-file.js";

export default async function main() {
  const { repositoryType } = await inquirer.prompt([
    {
      name: "repositoryType",
      type: "list",
      message: "Do you want to create a public or private repository?",
      choices: ["public", "private"],
    },
  ]);

  const { useOctokitOrg } = await inquirer.prompt([
    {
      name: "useOctokitOrg",
      type: "confirm",
      message:
        "If you have access, do you want to create the repository in the @octokit organization?",
      default: false,
    },
  ]);

  const scopes = [
    repositoryType === "public" ? "public_repo" : "repo",
    useOctokitOrg ? "admin:org" : "",
  ].filter(Boolean);

  const auth = createOAuthDeviceAuth({
    clientId: "797fc7c2acb5f7c1bed3", // Create Octokit Project OAuth app by @octokit
    scopes,
    async onVerification({ verification_uri, user_code }) {
      console.log("Open %s", verification_uri);
      console.log("Paste code: %s (copied to your clipboard)", user_code);

      await clipboardy.write(user_code);

      await inquirer.prompt({
        name: "grant_access",
        type: "confirm",
        message: "Press <enter> when ready",
      });
    },
  });

  const { token } = await auth({ type: "oauth" });
  const octokit = new Octokit({ auth: token });
  octokit.hook.before("request", async (options) => {
    const { method, url, ...parameters } =
      octokit.request.endpoint.parse(options);
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
    data: { id: userId, login: username, name, email, blog: website },
  } = await octokit.request("GET /user");

  try {
    const answers = await prompts({
      username,
      name,
      email,
      website,
      useOctokitOrg,
    });
    const [owner, repo] = answers.repository.split("/");
    const isUserRepo = answers.repository.startsWith(username);

    let ownerId = userId;
    if (!isUserRepo) {
      const { data } = await octokit.request("GET /orgs/{org}", {
        org: owner,
      });
      ownerId = data.id;
    }

    // create project folder and chdir into it
    console.log(`Creating ${answers.path}`);
    await mkdir(answers.path, { recursive: true });
    process.chdir(answers.path);

    await command("git init");
    await command("git checkout -b main");

    createLicense(answers.licenseName);
    console.log(`LICENSE created`);

    createCoc(answers.cocEmail);
    console.log(`CODE_OF_CONDUCT.md created`);

    createContributing({ owner, repo, packageName: answers.packageName });
    console.log(`CONTRIBUTING.md created`);

    await createReadme({
      addWip: true,
      repository: answers.repository,
      repo,
      description: answers.description,
    });
    console.log(`README.md created`);

    await command("git add LICENSE");
    await command("git commit -m 'docs(LICENSE): MIT'");

    await command("git add CODE_OF_CONDUCT.md");
    await command(
      "git commit -m 'docs(CODE_OF_CONDUCT): Contributor Covenant'"
    );

    await command("git add CONTRIBUTING.md");
    await command("git commit -m 'docs(CONTRIBUTING): initial version'");

    await command("git add README.md");
    await command("git commit -m 'docs(README): initial version'");

    await createIssueTemplates(useOctokitOrg);
    await command("git add .github/ISSUE_TEMPLATE");
    await command("git commit -m 'docs(ISSUE_TEMPLATES): initial version'");

    const {
      data: { id: repositoryId },
    } = await createRepository(octokit, {
      isUserRepo,
      owner,
      repo,
      description: answers.description,
    });

    await command(
      `git remote add origin git@github.com:${answers.repository}.git`
    );
    await command(`git push -u origin HEAD`);
    await command(`git checkout -b initial-version`);

    createReadme({
      repo,
      description: answers.description,
    });

    await command(`git commit README.md -m 'docs(README): remove WIP note'`);
    await command(`git push -u origin HEAD`);

    await createPullRequest(octokit, {
      owner,
      repo,
      ownerId,
      repositoryId,
    });

    await createPackageJson(answers);
    console.log("Install dependencies");
    const dependencies = [];
    const devDependencies = [
      "@octokit/tsconfig",
      "esbuild",
      "glob",
      "@types/jest",
      "@types/node",
      "jest",
      "prettier",
      "semantic-release",
      "semantic-release-plugin-update-version-in-files",
      "ts-jest",
      "typescript",
    ];

    if (answers.isPlugin || answers.isAuthenticationStrategy) {
      devDependencies.push("@octokit/core");
    }
    if (answers.isAuthenticationStrategy) {
      dependencies.push("@octokit/types");
    }
    await command(`npm install --save-dev ${devDependencies.join(" ")}`);

    if (dependencies.length) {
      await command(`npm install ${dependencies.join(" ")}`);
    }

    await command(`git add package.json`);
    await command(`git commit -m 'build(package): initial version'`);
    await command(`git add package-lock.json`);
    await command(`git commit -m 'build(package): lock file'`);

    if (owner === "octokit") {
      console.log("Inviting collaborators...");
      await inviteCollaborators(octokit, { owner, repo });
    }

    console.log("Create branch protection for main");
    await createBranchProtection(octokit, { owner, repo });

    await writePrettyFile(
      ".gitignore",
      ["coverage/", "node_modules/", "pkg/"].join("\n")
    );
    await command(`git add .gitignore`);
    await command(
      `git commit -m 'build(gitignore): coverage, node_modules, pkg'`
    );

    writePrettyFile(
      "tsconfig.json",
      JSON.stringify({
        extends: "@octokit/tsconfig",
        include: ["src/**/*"],
        compilerOptions: {
          declaration: true,
          outDir: "pkg/dist-types",
          emitDeclarationOnly: true,
          sourceMap: true,
        },
      })
    );
    await command(`git add tsconfig.json`);
    await command(
      `git commit -m 'build(typescript): configuration for esbuild'`
    );

    console.log("create smoke test");

    if (answers.isPlugin) {
      await writePrettyFile(
        "test/smoke.test.ts",
        `
          import { Octokit } from "@octokit/core";
          
          import { ${answers.exportName} } from "../src";
            
          describe("Smoke test", () => {
            it("{ ${answers.exportName} } export is a function", () => {
              expect(${answers.exportName}).toBeInstanceOf(Function);
            });
          
            it("${answers.exportName}.VERSION is set", () => {
              expect(${answers.exportName}.VERSION).toEqual("0.0.0-development");
            });
          
            it("Loads plugin", () => {
              expect(() => {
                const TestOctokit = Octokit.plugin(${answers.exportName})
                new TestOctokit();
              }).not.toThrow();
            });
          });
        `
      );
    } else {
      await writePrettyFile(
        "test/smoke.test.ts",
        `
          import { ${answers.exportName} } from "../src";

          describe("Smoke test", () => {
            it("is a function", () => {
              expect(${answers.exportName}).toBeInstanceOf(Function);
            });

            it("${answers.exportName}.VERSION is set", () => {
              expect(${answers.exportName}.VERSION).toEqual("0.0.0-development");
            });
          });
        `
      );
    }

    await command(`git add test`);
    await command(`git commit -m 'test: initial version'`);

    console.log("create src");
    await writePrettyFile(
      "src/version.ts",
      'export const VERSION = "0.0.0-development"'
    );

    if (answers.isPlugin) {
      await writePrettyFile(
        "src/index.ts",
        `
          import { Octokit } from "@octokit/core";
          import { VERSION } from "./version";

          type Options = Record<string, unknown>;

          /**
           * @param octokit Octokit instance
           * @param options Options passed to Octokit constructor
           */
          export function ${answers.exportName}(octokit: Octokit, options: Options) {}
          ${answers.exportName}.VERSION = VERSION;
        `
      );
    } else if (answers.isAuthenticationStrategy) {
      await writePrettyFile(
        "src/index.ts",
        `
          import { VERSION } from "./version";
          import { auth } from "./auth";
          import { hook } from "./hook";
          import { StrategyOptions, AuthOptions, Authentication } from "./types";
          
          export type Types = {
            StrategyOptions: any;
            AuthOptions: any;
            Authentication: any;
          };
          
          export const ${answers.exportName}: StrategyInterface = function ${answers.exportName}(
            options: StrategyOption
          ) {
            return Object.assign(auth.bind(null, options), {
              hook: hook.bind(null, options),
            });
          };
          
        `
      );
      await writePrettyFile(
        "src/types.ts",
        `
          export type Types = {
            StrategyOptions: any;
            AuthOptions: any;
            Authentication: any;
          }; 
        `
      );
      await writePrettyFile(
        "src/auth.ts",
        `
          import { AuthOptions, Authentication } from "./types";

          export async function auth(options: AuthOptions): Promise<Authentication> {
            // TODO: add implementation
          }        
        `
      );
      await writePrettyFile(
        "src/hook.ts",
        `
          import {
            EndpointDefaults,
            EndpointOptions,
            OctokitResponse,
            RequestInterface,
            RequestParameters,
            Route,
          } from "@octokit/types";
          import { AuthOptions } from "./types";
          
          type AnyResponse = OctokitResponse<any>
          
          export async function hook(
            options: AuthOptions,
            request: RequestInterface,
            route: Route | EndpointOptions,
            parameters: RequestParameters = {}
          ): Promise<AnyResponse> {
            // TODO: add implementation
            //       probably something like setting the authorization header
            return request(route, parameters);
          }
        `
      );
    } else {
      const isClass = /^[A-Z]/.test(answers.exportName);

      if (isClass) {
        await writePrettyFile(
          "src/index.ts",
          `
            import { VERSION } from './version'

            export class ${answers.exportName} {
              static VERSION = VERSION
            }
          `
        );
      } else {
        await writePrettyFile(
          "src/index.ts",
          `
            import { VERSION } from './version'

            export function ${answers.exportName}() {}
            ${answers.exportName}.VERSION = VERSION
          `
        );
      }
    }

    await createEsbuildScript(answers);
    await command(`git add src`);
    await command(`git commit -m 'feat: initial version'`);

    await createReadme({
      addBadges: true,
      repo,
      description: answers.description,
      packageName: answers.packageName,
      repository: answers.repository,
    });
    await command(`git commit README.md -m 'docs(README): badges'`);

    await createReadme({
      useOctokitOrg,
      addBadges: true,
      addUsage: true,
      repo,
      description: answers.description,
      packageName: answers.packageName,
      repository: answers.repository,
      isPlugin: answers.isPlugin,
      isAuthenticationStrategy: answers.isAuthenticationStrategy,
      octokitUsageExample: answers.octokitUsageExample,
      exportName: answers.exportName,
      supportsBrowsers: answers.supportsBrowsers,
      supportsNode: answers.supportsNode,
      usageExample: answers.usageExample,
    });
    await command(`git commit README.md -m 'docs(README): usage'`);

    console.log("Create actions");
    await createReleaseAction({ owner });
    await command(`git add .github/workflows/release.yml`);
    await command(`git commit -m 'ci(release): initial version'`);

    await createTestAction();
    await command(`git add .github/workflows/test.yml`);
    await command(`git commit -m 'ci(test): initial version'`);

    await createUpdatePrettierAction({ owner });
    await command(`git add .github/workflows/update-prettier.yml`);
    await command(`git commit -m 'ci(update-prettier): initial version'`);

    if (owner === "octokit") {
      console.log("Create Renovate configuration");
      await createRenovateConfig();
      await command(`git add .github/renovate.json`);
      await command(`git commit -m 'ci(renovate): add Renovate configuration'`);
    }

    await command(`git push`);

    console.log(`Your new repository is here:
https://github.com/${answers.repository}

To change into the new directory, do 
$ cd ${answers.path}`);
  } catch (error) {
    console.log(error);
  }

  console.log("All done.");
}
