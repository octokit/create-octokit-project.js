# Create new Octokit JS repository

This repository is work in progress. The goal is to create an [`npm init`](https://docs.npmjs.com/cli/init) script to simplify the creation of an Octokit JS project, like a plugin.

Here are the steps that will be automated as much as possible, on the example of the [octokit/action.js](https://github.com/octokit/action.js) repository.

- repository name: `action.js`
- description: `GitHub API client for GitHub Actions`

```shell
# create new folder and change into it
mkdir action.js
cd action.js

# init git
git init

# Create repository
hub create -d "GitHub API client for GitHub Actions" octokit/action.js

# Init npm
npm init -y

# Create MIT license
npx @captainsafia/legit put --user "Octokit contributors" mit

# Commit LICENSE
git add LICENSE
git commit -m 'docs(LICENSE): MIT'

# Create README
cat <<\EOT > README.md
# 🚧 WORK IN PROGRESS. See [#1](https://github.com/octokit/action.js/pull/1)

# action.js

> GitHub API client for GitHub Actions

## License

[MIT](LICENSE)
EOT

# Commit README
git add README.md
git commit -m 'docs(README): initial version'

# Create CODE_OF_CONDUCT.md
cat <<\EOT > CODE_OF_CONDUCT.md
# Contributor Covenant Code of Conduct

## Our Pledge

In the interest of fostering an open and welcoming environment, we as contributors and maintainers pledge to making participation in our project and our community a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

## Our Standards

Examples of behavior that contributes to creating a positive environment include:

* Using welcoming and inclusive language
* Being respectful of differing viewpoints and experiences
* Gracefully accepting constructive criticism
* Focusing on what is best for the community
* Showing empathy towards other community members

Examples of unacceptable behavior by participants include:

* The use of sexualized language or imagery and unwelcome sexual attention or advances
* Trolling, insulting/derogatory comments, and personal or political attacks
* Public or private harassment
* Publishing others' private information, such as a physical or electronic address, without explicit permission
* Other conduct which could reasonably be considered inappropriate in a professional setting

## Our Responsibilities

Project maintainers are responsible for clarifying the standards of acceptable behavior and are expected to take appropriate and fair corrective action in response to any instances of unacceptable behavior.

Project maintainers have the right and responsibility to remove, edit, or reject comments, commits, code, wiki edits, issues, and other contributions that are not aligned to this Code of Conduct, or to ban temporarily or permanently any contributor for other behaviors that they deem inappropriate, threatening, offensive, or harmful.

## Scope

This Code of Conduct applies both within project spaces and in public spaces when an individual is representing the project or its community. Examples of representing a project or community include using an official project e-mail address, posting via an official social media account, or acting as an appointed representative at an online or offline event. Representation of a project may be further defined and clarified by project maintainers.

## Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be reported by contacting the project team at opensource+octokit@github.com. The project team will review and investigate all complaints, and will respond in a way that it deems appropriate to the circumstances. The project team is obligated to maintain confidentiality with regard to the reporter of an incident. Further details of specific enforcement policies may be posted separately.

Project maintainers who do not follow or enforce the Code of Conduct in good faith may face temporary or permanent repercussions as determined by other members of the project's leadership.

## Attribution

This Code of Conduct is adapted from the [Contributor Covenant][homepage], version 1.4, available at [http://contributor-covenant.org/version/1/4][version]

[homepage]: http://contributor-covenant.org
[version]: http://contributor-covenant.org/version/1/4/
EOT

# Commit CODE_OF_CONDUCT
git add CODE_OF_CONDUCT.md
git commit -m 'docs(CODE_OF_CONDUCT): Contributor Covenant'

# push to remote
git push -u origin HEAD

# check out "initial-version" branch
git checkout -b initial-version

# Remove WIP message from README
sed -i '' '1,2d' README.md

# Commit README and push
git commit README.md -m 'docs(README): remove WIP note'
git push -u origin HEAD

# Create pull request
hub pull-request -m "🚧 Initial version

- [ ] Implement features. Create separate `feat: ...` commits for each feature of the initial version
- [ ] 100% test coverage
```

Edit `package.json`

- rename `"name"` from `"action.js"` to `"@octokit/action"`
- change `"version"` from `"1.0.0"` to `"0.0.0-semantically-released"`
- add `"publishConfig": { "access": "public"},`
- remove `"main"`
- replace `"repository"` with simple string: `"https://github.com/octokit/action.js"`
- Add keywords `["github", "api", "sdk", "toolkit"]`
- Add description: `GitHub API client for GitHub Actions`
- Remove `"bugs"` and `"homepage"`
- Replace `"scripts"` with

  ```json
  "scripts": {
    "build": "pika build",
    "lint": "prettier --check '{src,test}/**/*.{js,ts,css,less,scss,vue,json,gql,md}' README.md package.json",
    "lint:fix": "prettier --write '{src,test}/**/*.{js,ts,css,less,scss,vue,json,gql,md}' README.md package.json",
    "pretest": "npm run -s lint",
    "test": "jest --coverage"
  },
  ```

- Add settings for Jest, Pika and semantic-release

  ```json
  "jest": {
    "preset": "ts-jest",
    "coverageThreshold": {
      "global": {
        "statements": 100,
        "branches": 100,
        "functions": 100,
        "lines": 100
      }
    }
  },
  "@pika/pack": {
    "pipeline": [
      [
        "@pika/plugin-ts-standard-pkg"
      ],
      [
        "@pika/plugin-build-node"
      ],
      [
        "@pika/plugin-build-web"
      ]
    ]
  },
  "release": {
    "plugins": [
      "@semantic-release/commit-analyzer",
      "@semantic-release/release-notes-generator",
      "@semantic-release/github",
      [
        "@semantic-release/npm",
        {
          "pkgRoot": "./pkg"
        }
      ],
      [
        "semantic-release-plugin-update-version-in-files",
        {
          "files": [
            "dist-web/*",
            "dist-node/*",
            "*/version.*"
          ]
        }
      ]
    ]
  }
  ```

Add repository collaborators

- open https://github.com/octokit/action.js/settings/collaboration
- Invite octokitbot with write access
- Add JS team with write access

Install Pika CI app on new repo

- https://github.com/apps/pika-cd

Install Greenkeeper

- https://github.com/apps/greenkeeper

Setup branch protection for `master` branch

- [x] Require pull request reviews before merging
- [x] Require status checks to pass before merging: WIP, Pika CI, test

Create an npm token and store it as a secret in the repository

- https://www.npmjs.com/settings/[YOUR NPM USERNAME]/tokens/create (with "Read and Publish" selected)

Continue

```shell
# install dependencies
npm install --save-dev @pika/pack @pika/plugin-build-node @pika/plugin-build-web @pika/plugin-ts-standard-pkg @types/jest @types/node jest prettier semantic-release semantic-release-plugin-update-version-in-files ts-jest typescript

# commit package.json & lock file
git add package.json
git commit -m 'build(package): initial version'
git add package-lock.json
git commit -m 'build(package): lock file'

# create .gitignore
cat <<\EOT > .gitignore
coverage
node_modules/
pkg/
EOT
git add .gitignore
git commit -m 'build(gitignore): coverage, node_modules, pkg'

# create tsconfig.json
cat <<\EOT > tsconfig.json
{
  "compilerOptions": {
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "strict": true,
    "target": "es2018"
  },
  "include": ["src/**/*"]
}
EOT
git add tsconfig.json
git commit -m 'build(typescript): configuration for pika'

# create initial tests
mkdir test
cat <<\EOT > test/smoke.test.ts
import { Octokit } from "../src";

describe("Smoke test", () => {
  it("is a function", () => {
    expect(Octokit).toBeInstanceOf(Function);
    expect(() => new Octokit()).not.toThrow();
  });
});
EOT
git add test
git commit -m 'test: initial version'

# Add badges to README
cat <<\EOT > README.md
# action.js

> GitHub API client for GitHub Actions

[![@latest](https://img.shields.io/npm/v/@octokit/action.svg)](https://www.npmjs.com/package/@octokit/action)
[![Build Status](https://github.com/octokit/action.js/workflows/Test/badge.svg)](https://github.com/octokit/action.js/actions)
[![Greenkeeper](https://badges.greenkeeper.io/octokit/action.js.svg)](https://greenkeeper.io/)

## License

[MIT](LICENSE)
EOT
git commit README.md -m 'docs(README): badges'

# Create workflow files
mkdir -p .github/workflows
cat <<\EOT > .github/workflows/release.yml
name: Release
on:
  push:
    branches:
      - master

jobs:
  release:
    name: release
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@master
      - uses: actions/setup-node@v1
        with:
          node-version: "12.x"
      - run: npm ci
      - run: npm run build
      - run: npx semantic-release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
EOT
git add .github/workflows/release.yml
git commit -m 'ci(release): initial version'

cat <<\EOT > .github/workflows/test.yml
name: Test
on:
  push:
    branches:
      - master
      - "greenkeeper/*"
  pull_request:
    types: [opened, synchronize]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node_version: [8, 10, 12]

    steps:
      - uses: actions/checkout@master
      - name: Use Node.js ${{ matrix.node_version }}
        uses: actions/setup-node@v1
        with:
          version: ${{ matrix.node_version }}
      - name: Install
        run: npm ci
      - name: Test
        run: npm test
EOT
git add .github/workflows/test.yml
git commit -m 'ci(test): initial version'
```

## License

[MIT](LICENSE)
