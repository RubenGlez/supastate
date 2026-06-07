#!/usr/bin/env node
import { execSync } from 'child_process'
import { readFileSync } from 'fs'

const bump = process.argv[2] ?? 'patch'
if (!['patch', 'minor', 'major'].includes(bump)) {
  console.error('Usage: release.mjs [patch|minor|major]')
  process.exit(1)
}

function run(cmd) {
  execSync(cmd, { stdio: 'inherit' })
}

function get(cmd) {
  return execSync(cmd, { encoding: 'utf8' }).trim()
}

const branch = get('git rev-parse --abbrev-ref HEAD')
if (branch !== 'main') {
  console.error(`Must be on main (currently on ${branch})`)
  process.exit(1)
}

const status = get('git status --porcelain')
if (status) {
  console.error('Working tree is dirty — commit or stash changes first')
  process.exit(1)
}

run('git fetch origin main')
const behind = get('git rev-list HEAD..origin/main --count')
if (behind !== '0') {
  console.error(`Branch is ${behind} commit(s) behind origin/main — pull first`)
  process.exit(1)
}

run('pnpm lint')
run('pnpm typecheck')
run('pnpm test')
run('pnpm build')
run('pnpm audit --audit-level=high --prod')

run(`npm version ${bump} --no-git-tag-version`)

const { version } = JSON.parse(readFileSync('package.json', 'utf8'))
const tag = `v${version}`

run('git add package.json')
run(`git commit -m "${tag}"`)
run(`git tag ${tag}`)
run('git push && git push --tags')
run('pnpm publish --provenance --no-git-checks')
