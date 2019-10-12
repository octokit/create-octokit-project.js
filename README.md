# Create new Octokit JS project

> "npm init" script to create a new folder and repository for an Octokit JavaScript project

## Usage

```shell
npm init octokit-project
```

## What it does

Here is what happens on the example of [`octokit/action.js`](https://github.com/octokit/action.js/tree/e99b5879e2fbb7a156fc289b134377eb3d2597b5)

- Create a new folder
- Init git in the new folder
- Add `LICENSE`, `CODE_OF_CONDUCT.md` and `README.md` files
- Create a repository
- Add repository as `git remote`
- Push the 3 files to master
- Create a new local branch called `initial-version`
- Create a `package.json` and `package-lock.json`. Install dev dependencies.
- Create `.gitignore`, `tsconfig.json`
- Create `test/smoke.test.ts`
- Create a pull request
- Adds repository collaborators
- Adds branch protection
- Adds workflow files for tests and automated releases
- Logs final TODOs for you that cannot be automated yet

## Contribute

Pull requests welcome! My longer term goal is to make this script useful for Octokit Plugin developers.

## License

[MIT](LICENSE)
