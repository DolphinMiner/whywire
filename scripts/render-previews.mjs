import { execFileSync } from 'node:child_process';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer';
import { renderGuide } from '../skills/whywire/scripts/build-guide.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'docs/previews');
const temporary = await mkdtemp(path.join(tmpdir(), 'whywire-preview-'));
const escape = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const cases = [
  { name: 'late-result', question: 'Why does a deleted item come back?', evidence: 'Store.complete · app.py:20–27', scope: 'Ordered single-process demo. Concurrent writes are not tested.' },
  { name: 'cache-read', question: 'How does a read request move through the code?', evidence: 'read_item · app.py:16–25', scope: 'In-memory Python objects. Expiry and concurrency are not tested.' },
];

await mkdir(output, { recursive: true });
const browser = await puppeteer.launch({
  headless: true,
  ...(process.env.PUPPETEER_EXECUTABLE_PATH ? { executablePath: process.env.PUPPETEER_EXECUTABLE_PATH } : {}),
});
try {
  const guide = path.join(root, 'examples/cache-read/guide.html');
  await writeFile(guide, renderGuide(JSON.parse(await readFile(path.join(root, 'examples/cache-read/guide.json'), 'utf8'))));
  const guidePage = await browser.newPage();
  await guidePage.setViewport({ width: 1440, height: 1060, deviceScaleFactor: 1 });
  await guidePage.goto(pathToFileURL(guide).href, { waitUntil: 'load' });
  await guidePage.waitForFunction(() => [...document.querySelectorAll('.diagram')].every(diagram => ['ready', 'error'].includes(diagram.dataset.state)));
  if (await guidePage.$('.diagram[data-state="error"]')) throw new Error('Public guide contains a Mermaid rendering error');
  for (const [hash, name] of [['overview', 'guide-overview'], ['structure', 'guide-structure'], ['scenarios', 'guide']]) {
    await guidePage.goto(pathToFileURL(guide).href + '#' + hash, { waitUntil: 'load' });
    await guidePage.click('#' + hash + ' h1');
    await guidePage.evaluate(() => window.scrollTo(0, 0));
    await guidePage.screenshot({ path: path.join(output, name + '.png'), fullPage: true });
  }
  await guidePage.close();
  console.log('Rendered three page previews from the standalone HTML.');
  const config = path.join(temporary, 'mermaid.json');
  await writeFile(config, JSON.stringify({
    theme: 'base',
    themeVariables: { fontFamily: 'Arial, sans-serif', primaryColor: '#edf4f0', primaryTextColor: '#19332c', primaryBorderColor: '#7b9b8c', lineColor: '#456158', signalColor: '#19332c', signalTextColor: '#19332c', noteBkgColor: '#fff0d6', noteBorderColor: '#dcb477', noteTextColor: '#563d1c', actorBkg: '#edf4f0', actorBorder: '#7b9b8c', actorTextColor: '#19332c' },
  }));
  for (const example of process.argv.includes('--guide-only') ? [] : cases) {
    const directory = path.join(root, 'examples', example.name);
    const markdown = await readFile(path.join(directory, 'explanation.md'), 'utf8');
    const diagram = markdown.match(/```mermaid\n([\s\S]*?)```/)[1];
    const conclusion = markdown.split('\n\n')[1].replaceAll('\n', ' ').replaceAll('`', '');
    const observed = execFileSync('python3', [path.join(directory, 'app.py')], { encoding: 'utf8', timeout: 30_000 }).trim();
    const input = path.join(temporary, `${example.name}.mmd`);
    const rendered = path.join(temporary, `${example.name}.svg`);
    await writeFile(input, diagram);
    execFileSync(path.join(root, 'node_modules/.bin/mmdc'), ['-i', input, '-o', rendered, '-c', config, '-b', 'white'], { stdio: 'inherit', timeout: 60_000 });
    const svg = (await readFile(rendered, 'utf8')).replace(/^[\s\S]*?(?=<svg)/, '');
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 1000, deviceScaleFactor: 1.5 });
    await page.setContent(`<!doctype html><html lang="en"><meta charset="utf-8"><style>
      * { box-sizing: border-box; } body { margin: 0; color: #19332c; background: #f3f5f1; font-family: Arial, sans-serif; }
      main { padding: 36px; } header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 26px; }
      .brand { font-size: 26px; font-weight: 700; letter-spacing: -1px; } .label { font-size: 13px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #567064; }
      h1 { margin: 10px 0 26px; font-size: 36px; letter-spacing: -1px; line-height: 1.15; }
      .content { display: grid; grid-template-columns: 780px 1fr; gap: 28px; align-items: start; }
      .diagram { padding: 18px 8px; background: white; border: 1px solid #d9e2da; border-radius: 14px; }
      .diagram svg { display: block; width: 100%; max-width: none !important; height: auto; }
      aside { padding: 4px 0; } h2 { font-size: 13px; letter-spacing: 1px; text-transform: uppercase; color: #567064; margin: 0 0 12px; }
      p { font-size: 18px; line-height: 1.5; margin: 0 0 28px; } pre { white-space: pre-wrap; overflow-wrap: anywhere; font: 14px/1.6 Menlo, Consolas, monospace; background: #e6ede6; padding: 16px; border-radius: 10px; margin: 0 0 26px; }
      .evidence { font: 15px/1.5 Menlo, Consolas, monospace; } .scope { font-size: 14px; color: #567064; }
      footer { display: flex; justify-content: space-between; gap: 20px; margin-top: 22px; font-size: 13px; color: #567064; }
    </style><main>
      <header><span class="brand">Whywire</span><span class="label">Rendered worked example</span></header>
      <div class="label">The question</div><h1>${escape(example.question)}</h1>
      <div class="content"><div class="diagram">${svg}</div><aside>
        <h2>The explanation</h2><p>${escape(conclusion)}</p>
        <h2>Source evidence</h2><p class="evidence">${escape(example.evidence)}</p>
        <h2>Observed locally</h2><pre>${escape(observed)}</pre>
        <p class="scope">${escape(example.scope)}</p>
      </aside></div>
      <footer><span>Synthetic teaching case · Diagram + explanation + evidence</span><span>examples/${escape(example.name)}/</span></footer>
    </main></html>`, { waitUntil: 'load' });
    await page.screenshot({ path: path.join(output, `${example.name}.png`), fullPage: true });
    await page.close();
    console.log(`Rendered docs/previews/${example.name}.png`);
  }
} finally {
  await browser.close();
  await rm(temporary, { recursive: true, force: true });
}
