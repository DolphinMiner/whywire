# One HTML, three reading pages

The reader should understand the product, recognize its code organization,
choose a user scenario, and follow the request into source. One HTML is the
reading entry point, with three hash-navigable pages:

| Page | Contents |
| --- | --- |
| `#overview` (default) | Product purpose, capabilities, verified languages and technology roles. |
| `#structure` | Annotated directory tree, major package responsibilities, and source entry points. |
| `#scenarios` | Scenario choices and source-backed Mermaid request flows. |

`#scenario-<id>` opens a particular scenario on the Scenarios page. Browser
back/forward keeps the selected page. Without JavaScript, all content remains
in one readable document with native anchors and disclosures; printing includes
all pages.

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
  "features": [{
    "title": "Read a saved item",
    "description": "Look up an item by its key.",
    "scenario": "read-item"
  }],
  "stack": [{
    "category": "Language",
    "name": "TypeScript",
    "purpose": "Implements the read handler and store access.",
    "sources": [{"file": "src/items.ts", "symbol": "readItem", "line": 12}]
  }],
  "structureSummary": "The item module owns reads and their store access.",
  "packages": [{
    "path": "src",
    "name": "Item module",
    "responsibility": "Receives item keys, reads storage, and returns values.",
    "sources": [{"file": "src/items.ts", "symbol": "readItem", "line": 12}]
  }],
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
    "branches": [{"condition": "The item is missing", "path": "Explain the inspected alternative and its outcome."}],
    "reading": [{
      "title": "Change item selection",
      "detail": "Start at the lookup in readItem.",
      "sources": [{"file": "src/items.ts", "symbol": "readItem", "line": 12}]
    }]
  }],
  "omitted": ["Paths intentionally left for a later walkthrough."]
}
```

Author `features`, `stack`, `structureSummary`, and `packages` for new project
guides. The builder also accepts older inputs without these fields and displays
uncovered sections; it does not infer missing content. Other top-level fields
above are required except `omitted`.

Each feature needs `title` and `description`; optional `scenario` is an existing
scenario ID, such as `read-item`, not a URL or hash. Each stack entry needs
`category`, `name`, `purpose`, and nonempty `sources`. Each package needs `path`,
`name`, `responsibility`, and nonempty `sources`. Package paths are
repository-relative locations, not invented component labels.

The builder derives the directory tree from these same `packages` entries:
`path` supplies the hierarchy and `name` supplies the short function label beside
each package. Shared parent directories group the paths without an inferred
description. Do not author a second tree or imply this is the full file inventory.

Each scenario needs the fields shown through `steps`, including nonempty
`mermaid`; `branches` and `reading` are optional. A branch has `condition` and
`path`; a reading suggestion has `title` and `detail`. Both may carry `sources`.
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

## Explain the product and packages

Keep the overview about what someone can do with the product. Capabilities can
link to their corresponding scenario; do not make the product explanation a
list of internal services. Separate languages and frameworks from databases,
queues, and other middleware, and say what each does here. Verify those roles
through current code, manifests, and configuration. An installed dependency
alone does not establish active use, deployment, or production readiness.

Use `structureSummary` for a short explanation of how the main boundaries fit
together. In `packages`, cover the major applications, services, shared
libraries, contracts, and tools relevant to this guide. Give each a concrete
responsibility and a place to start reading. Do not list every file, describe a
package only by repeating its name, or force a small script into a monorepo
shape. Record unexamined areas in `scope` or `omitted`.

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
- Keep one concise factual explanation per step. Put the operation first, its
  owner second, then its source symbols and paths. Do not repeat the scenario
  summary in the outcome or add generic instructions above every diagram.
- Reserve `branches` for actual conditions, alternatives, and timing; `condition`
  states when the path changes and `path` states the resulting behavior. Use
  `reading` for where to look next, modification hints, or source caveats. Keep
  necessary correctness distinctions with the operation they qualify.
- If a whole scenario is unresolved, omit it with the reason. Disclose partial
  coverage in `scope`/`omitted` instead of fabricating a complete flow.

## Build and inspect

Run `scripts/build-guide.mjs` with the JSON input and destination HTML path.
JSON is preparation material, not a second required reader file. Moving the HTML
must preserve its presentation. Optional source links still need network/access.

Open the result: Overview should open first, with clear routes to Code structure
and Scenarios. Test those links, direct scenario hashes, and browser back/forward.
All explanations and sources must remain available with JavaScript disabled;
printing must include all three pages. Check keyboard focus and narrow screens.
Verify that each diagram renders, with readable lifelines, calls, and
returns. Check the Fit to width / Actual size control; wide diagrams must scroll
within their container on small screens instead of overflowing the page.
Rendering errors must be visible and the Mermaid source inspectable; step cards
are not a fallback. Screenshots capture the actual file, not a separate mockup.

The builder checks input shape, diagram configuration restrictions, and escaping;
it does not validate the diagram's syntax or architectural correctness. Inspect
the browser render and verify the explanation against source.

## Migrate an older input

Version 0.3 inputs still build without the new overview and structure fields.
Their missing coverage is labeled rather than filled with guesses. To complete
the three-page guide, inspect source and author `features`, `stack`,
`structureSummary`, and `packages`. Move code-reading advice out of `branches`
into `reading`; keep actual alternatives and timing in `branches`.

Some 0.2 inputs omit `mermaid` because only step cards were displayed. To rebuild
them, inspect the source and add an authored `mermaid` string to every scenario.
The builder must reject a missing diagram instead of guessing one from steps.
Previously generated HTML files remain readable as they are.
