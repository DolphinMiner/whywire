# A single-file scenario guide

The reader should understand the product, choose a user scenario, follow its
request, and find the corresponding source. One HTML is the reading entry point.
The builder needs Node.js 18+ and no packages; readers only need a browser.

## Author the input

Use the reader's language. `lang` accepts `en` and `zh-CN` for interface labels;
it does not translate authored content. Minimal shape (illustrative, not an
inspected application):

```json
{
  "lang": "en",
  "title": "Example project",
  "summary": "Who uses it, what they do, and the outcome they get.",
  "audience": "A developer who has never worked on this project.",
  "revision": "The inspected commit and relevant working-tree changes.",
  "scope": "Source walkthrough; not a live request trace.",
  "scenarios": [{
    "id": "read-item",
    "title": "Read an item",
    "summary": "Follow a read from request to returned value.",
    "actor": "A caller",
    "trigger": "Request an item by its key.",
    "outcome": "The caller receives the stored value.",
    "steps": [{
      "title": "Read the requested value",
      "component": "Read handler",
      "detail": "Look up the key and return its value to the caller.",
      "sources": [{"file": "src/items.ts", "symbol": "readItem", "line": 12}]
    }],
    "branches": [{"condition": "The item is missing", "path": "Explain the inspected alternative and its outcome."}]
  }],
  "omitted": ["Paths intentionally left for a later walkthrough."]
}
```

Top-level fields above are required except `omitted`. Each scenario needs the
fields shown through `steps`; `branches` and `mermaid` are optional. IDs must be
unique lowercase slugs (`a-z`, then `a-z`, digits or hyphens). Each step needs at least one source with a
repository-relative `file` and `symbol`. A positive `line` and an inspected
HTTP(S) `url` are optional. All authored values are plain text.

Use a commit-pinned URL when available. For a private or local checkout, show
the path, line, and symbol; do not manufacture a public URL or expose absolute
personal paths. State in `scope` when sources are local locators, not clickable
hosted links. Reading or generating a local guide does not authorize publication.

## Keep each scenario small

- Titles name user actions; summaries say why someone would open that scenario.
- Steps name operations, their responsible components, and data or results
  passed onward. Use short labels and one concise explanation per step.
- The visible flow is an authored main path, not measured timing. Label async
  and conditional work. In `branches`, say where alternatives leave or rejoin
  that path when relevant.
- Do not invent serial order for concurrent activity. Group it in a meaningful
  stage and explain its concurrency; optional `mermaid` can retain an exact
  editable view inside the same file.
- Code entry points help readers understand a step. Add a few strong references,
  not an inventory of everything inspected.
- If a whole scenario is unresolved, omit it with the reason. Disclose partial
  coverage in `scope`/`omitted` instead of fabricating a complete flow.

## Build and inspect

Run `scripts/build-guide.mjs` with the JSON input and destination HTML path.
JSON is preparation material, not a second required reader file. Moving the HTML
must preserve its presentation. Optional source links still need network/access.

Open the result: product explanation and scenario choices should be immediately
visible. Navigation must reveal the matching scenario; explanations and sources
must remain available with JavaScript disabled. Check keyboard focus and narrow
screens. Screenshots capture the actual generated file, not a separate mockup.

The builder checks input shape and escaping, not architectural correctness.
The agent remains responsible for the source and explanation.
