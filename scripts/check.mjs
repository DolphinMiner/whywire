import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer';
import { renderGuide } from '../skills/whywire/scripts/build-guide.mjs';

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
  // Render isolated generated artifacts, just as the Mermaid CLI below does.
  const browser = await puppeteer.launch({ ...(process.env.PUPPETEER_EXECUTABLE_PATH ? { executablePath: process.env.PUPPETEER_EXECUTABLE_PATH } : {}) });
  try {
    const page = await browser.newPage();
    const externalRequests = [];
    await page.setRequestInterception(true);
    page.on('request', request => {
      if (/^https?:/.test(request.url())) { externalRequests.push(request.url()); request.abort(); }
      else request.continue();
    });
    const demo = pathToFileURL(path.join(root, 'examples/cache-read/guide.html')).href;
    await page.goto(demo);
    await page.waitForFunction(() => [...document.querySelectorAll('.diagram')].every(d => ['ready', 'error'].includes(d.dataset.state)));
    assert.deepEqual(await page.$$eval('.diagram', elements => elements.map(d => ({ state: d.dataset.state, text: d.querySelector('svg')?.textContent.includes('Caller') }))), [{ state: 'ready', text: true }, { state: 'ready', text: true }], 'Both visible and initially closed scenarios must render actual SVG');

    const invalid = JSON.parse(await readFile(path.join(root, 'examples/cache-read/guide.json'), 'utf8'));
    invalid.scenarios[0].mermaid = 'sequenceDiagram\nThis is invalid syntax';
    invalid.scenarios[1].mermaid = 'sequenceDiagram\nC->>R: <img src="https://example.invalid/probe" onerror="alert(1)">';
    const failurePath = path.join(output, 'failure.html');
    await writeFile(failurePath, renderGuide(invalid));
    await page.goto(pathToFileURL(failurePath).href);
    await page.waitForFunction(() => [...document.querySelectorAll('.diagram')].every(d => ['ready', 'error'].includes(d.dataset.state)));
    assert.deepEqual(await page.$$eval('.diagram', elements => elements.map(d => d.dataset.state)), ['error', 'ready'], 'A syntax error must not suppress other diagrams');
    assert(await page.$eval('.diagram-source', source => source.open), 'Failed diagram must expose its source');
    assert.equal(await page.$$eval('.diagram img, .diagram [onerror]', elements => elements.length), 0, 'Hostile labels remain text');
    assert.equal(externalRequests.length, 0, 'Rendering must work without any HTTP request');

    const otherTypes = structuredClone(invalid);
    otherTypes.scenarios[0].mermaid = 'flowchart LR\nA[Request] --> B[Response]';
    otherTypes.scenarios[1].mermaid = 'stateDiagram-v2\n[*] --> Pending\nPending --> Done\nDone --> [*]';
    const otherPath = path.join(output, 'other-types.html');
    await writeFile(otherPath, renderGuide(otherTypes));
    await page.goto(pathToFileURL(otherPath).href);
    await page.waitForFunction(() => [...document.querySelectorAll('.diagram')].every(d => ['ready', 'error'].includes(d.dataset.state)));
    assert.deepEqual(await page.$$eval('.diagram', elements => elements.map(d => d.dataset.state)), ['ready', 'ready'], 'Supported flowchart and state diagrams must also render under the offline policy');
    assert.equal(externalRequests.length, 0);

    await page.setJavaScriptEnabled(false);
    await page.goto(demo);
    assert.equal(await page.$$eval('.diagram-source code', sources => sources.filter(source => source.textContent.startsWith('sequenceDiagram')).length), 2);
    assert(await page.$eval('noscript', element => element.getBoundingClientRect().height > 0), 'No-script readers need an honest visible explanation');
    console.log('PASS: actual offline SVG rendering, hidden scenarios, isolated syntax errors, hostile labels, and no-script fallback.');
  } finally { await browser.close(); }
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
