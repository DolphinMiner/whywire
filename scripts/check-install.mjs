import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { lstatSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { stripVTControlCharacters } from 'node:util';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const installer = join(projectRoot, 'node_modules', 'skills', 'bin', 'cli.mjs');
const installerVersion = JSON.parse(readFileSync(join(projectRoot, 'node_modules', 'skills', 'package.json'), 'utf8')).version;
const temporaryRoot = mkdtempSync(join(tmpdir(), 'whywire-install-'));
const environment = {
  ...process.env,
  DO_NOT_TRACK: '1',
  XDG_STATE_HOME: join(temporaryRoot, 'state'),
  npm_config_cache: join(temporaryRoot, 'npm-cache'),
  npm_config_update_notifier: 'false',
  FORCE_COLOR: '0',
};

function files(directory, prefix = '') {
  assert(lstatSync(directory).isDirectory(), `Expected a real directory: ${directory}`);
  const result = new Map();
  for (const name of readdirSync(directory).sort()) {
    const path = join(directory, name);
    const relativePath = join(prefix, name);
    const stat = lstatSync(path);
    assert(!stat.isSymbolicLink(), `Unexpected symbolic link: ${path}`);
    if (stat.isDirectory()) {
      for (const entry of files(path, relativePath)) result.set(...entry);
    } else {
      assert(stat.isFile(), `Expected a regular file: ${path}`);
      result.set(relativePath, readFileSync(path));
    }
  }
  return result;
}

function run(cwd, arguments_) {
  const result = spawnSync(process.execPath, [installer, 'add', projectRoot, ...arguments_], {
    cwd,
    env: environment,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    timeout: 120_000,
    maxBuffer: 2 * 1024 * 1024,
  });
  if (result.error || result.status !== 0) {
    throw new Error(`skills ${arguments_.join(' ')} failed: ${result.error?.message ?? result.signal ?? result.status}\n${result.stdout ?? ''}${result.stderr ?? ''}`);
  }
  return stripVTControlCharacters(result.stdout);
}

try {
  const expected = files(join(projectRoot, 'skills', 'whywire'));
  assert(expected.has('SKILL.md'), 'The source package must contain SKILL.md');
  console.log(`Checking skills@${installerVersion} discovery in a temporary project...`);
  const listing = run(temporaryRoot, ['--list']);
  assert.match(listing, /Found 1 skill\b/, 'Expected exactly one discoverable skill');
  assert.match(listing, /^\s*[│|]?\s*whywire\s*$/m, 'Discovery must list whywire by name');

  // Agent IDs and project paths: vercel-labs/skills/blob/v1.7.0/src/agents.ts.
  for (const [agent, folder] of [['codex', '.agents'], ['claude-code', '.claude']]) {
    const cwd = join(temporaryRoot, agent);
    mkdirSync(cwd);
    run(cwd, ['--skill', 'whywire', '--agent', agent, '--copy', '--yes']);
    const installed = files(join(cwd, folder, 'skills', 'whywire'));
    assert.deepEqual([...installed.keys()], [...expected.keys()], `${agent}: installed file set differs`);
    for (const [path, content] of expected) {
      assert(content.equals(installed.get(path)), `${agent}: installed bytes differ: ${path}`);
    }
    const output = join(cwd, 'whywire.html');
    const build = spawnSync(process.execPath, [
      join(cwd, folder, 'skills', 'whywire', 'scripts', 'build-guide.mjs'),
      join(projectRoot, 'examples', 'cache-read', 'guide.json'), output,
    ], { cwd, env: environment, encoding: 'utf8', timeout: 30_000 });
    assert.equal(build.status, 0, `${agent}: copied builder failed: ${build.stderr ?? build.error}`);
    assert(readFileSync(output).equals(readFileSync(join(projectRoot, 'examples', 'cache-read', 'guide.html'))),
      `${agent}: copied builder output differs from the public demo`);
    console.log(`${agent}: ${installed.size} files copied byte-for-byte; no symbolic links`);
    console.log(`${agent}: installed builder produced the complete standalone demo`);
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  rmSync(temporaryRoot, { recursive: true, force: true });
}
