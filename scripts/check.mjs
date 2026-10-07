import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const skillRoot = path.join(root, 'skills/whywire');
const ignored = new Set(['.git', 'node_modules', '__pycache__']);

async function filesUnder(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue;
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await filesUnder(filename));
    else if (entry.isFile()) files.push(filename);
  }
  return files.sort();
}

const within = (base, filename) => {
  const relative = path.relative(base, filename);
  return relative === '' || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative));
};

const files = await filesUnder(root);
const knownFiles = new Set(files);
const diagramDocuments = [];
let links = 0;

// The repository uses ordinary inline Markdown links. This is a file/line
// reference check, not a general Markdown or semantic evidence validator.
for (const filename of files.filter(file => file.endsWith('.md'))) {
  const source = await readFile(filename, 'utf8');
  if (/^```mermaid\s*$/m.test(source)) diagramDocuments.push(filename);
  for (const match of source.matchAll(/!?\[[^\]\n]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) {
    const href = match[1];
    if (/^[a-z][a-z\d+.-]*:/i.test(href) || href.startsWith('#')) continue;
    assert(!path.isAbsolute(href), `Use portable relative links: ${filename}: ${href}`);
    const [target, fragment = ''] = href.split('#');
    const resolved = path.resolve(path.dirname(filename), decodeURIComponent(target));
    assert(within(root, resolved), `Link escapes repository: ${filename}: ${href}`);
    assert(knownFiles.has(resolved), `Missing linked file: ${filename}: ${href}`);
    if (within(skillRoot, filename)) {
      assert(within(skillRoot, resolved), `Installed skill needs an external file: ${href}`);
    }
    const lineReference = /^L(\d+)(?:-L?(\d+))?$/.exec(fragment);
    if (lineReference) {
      const targetSource = await readFile(resolved, 'utf8');
      const count = targetSource.trimEnd().split('\n').length;
      const start = Number(lineReference[1]);
      const end = Number(lineReference[2] ?? start);
      assert(start >= 1 && end >= start && end <= count, `Invalid line reference: ${filename}: ${href}`);
    }
    links++;
  }
}
assert.equal(await readFile(path.join(root, 'LICENSE'), 'utf8'), await readFile(path.join(skillRoot, 'LICENSE'), 'utf8'));
console.log(`PASS: ${links} local file/line links and the installed license.`);

execFileSync(process.execPath, [path.join(root, 'scripts/check-guide.mjs')], {
  cwd: root,
  stdio: 'inherit',
  timeout: 30_000,
});

for (const filename of files.filter(file => path.basename(file) === 'app.py' && within(path.join(root, 'examples'), file))) {
  execFileSync('python3', [filename, '--check'], {
    cwd: path.dirname(filename),
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
    stdio: 'inherit',
    timeout: 30_000,
  });
}

const output = await mkdtemp(path.join(tmpdir(), 'whywire-render-'));
const cli = path.join(root, 'node_modules/.bin/mmdc');
try {
  for (const [index, filename] of diagramDocuments.entries()) {
    console.log(`Rendering ${path.relative(root, filename)}`);
    execFileSync(cli, ['-i', filename, '-o', path.join(output, `${index}.md`)], {
      cwd: root,
      stdio: 'inherit',
      timeout: 60_000,
    });
  }
  console.log(`PASS: Mermaid rendered in ${diagramDocuments.length} Markdown files.`);
} finally {
  await rm(output, { recursive: true, force: true });
}
