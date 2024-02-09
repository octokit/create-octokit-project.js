# Create new Octokit JS project

> "[npm init](https://docs.npmjs.com/cli/v7/commands/npm-init)" script to create a new folder and repository for an Octokit JavaScript module (plugin, authentication strategy, or otherwise)

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
- Push the 3 files to main
- Creates a new local branch called `initial-version`
- Creates a `package.json` and `package-lock.json`. Installs dev dependencies.
- Creates `.gitignore`, `tsconfig.json`
- Creates `test/smoke.test.ts`
- Creates actions for tests and automated releases
- Creates a pull request with further instructions
- Adds branch protection

## Contribute

Pull requests welcome! My longer term goal is to make this script useful for Octokit Plugin developers.

## License

[MIT](LICENSE)
