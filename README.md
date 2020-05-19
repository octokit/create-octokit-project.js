# Create new Octokit JS project

> "npm init" script to create a new folder and repository for an Octokit JavaScript project

[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=octokit/create-octokit-project.js)](https://dependabot.com/)

## Usage

```shell
npm init octokit-project
```

## What it does

- Creates a new folder on your machine
- Inits git in the new folder
- Add `LICENSE`, `CODE_OF_CONDUCT.md` and `README.md` files
- Creates a repository
- Adds repository as `git remote add origin <url>`
- Push the 3 files to master
- Creates a new local branch called `initial-version`
- Creates a `package.json` and `package-lock.json`. Installs dev dependencies.
- Creates `.gitignore`, `tsconfig.json`
- Creates `test/smoke.test.ts`
- Creates actions for tests and automated releases
- Creates a pull request
- Adds repository collaborators
- Adds branch protection
- Adds workflow files for tests and automated releases

## Contribute

Pull requests welcome! My longer term goal is to make this script useful for Octokit Plugin developers.

## License

[MIT](LICENSE)
