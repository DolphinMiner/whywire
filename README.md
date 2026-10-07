<p align="center">
  <img src="docs/cover.svg" alt="Whywire — Follow the flow. Understand the why." width="100%">
</p>

<p align="center">
  <strong>Understand a product. Follow its requests. Find the code.</strong><br>
  An Agent Skill that turns source code into one readable HTML architecture guide.
</p>

<p align="center">
  English · <a href="README.zh-CN.md">简体中文</a> · <a href="https://github.com/DolphinMiner/whywire">GitHub</a> · <a href="https://github.com/DolphinMiner/whywire/actions/workflows/check.yml">Checks</a> · <a href="LICENSE">MIT</a>
</p>

New to a repository? Whywire starts with **what the product does and how people
use it**, then traces each included scenario from the user's action to the result.
You get **one `whywire.html`** with diagrams, brief explanations, and source entry
points. Open it in a browser and keep reading the code from there.

The guide contains its own diagrams and styles, so it can be read offline.
Source links still need access to the repository they refer to. The chat reply
stays short: a summary, the HTML link, and the scope covered.

## See the output

![Whywire HTML guide: a product summary, a scenario, a request flow, and code entry points.](docs/previews/guide.png)

Download the [HTML demo](examples/cache-read/guide.html) and open it in your
browser. It follows two reads of the same item: the first fills the cache; the
second returns the cached value without reading the origin again.

This is a **synthetic cache-read teaching case**, showing first and repeat reads with in-process Python
objects. It demonstrates the output format, not a real product or a model
benchmark. Inspect the [source](examples/cache-read/app.py),
[runnable assertions](examples/cache-read/app.py#L37-L41), and
[guide input](examples/cache-read/guide.json). The screenshot is captured from
that HTML, not a mock interface.

## Ask from the user's point of view

```text
Use $whywire to help a newcomer understand this repository.
Explain what the product does, identify its main user scenarios, and trace
the request flow for each included scenario. Save one whywire.html with
diagrams and code entry points. State what is outside the walkthrough.
```

Or stay focused:

```text
Use $whywire to explain what happens after a user clicks Send.
Follow the request through to the visible reply and show where to read the code.
```

A guide follows this reading order:

| Read | Learn |
| --- | --- |
| Product | Who it serves, what users do, and what they get. |
| Scenarios | The principal user actions found in the inspected product and code. |
| Request flow | What starts each scenario, which modules handle it, how data changes, and how the result returns. |
| Code entry points | The relevant files and functions beside the steps they explain. |

Each scenario gets one compact flow and short explanations. Supporting evidence,
diagram source, and deeper details stay available without dominating the first
read. Relevant branches remain visible; an unexplored scenario is labeled rather
than silently treated as covered.

Small questions can stay in chat. An explicitly requested format takes precedence.
Debugging and change comparisons are also supported, but understanding a project
does not require a bug. Source inspection is labeled separately from a path that
was actually run.

## Install

Use an agent that supports Agent Skills and can read the project source.
The bundled HTML builder needs **Node.js 18+**, with no npm dependencies. The
`npx` installer below needs **Node.js 22.20+ and npm**; manually copying the skill
does not need npm. Python is only used by repository maintainer checks.

Run this from the project whose source you want to understand:

```sh
cd /path/to/your-project
npx --yes skills@1.7.0 add DolphinMiner/whywire --skill whywire --agent codex --copy
```

For Claude Code, replace `--agent codex` with `--agent claude-code`.
These are project-scoped installs. Restart or reload your agent session if it
does not discover the new skill immediately.

For a local checkout, replace `DolphinMiner/whywire` with its absolute path, such
as `/path/to/whywire`. To install manually, copy the **entire** `skills/whywire/`
directory into your agent's skill location, including `assets/`, `scripts/`,
`references/`, `agents/`, and `LICENSE`. See the
[validation record](docs/validation.md) for the actual checks; an installation
check does not prove every host's native discovery or model behavior.

## Examples and source evidence

| Case | What you can inspect |
| --- | --- |
| [Two reads, one origin access](examples/cache-read/guide.html) | The HTML guide, backed by a runnable cache-aside example. |
| [A late result writes past deletion](examples/late-result/explanation.md) | Analysis of deletion, stale work, and the write boundary. |
| [The database record cannot prove delivery](examples/delivery-handoff/explanation.md) | Analysis of a SQLite reopen, a modeled broker, and an ambiguous acknowledgement. |

All three are synthetic teaching cases. Their `request.md`, `app.py`, and
`explanation.md` files preserve the question, runnable source, and worked analysis.
The older Markdown explanations are reference material; the HTML guide is the
primary saved output. To evaluate the method, give the agent the request and
source before showing it the worked answer.

## What is in this repository?

```text
skills/whywire/             The complete installable skill
  SKILL.md                 Workflow and output contract
  scripts/build-guide.mjs  Standalone HTML builder; Node standard library only
  assets/guide.html        Embedded page template
  references/              Evidence, diagram, and guide-writing guidance
  agents/openai.yaml       Display and invocation metadata
  LICENSE                  License travels with copied installations
examples/                  Shareable cases, source, and the HTML demo
scripts/                   Maintainer checks and preview generation
docs/                      Cover, screenshots, and validation record
.github/                   CI and contribution templates
```

Only `skills/whywire/` is installed. The agent reads and explains the source;
the small builder packages that explanation as an offline page. There is no
hosted service or automatic repository indexer.

## Develop and contribute

```sh
npm ci
npm run check
npm run check:guide
npm run check:install
npm run demo:guide
```

The checks cover runnable examples, local references, Mermaid rendering, HTML
generation, and copied installations. `demo:guide` rebuilds the public HTML
example. See [CONTRIBUTING.md](CONTRIBUTING.md) for prerequisites and preview
generation. These checks verify the artifacts and tooling, not model quality.

A useful contribution is a shareable scenario that the guide explains badly.
Provide the smallest relevant source and show the outcome. Keep private code,
logs, and credentials out of public reports.

## Inspiration and license

The packaging was informed by
[answer-me-with-html](https://github.com/QingYunA/answer-me-with-html),
[Archify](https://github.com/tt-a1i/archify),
[Karpathy Skills](https://github.com/multica-ai/andrej-karpathy-skills), and
[Ponytail](https://github.com/DietrichGebert/ponytail).
These are inspirations, not affiliations or endorsements.

[MIT licensed](LICENSE). Whywire is pronounced “why-wire”: a wire you can follow
to understand why something happens.
