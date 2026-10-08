import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Script } from 'node:vm';
import { renderGuide } from '../skills/whywire/scripts/build-guide.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const input = JSON.parse(await readFile(path.join(root, 'examples/cache-read/guide.json'), 'utf8'));
const html = renderGuide(input);
assert.equal(html, renderGuide(input), 'Rendering should be deterministic');
assert.equal(html, await readFile(path.join(root, 'examples/cache-read/guide.html'), 'utf8'), 'Regenerate the committed guide with npm run demo:guide');
assert(html.includes(input.title) && html.includes(input.summary), 'Product orientation must come from input');
for (const scenario of input.scenarios) {
  assert(html.includes(`id="scenario-${scenario.id}"`));
  assert(html.includes(`href="#scenario-${scenario.id}"`));
  for (const step of scenario.steps) {
    assert(html.includes(step.title) && html.includes(step.detail));
    for (const source of step.sources) {
      assert(html.includes(`${source.file}:${source.line}`), 'Portable source reference must be present');
      const lines = (await readFile(path.join(root, source.file), 'utf8')).split('\n');
      assert(source.line > 0 && source.line <= lines.length, 'Fixture line reference must exist');
    }
  }
}
const scripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)];
assert.equal(scripts.length, 2, 'Only the pinned renderer and guide interactions execute');
for (const [, script] of scripts) new Script(script);
const noScript = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '');
assert(!/<(?:script|link|img|iframe)\b[^>]*(?:src|href)\s*=/i.test(noScript), 'Offline guide must not load external resources');
assert(!/@import|url\s*\(/i.test(noScript), 'Authored CSS must not load external resources');
assert(!/file:\/\/|\/Users\//.test(noScript), 'No machine-specific paths');
const vendor = await readFile(path.join(root, 'skills/whywire/assets/mermaid.min.js'), 'utf8');
assert.equal(vendor, await readFile(path.join(root, 'node_modules/mermaid/dist/mermaid.min.js'), 'utf8'), 'Vendor must match the lockfile-pinned upstream renderer');
assert.equal(await readFile(path.join(root, 'skills/whywire/assets/mermaid-LICENSE.txt'), 'utf8'), await readFile(path.join(root, 'node_modules/mermaid/LICENSE'), 'utf8'));
assert(noScript.includes("connect-src 'none'"), 'Diagram rendering must not require network access');
assert(noScript.includes(input.scenarios[1].steps[2].detail), 'All scenario content is present without JavaScript');
assert(noScript.includes('<details class="scenario"') && noScript.includes('<summary>'), 'Native controls work without JavaScript');
assert(noScript.includes('id="scenario-first-read" open'), 'First scenario starts expanded');

const hostile = structuredClone(input);
hostile.title = '<img src=x onerror=alert(1)>';
hostile.scenarios[0].steps[0].detail = '</p><script>alert("bad")</script>';
hostile.scenarios[0].mermaid = 'sequenceDiagram\nA->>B: </code></pre><script>alert(2)</script>';
const escaped = renderGuide(hostile);
assert(!escaped.includes(hostile.title) && escaped.includes('&lt;img src=x onerror=alert(1)&gt;'));
assert(!escaped.includes(hostile.scenarios[0].steps[0].detail));
assert.equal((escaped.match(/<script\b/g) || []).length, (html.match(/<script\b/g) || []).length, 'Untrusted text must not add executable script');
for (const mermaid of ['', 'sequenceDiagram\n' + 'a'.repeat(20000), '%%{init: {"securityLevel":"loose"}}%%\nsequenceDiagram\nA->>B: hi', '---\nconfig:\n  theme: dark\n---\nsequenceDiagram\nA->>B: hi', 'not a diagram']) {
  const invalid = structuredClone(input);
  invalid.scenarios[0].mermaid = mermaid;
  assert.throws(() => renderGuide(invalid), /mermaid/);
}
const source = hostile.scenarios[0].steps[0].sources[0];
for (const url of ['javascript:alert(1)', 'data:text/html,bad', 'file:///tmp/code', '//example.com/code', 'https://user:secret@example.com/code']) {
  source.url = url;
  assert.throws(() => renderGuide(hostile), /absolute http\(s\) URL/);
}
source.url = 'https://example.com/code?x="&y=<';
assert(renderGuide(hostile).includes('href="https://example.com/code?x=%22&amp;y=%3C"'), 'Valid links must be attribute-escaped');
delete source.url;
for (const file of ['/Users/person/project/code.js', '../code.js', 'C:\\code.js', 'src/../../code.js']) {
  source.file = file;
  assert.throws(() => renderGuide(hostile), /portable repository-relative path/);
}
for (const mutate of [
  value => { value.lang = 'constructor'; },
  value => { value.summary = ''; },
  value => { value.scenarios = []; },
  value => { value.scenarios[0].id = 'x" onclick="bad'; },
  value => { value.scenarios[1].id = value.scenarios[0].id; },
  value => { value.scenarios[0].steps = []; },
  value => { delete value.scenarios[0].mermaid; },
  value => { value.scenarios[0].steps[0].sources = []; },
  value => { value.scenarios[0].steps[0].sources[0].line = -1; },
]) {
  const invalid = structuredClone(input);
  mutate(invalid);
  assert.throws(() => renderGuide(invalid));
}
const chinese = structuredClone(input);
chinese.lang = 'zh-CN';
assert(renderGuide(chinese).includes('选择使用场景'));

const temp = await mkdtemp(path.join(tmpdir(), 'whywire-guide-'));
try {
  const sourcePath = path.join(temp, 'input.json');
  const outputPath = path.join(temp, 'guide.html');
  await writeFile(sourcePath, JSON.stringify(input));
  execFileSync(process.execPath, [path.join(root, 'skills/whywire/scripts/build-guide.mjs'), sourcePath, outputPath]);
  assert.equal(await readFile(outputPath, 'utf8'), html, 'CLI must produce the same complete artifact');
  const linkedSkill = path.join(temp, 'linked-skill');
  const linkedOutput = path.join(temp, 'linked-guide.html');
  await symlink(path.join(root, 'skills/whywire'), linkedSkill, 'dir');
  execFileSync(process.execPath, [path.join(linkedSkill, 'scripts/build-guide.mjs'), sourcePath, linkedOutput]);
  assert.equal(await readFile(linkedOutput, 'utf8'), html, 'CLI must run through a symlinked directory');
  await writeFile(sourcePath, '{"lang":"bad"}');
  assert.throws(() => execFileSync(process.execPath, [path.join(root, 'skills/whywire/scripts/build-guide.mjs'), sourcePath, outputPath], { stdio: 'pipe' }));
  assert.equal(await readFile(outputPath, 'utf8'), html, 'Invalid input must preserve an existing output');
} finally {
  await rm(temp, { recursive: true, force: true });
}
console.log('PASS: standalone guide, portable evidence, safe input handling, no-script content, and CLI output.');
