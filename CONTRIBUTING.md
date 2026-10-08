# Contributing to Whywire

The most useful contribution is a question the skill explains badly, together
with the smallest shareable source that makes the answer checkable.

## Change the method through examples

1. Explain the reader's question and the current failure.
2. Add or update a small example with an observable outcome.
3. Change only the instructions that improve that case without distorting others.
4. Run the repository checks and inspect the resulting HTML in a browser.

For a project guide, verify that a newcomer can explain what the product does,
follow every included scenario to its outcome, and find the relevant code.
Keep the visible explanation brief; preserve evidence and deeper details in
expandable sections. Author a Mermaid diagram for each scenario from inspected
source; request flows should show participants, calls, returns, and relevant
conditions or async handoffs. Do not turn `steps` into a substitute diagram.
A one-scenario fixture does not establish coverage of a whole product.

Keep private repositories, logs, credentials, and customer material out of issues
and fixtures. Synthetic teaching examples are welcome; label them as such.
Record actual observations separately from expected answers.

## Local checks

The installed HTML builder uses Node.js 18+ and only the standard library. It
embeds `assets/mermaid.min.js` (Mermaid 12.1.0) in every generated HTML, once per
file. Preserve the upstream bundle and `assets/mermaid-LICENSE.txt` together;
readers do not install packages or fetch a CDN runtime.
Maintainer checks use Node.js 22.20+, Python 3.10+, and the official Mermaid CLI:

```sh
npm ci
npm run check
npm run check:guide
```

`check` runs the HTML builder checks, example assertions, local Markdown link
checks, and renders every Mermaid block with the official CLI. `check:guide`
runs only the HTML builder checks. Temporary renderings stay in a temporary
directory. If a browser is already available, set `PUPPETEER_EXECUTABLE_PATH`;
otherwise Puppeteer installs its development browser during `npm ci`.

GitHub Actions uses the Ubuntu 24.04 runner's preinstalled Google Chrome with
its sandbox enabled and skips Puppeteer's separate browser download.

To rebuild the public HTML example after changing its input or the builder:

```sh
npm run demo:guide
```

This uses `examples/cache-read/guide.json` to generate
`examples/cache-read/guide.html`. Open it locally and check the narrow viewport,
scenario navigation, expandable details, and source references. Confirm that
both sequence diagrams render offline, their calls and returns remain legible,
and Fit to width / Actual size works without page overflow at a narrow viewport.
Check that a render failure displays an error and opens its source. With JavaScript
disabled, text, references, and native disclosures must remain readable.
Only the HTML is required for reading; the JSON is an editable authoring input.

To refresh the checked-in README screenshot and reference previews:

```sh
npm run previews
```

The primary screenshot, `docs/previews/guide.png`, must show the actual generated
HTML. Older reference previews render existing Mermaid with the official CLI,
run the pictured examples, and show their observed output in a documentation
layout. Inspect the changed PNGs in `docs/previews/` before committing. Label
teaching fixtures honestly; do not use private project content in public images.

For an isolated installer smoke test using the official CLI pinned in the
development dependencies (no installer download after `npm ci`):

```sh
npm run check:install
```

This tests copied, project-scoped installations in temporary directories. It does
not install the skill into your global agent configuration.

## Review expectations

- Keep the installed skill self-contained under `skills/whywire/`.
- Keep one standalone HTML file as the default saved guide. Do not introduce a
  second main reading copy or require a hosted service, CDN, or npm install to
  run the bundled builder.
- Keep Mermaid configuration in the template with strict security settings;
  reject input directives and frontmatter. Require nonempty authored `mermaid`
  for each scenario and retain the source in the generated HTML.
- Preserve the distinction between observed, source-backed, inferred, proposed,
  and unknown behavior.
- Do not add a queue, recovery protocol, or new abstraction to every explanation.
- Keep English and Chinese READMEs consistent about scope and support.
- Prefer one focused change and explain how you checked its effect.
- Do not claim that rendering or fixture tests prove model quality.

Before publishing a release, run all three checks, try a fresh conversation against a
case whose expected answer is withheld, and update [validation](docs/validation.md)
with what actually happened. Tag a version only after those checks; a local folder
or successful install is not a published release.
