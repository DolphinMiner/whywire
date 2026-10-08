# A single-file scenario guide

The reader should understand the product, choose a user scenario, follow its
request, and find the corresponding source. One HTML is the reading entry point.
The builder needs Node.js 18+ and no package installation. It embeds the bundled
Mermaid 12.1.0 runtime once in the HTML. Diagrams render as SVG in a compatible
browser with JavaScript enabled; the text and native disclosures also work
without JavaScript. No CDN or sibling asset is needed.

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
    "mermaid": "sequenceDiagram\n    participant C as Caller\n    participant R as Read handler\n    participant S as Store\n    C->>R: Read item by key\n    R->>S: Look up key\n    S-->>R: Stored value\n    R-->>C: Return value",
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
fields shown through `steps`, including nonempty `mermaid`; `branches` is optional.
IDs must be unique lowercase slugs (`a-z`, then `a-z`, digits or hyphens).
Each step needs at least one source with a repository-relative `file` and
`symbol`. A positive `line` and an inspected
HTTP(S) `url` are optional. Descriptions and source references are plain text;
`mermaid` is diagram syntax authored from the inspected source.

Use `sequenceDiagram` for request flows, with real participants, calls, return
arrows, and relevant conditions or asynchronous handoffs. `flowchart`/`graph`
and `stateDiagram`/`stateDiagram-v2` are also supported when the question calls
for them. Diagram source is limited to 20,000 characters. Do not generate
the diagram from `steps`; those entries explain and support the diagram.
See [diagrams.md](diagrams.md) for examples. Do not include Mermaid directives
such as `%%{init: ...}%%` or YAML frontmatter: the template owns configuration
and uses strict security settings.

Use a commit-pinned URL when available. For a private or local checkout, show
the path, line, and symbol; do not manufacture a public URL or expose absolute
personal paths. State in `scope` when sources are local locators, not clickable
hosted links. Reading or generating a local guide does not authorize publication.

## Keep each scenario small

- Titles name user actions; summaries say why someone would open that scenario.
- Steps name operations, their responsible components, and data or results
  passed onward. Use short labels and one concise explanation per step.
- The diagram is source-backed, not measured timing. Label async
  and conditional work. In `branches`, say where alternatives leave or rejoin
  that path when relevant.
- Do not invent serial order for concurrent activity. Use supported sequence
  constructs when the code establishes concurrency; expose unresolved timing.
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
screens. Verify that each diagram renders, with readable lifelines, calls, and
returns. Check the Fit to width / Actual size control; wide diagrams must scroll
within their container on small screens instead of overflowing the page.
Rendering errors must be visible and the Mermaid source inspectable; step cards
are not a fallback. Screenshots capture the actual file, not a separate mockup.

The builder checks input shape, diagram configuration restrictions, and escaping;
it does not validate the diagram's syntax or architectural correctness. Inspect
the browser render and verify the explanation against source.

## Migrate an older input

Some 0.2 inputs omit `mermaid` because only step cards were displayed. To rebuild
them, inspect the source and add an authored `mermaid` string to every scenario.
The builder must reject a missing diagram instead of guessing one from steps.
Previously generated HTML files remain readable as they are.
