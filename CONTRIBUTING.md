# Contributing to Whywire

The most useful contribution is a question the skill explains badly, together
with the smallest shareable source that makes the answer checkable.

## Change the method through examples

1. Explain the reader's question and the current failure.
2. Add or update a small example with an observable outcome.
3. Change only the instructions that improve that case without distorting others.
4. Run the repository checks and inspect the rendered diagram.

Keep private repositories, logs, credentials, and customer material out of issues
and fixtures. Synthetic teaching examples are welcome; label them as such.
Record actual observations separately from expected answers.

## Local checks

Using the skill itself requires no Node or Python installation. Maintainer checks
use Node.js 22.20+, Python 3.10+, and the official Mermaid CLI:

```sh
npm ci
npm run check
```

The check runs the example assertions, checks local Markdown links, and renders
every Mermaid block with the official CLI. Rendered files stay in a temporary
directory. If a browser is already available, set `PUPPETEER_EXECUTABLE_PATH`;
otherwise Puppeteer installs its development browser during `npm ci`.

To refresh the checked-in README previews after changing their examples:

```sh
npm run previews
```

This renders the existing Mermaid with the official CLI, runs each pictured
example, and captures its diagram, explanation, and observed output in a
documentation layout. Inspect both PNGs in `docs/previews/` before committing.
They are worked-example previews, not screenshots of a particular agent app.

For an isolated installer smoke test using the official CLI pinned in the
development dependencies (no installer download after `npm ci`):

```sh
npm run check:install
```

This tests copied, project-scoped installations in temporary directories. It does
not install the skill into your global agent configuration.

## Review expectations

- Keep the installed skill self-contained under `skills/whywire/`.
- Preserve the distinction between observed, source-backed, inferred, proposed,
  and unknown behavior.
- Do not add a queue, recovery protocol, or new abstraction to every explanation.
- Keep English and Chinese READMEs consistent about scope and support.
- Prefer one focused change and explain how you checked its effect.
- Do not claim that rendering or fixture tests prove model quality.

Before publishing a release, run both checks, try a fresh conversation against a
case whose expected answer is withheld, and update [validation](docs/validation.md)
with what actually happened. Tag a version only after those checks; a local folder
or successful install is not a published release.
