import { readFile, realpath, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const template = await readFile(new URL('../assets/guide.html', import.meta.url), 'utf8');
const renderer = await readFile(new URL('../assets/mermaid.min.js', import.meta.url), 'utf8');
const rendererLicense = await readFile(new URL('../assets/mermaid-LICENSE.txt', import.meta.url), 'utf8');
const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const text = (value, label) => {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${label} must be non-empty text`);
  return value;
};
const list = (value, label) => {
  if (!Array.isArray(value) || !value.length) throw new Error(`${label} must be a non-empty array`);
  return value;
};

const labels = {
  en: {
    guide: 'A guide through the code', scenarios: 'Choose a scenario', audience: 'Who this is for',
    scope: 'What this guide covers', revision: 'Source revision', about: 'About this guide', actor: 'Who acts', trigger: 'Starts with',
    outcome: 'What they get', flow: 'Follow the request', schematic: 'A source-based path. Branches and timing are noted below.',
    branches: 'Branches & timing', stepDetails: 'Step explanations & code entry points', mermaid: 'View Mermaid source', sourceNote: 'Editable Mermaid source for this scenario.',
    fit: 'Fit to width', actual: 'Actual size', loading: 'Rendering diagram…', diagramError: 'Diagram could not render. Check the Mermaid source below.', noScript: 'Enable JavaScript to render the diagram. Its source and step explanations are available below.', diagramHint: 'Use actual size and scroll to read a wide diagram.', licenses: 'Mermaid license',
    omitted: 'Outside this guide', footer: 'Based on inspected source, not a recorded runtime trace. Source references remain readable offline; web links need a connection.',
    print: 'Print / save PDF', skip: 'Skip to scenarios', steps: 'steps',
  },
  'zh-CN': {
    guide: '沿着请求读懂代码', scenarios: '选择使用场景', audience: '适合谁阅读',
    scope: '本次梳理范围', revision: '源码版本', about: '阅读范围与源码', actor: '谁来操作', trigger: '从这里开始',
    outcome: '最终得到什么', flow: '跟随一次请求', schematic: '根据源码整理的路径；分支与时序说明见下方。',
    branches: '分支与时序', stepDetails: '步骤解释与代码入口', mermaid: '查看 Mermaid 源码', sourceNote: '这个场景对应的可编辑 Mermaid 源码。',
    fit: '适应宽度', actual: '原始大小', loading: '正在绘制图形…', diagramError: '图形渲染失败，请检查下方 Mermaid 源码。', noScript: '启用 JavaScript 可查看图形；下方仍可阅读源码和步骤解释。', diagramHint: '宽图可切换原始大小，横向滚动阅读。', licenses: 'Mermaid 许可证',
    omitted: '本次未展开', footer: '根据已阅读的源码梳理，不代表实际运行追踪。源码位置可离线阅读；网页链接需要联网。',
    print: '打印 / 保存 PDF', skip: '跳到使用场景', steps: '步',
  },
};

function sourceMarkup(source, label) {
  if (!source || typeof source !== 'object') throw new Error(`${label} must be an object`);
  const file = text(source.file, `${label}.file`);
  if (/^(?:[a-z][a-z\d+.-]*:|[/\\])/i.test(file) || file.includes('\\') || file.split('/').some(part => part === '..' || !part)) {
    throw new Error(`${label}.file must be a portable repository-relative path`);
  }
  const symbol = text(source.symbol, `${label}.symbol`);
  if (source.line !== undefined && (!Number.isInteger(source.line) || source.line < 1)) throw new Error(`${label}.line must be a positive integer`);
  const reference = `<code>${escape(file)}${source.line ? `:${source.line}` : ''}</code><span class="symbol">${escape(symbol)}</span>`;
  if (source.url === undefined) return `<span class="source">${reference}</span>`;
  let url;
  try { url = new URL(text(source.url, `${label}.url`)); } catch { throw new Error(`${label}.url must be an absolute http(s) URL`); }
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) throw new Error(`${label}.url must be an absolute http(s) URL without credentials`);
  return `<a class="source" href="${escape(url.href)}" rel="noopener noreferrer">${reference}</a>`;
}

export function renderGuide(input) {
  if (!input || typeof input !== 'object' || !Object.hasOwn(labels, input.lang)) throw new Error('lang must be en or zh-CN');
  const t = labels[input.lang];
  for (const field of ['title', 'summary', 'audience', 'revision', 'scope']) text(input[field], field);
  const scenarios = list(input.scenarios, 'scenarios');
  const ids = new Set();
  const content = scenarios.map((scenario, index) => {
    const label = `scenarios[${index}]`;
    if (!scenario || typeof scenario !== 'object') throw new Error(`${label} must be an object`);
    for (const field of ['id', 'title', 'summary', 'actor', 'trigger', 'outcome']) text(scenario[field], `${label}.${field}`);
    if (!/^[a-z][a-z0-9-]*$/.test(scenario.id) || ids.has(scenario.id)) throw new Error(`${label}.id must be a unique lowercase slug`);
    ids.add(scenario.id);
    const steps = list(scenario.steps, `${label}.steps`).map((step, stepIndex) => {
      const stepLabel = `${label}.steps[${stepIndex}]`;
      if (!step || typeof step !== 'object') throw new Error(`${stepLabel} must be an object`);
      for (const field of ['title', 'component', 'detail']) text(step[field], `${stepLabel}.${field}`);
      const sources = list(step.sources, `${stepLabel}.sources`).map((source, i) => sourceMarkup(source, `${stepLabel}.sources[${i}]`)).join('');
      return `<li class="flow-step"><span class="step-number" aria-hidden="true">${stepIndex + 1}</span><div><h4>${escape(step.title)} <span class="component">${escape(step.component)}</span></h4><p>${escape(step.detail)}</p><div class="sources">${sources}</div></div></li>`;
    }).join('\n');
    const diagram = text(scenario.mermaid, `${label}.mermaid`);
    const header = diagram.split(/\r?\n/).find(line => line.trim() && !line.trim().startsWith('%%'))?.trim();
    if (diagram.length > 20000 || /%%\s*\{/.test(diagram) || !/^(?:sequenceDiagram\b|flowchart\b|graph\b|stateDiagram(?:-v2)?\b)/.test(header ?? '')) {
      throw new Error(`${label}.mermaid must be a sequence, flowchart, or state diagram of at most 20000 characters, without configuration directives or frontmatter`);
    }
    const flowMap = `<div class="diagram" data-error="${t.diagramError}"><div class="diagram-tools" hidden><button type="button" data-size="fit" aria-pressed="true">${t.fit}</button><button type="button" data-size="actual" aria-pressed="false">${t.actual}</button><span>${t.diagramHint}</span></div><p class="diagram-status" role="status" hidden>${t.loading}</p><div class="diagram-viewport" tabindex="0" role="region" aria-label="${escape(scenario.title)}"><div class="diagram-svg"></div></div><noscript><p>${t.noScript}</p></noscript></div>`;
    let branches = '';
    if (scenario.branches !== undefined) {
      if (!Array.isArray(scenario.branches)) throw new Error(`${label}.branches must be an array`);
      if (scenario.branches.length) branches = `<details class="supplement"><summary>${t.branches}</summary><dl class="branch-list">${scenario.branches.map((branch, i) => {
        const branchLabel = `${label}.branches[${i}]`;
        if (!branch || typeof branch !== 'object') throw new Error(`${branchLabel} must be an object`);
        return `<dt>${escape(text(branch.condition, `${branchLabel}.condition`))}</dt><dd>${escape(text(branch.path, `${branchLabel}.path`))}</dd>`;
      }).join('')}</dl></details>`;
    }
    const mermaid = `<details class="supplement diagram-source"><summary>${t.mermaid}</summary><p>${t.sourceNote}</p><pre><code>${escape(diagram)}</code></pre></details>`;
    return `<details class="scenario" id="scenario-${escape(scenario.id)}"${index === 0 ? ' open' : ''}>
      <summary><span><h2>${escape(scenario.title)}</h2><span class="scenario-summary">${escape(scenario.summary)}</span></span><span class="step-count">${scenario.steps.length} ${t.steps}</span></summary>
      <div class="scenario-body"><p class="scenario-outcome"><strong>${t.outcome}</strong> ${escape(scenario.outcome)}</p>
      <div class="flow-heading"><h3>${t.flow}</h3><p>${t.schematic}</p></div>${flowMap}<details class="supplement step-details"><summary>${t.stepDetails}</summary><dl class="scenario-context"><div><dt>${t.actor}</dt><dd>${escape(scenario.actor)}</dd></div><div><dt>${t.trigger}</dt><dd>${escape(scenario.trigger)}</dd></div></dl><ol class="flow">${steps}</ol></details>${branches}${mermaid}</div></details>`;
  }).join('\n');
  let omitted = '';
  if (input.omitted !== undefined) {
    if (!Array.isArray(input.omitted)) throw new Error('omitted must be an array');
    if (input.omitted.length) omitted = `<details class="omitted"><summary>${t.omitted}</summary><ul>${input.omitted.map((item, i) => `<li>${escape(text(item, `omitted[${i}]`))}</li>`).join('')}</ul></details>`;
  }
  const replacements = {
    LANG: input.lang, TITLE: escape(input.title), SUMMARY: escape(input.summary),
    AUDIENCE: escape(input.audience), SCOPE: escape(input.scope), REVISION: escape(input.revision),
    SCENARIOS: content, OMITTED: omitted,
    MERMAID_RUNTIME: renderer.replace(/<\/script/gi, '<\\/script'), MERMAID_LICENSE: escape(rendererLicense),
    NAV: scenarios.map((scenario, index) => `<li><a href="#scenario-${escape(scenario.id)}"${index === 0 ? ' aria-current="location"' : ''}>${escape(scenario.title)}</a></li>`).join('\n'),
    ...Object.fromEntries(Object.entries(t).map(([key, value]) => [`LABEL_${key.toUpperCase()}`, value])),
  };
  return template.replace(/\{\{([A-Z_]+)\}\}/g, (_, key) => {
    if (!(key in replacements)) throw new Error(`Unknown template slot: ${key}`);
    return replacements[key];
  });
}

// Node may canonicalize import.meta.url while argv retains a symlinked path.
if (process.argv[1] && await realpath(process.argv[1]).catch(() => null) === await realpath(fileURLToPath(import.meta.url))) {
  try {
    const [, , inputPath, outputPath, ...extra] = process.argv;
    if (!inputPath || !outputPath || extra.length) throw new Error('Usage: node build-guide.mjs input.json output.html');
    if (resolve(inputPath) === resolve(outputPath)) throw new Error('Input and output paths must differ');
    const result = renderGuide(JSON.parse(await readFile(inputPath, 'utf8')));
    await writeFile(outputPath, result);
    console.log(`Created ${outputPath}`);
  } catch (error) {
    console.error(`Whywire: ${error.message}`);
    process.exitCode = 1;
  }
}
