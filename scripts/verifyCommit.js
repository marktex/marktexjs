// Invoked on the commit-msg git hook.

const chalk = require('chalk')
const message = require('fs')
  .readFileSync(process.env.GIT_PARAMS, 'utf-8')
  .trim()

const COMMIT_REG = /^(revert: )?(work|feat|fix|docs|style|refactor|perf|test|workflow|build|ci|chore|release)(\(.+\))?: .{1,50}/

if (!COMMIT_REG.test(message)) {
  console.log()
  console.error(
    `  ${chalk.bgRed.white(' ERROR ')} ${chalk.red(
      `invalid commit message format.`
    )}\n\n` +
      chalk.red(
        `  Proper commit message format is required for automated changelog generation. Examples:\n\n`
      ) +
      `    ${chalk.green(`feat(compiler): add 'comments' option`)}\n` +
      `    ${chalk.green(
        `fix(v-model): handle events on blur (close #28)`
      )}\n\n` +
      chalk.red(`  See .github/commit-convention.md for more details.\n`)
  )
  process.exit(1)
}
