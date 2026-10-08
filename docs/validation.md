# Validation record

## Three-page guide and readable evidence — 2026-10-08

Version 0.4.0 keeps one offline HTML and adds three hash-navigable reading pages:
product overview, code structure, and request scenarios. Overview includes
source-backed features and technology roles; structure explains inspected
packages and their entry points. Existing 0.3 inputs still build, with an honest
uncovered state for missing new content rather than inferred facts.

Scenario prose now separates actor, trigger and outcome; numbered steps group
the operation, responsible module, explanation and symbol-first source entries.
Branches pair a condition with its handling. Reading advice has its own section.
All authored Mermaid diagrams and their offline runtime remain intact.

`npm run check` passed 54 local file/line links, input and escaping checks,
three executable fixtures, actual browser rendering, and six Mermaid diagrams
across four Markdown files. New browser regressions verify the default page,
page and feature links, direct hashes, browser history, reload, diagram sizing,
all-page print visibility, disclosure restoration, and full reading without
JavaScript. Legacy inputs and invalid new fields are checked at the builder
boundary. `npm run check:install` copied all ten skill files byte-for-byte for
Codex and Claude Code and ran each installed builder successfully.

The private trial was adapted from its previous source-backed guide. Its five
features, nine technology entries and 21 directory descriptions cover every
actual application and shared package in that checkout. Five Mermaid strings
and all 68 original step references were preserved; reading and branch notes
were shortened and separated. This is not a new blind quality evaluation or a
live product test. Private inputs and screenshots remain outside the repository.

The actual guide's overview, structure and scenario pages were inspected at
1280px and 390px; the restored 333px user viewport also had no page overflow.
Expanded step, branch and reading sections were checked. All five diagrams
rendered and browser logs showed no warnings/errors. Print CSS and restoration
were exercised in the automated browser; PDF appearance was not visually
validated. The three README screenshots come from the committed public HTML.

## Mermaid swimlane restoration — 2026-10-08

Version 0.3.0 replaces the HTML step-map with real Mermaid diagrams. Each
scenario requires authored Mermaid source; request walkthroughs use sequence
lifelines, calls, returns, and relevant parallel or conditional paths. Step
explanations and source locators remain folded below the diagram.

The installed skill contains the exact Mermaid 12.1.0 browser bundle and its
upstream license. The generated HTML embeds both and needs no CDN or sibling
files. This adds about 5.5 MB per guide. The Node builder still needs no npm
installation; diagram rendering requires a browser with JavaScript enabled.
Native disclosures, step explanations, and Mermaid source remain available
without JavaScript. Older input JSON needs an authored `mermaid` field for each
scenario; previously generated HTML remains readable.

The repository checks now render the actual standalone HTML in an isolated
browser with HTTP requests blocked. They cover sequence diagrams in initially
open and closed scenarios, flowcharts, state diagrams, a malformed diagram
beside a valid one, hostile HTML labels, and visible no-script fallback. No HTTP
requests were observed. Input checks reject missing diagrams, oversized source,
configuration directives, and frontmatter; upstream bundle and license bytes
are compared with the lockfile-pinned package. Copied installations for Codex
and Claude Code include all ten files and reproduce the complete HTML.

The existing private-project trial was updated from source, rather than counted
as a new independent skill-quality evaluation. Five authored sequence diagrams
use four to six lanes and 13–18 key arrows each. All five rendered with the CLI
and inside the generated HTML; 68 source references were checked. One Dashboard
event description was made more precise while tracing the callers. Main paths
were shortened after the first draft; detailed recovery remains in the folded
explanations. This remains source analysis, not application runtime validation.

The actual guide was inspected at 1280px, 591px, and 390px. Scenario navigation,
fit/actual size, horizontal scrolling, source/error disclosure, and page
overflow were checked. Screenshots and private inputs remain outside the
repository. Print state handling was reviewed in code; PDF appearance was not
visually validated. The README preview was regenerated from the public HTML.

## Standalone HTML guide update — 2026-10-07

Version 0.2.0 changes the saved walkthrough to one offline HTML guide. Product
orientation and scenario flows are visible; step explanations, code locators,
branches, and scope details expand on demand. The small Node builder formats an
agent-authored input; it does not analyze repositories or verify architecture.

The public demo is generated from the synthetic cache fixture. The README image
is a screenshot of that same HTML, regenerated with `npm run previews`.

Local checks cover deterministic output, escaping hostile text, rejecting unsafe
source URLs and nonportable paths, valid scenario/source metadata, complete
no-script content, and preserving an existing output after invalid input. A
copied-install test exposed a CLI entry-point bug when macOS resolved a temporary
path through an alias. Comparing real paths fixed it; a symlink-path regression
now covers that boundary. Codex and Claude Code temporary installs contain all
eight skill files and execute the installed builder to reproduce the demo.
The final local run passed `npm run check` (45 local references, the HTML
checks, all three executable fixtures, and six Mermaid diagrams across four
Markdown files), `npm run check:install`, skill metadata validation, and
`git diff --check`.

A fresh agent tested the revised skill against a private application, without
prior walkthroughs or an expected answer. It produced five scenarios, 31 steps,
and 61 source locators across 48 files. Every referenced path, symbol, and supplied
line was checked. Source review then corrected two explanations: a plausible
event endpoint was not the current caller's transport, and a caller-side filter
disabled one search source. The evidence instructions now explicitly require
following active wiring and caller conditions. A second reviewer spot-checked
the corrected paths; this is not an exhaustive source audit.

The actual generated guide was inspected in a browser at 1280px and 390px.
Scenario navigation, selected state, keyboard expansion of code details, and
horizontal overflow were checked; screenshots were saved locally. The first
layout pass moved product orientation ahead of navigation on mobile and folded
metadata to expose the request path sooner. Browser logs showed no warnings or
errors during these interactions. Printing was inspected in code, not through a
PDF export. Complete static content was checked without the script; a browser
session with JavaScript disabled was not exercised.

Private inputs, guide contents, and screenshots remain outside this repository.
The application was not started and no provider calls or production behavior
were tested. This is one qualitative trial, with corrections retained in the
record; it does not establish comparative model quality or automatic triggering.

## Public release checks — 2026-10-07

The public repository is [DolphinMiner/whywire](https://github.com/DolphinMiner/whywire).
The official `skills` CLI 1.7.0 discovered exactly one skill from that GitHub
source. Copied installations for Codex and Claude Code each contained all five
canonical files, byte-for-byte, with no symlinks. These checks used temporary
projects and state/cache directories, with Git credential helpers disabled and
GitHub token environment variables removed. Temporary output was removed.

[GitHub Actions passed](https://github.com/DolphinMiner/whywire/actions/runs/37640502979)
on Ubuntu 24.04 with Node.js 22 and Python 3.13: dependency installation,
`npm run check`, and `npm run check:install`. The first cloud run failed because
Puppeteer's downloaded browser lacked a usable sandbox under the runner's
AppArmor restrictions. The workflow now uses the runner's preinstalled Google
Chrome with its sandbox enabled and skips the extra browser download.

The public README, cover, two example previews, installation commands, and
repository topics were checked on GitHub. This establishes public distribution
and the Linux maintainer checks; native host triggering and model quality
remain separate questions.

## Scenario walkthrough update — 2026-10-07

Architecture and onboarding now default to a normal scenario walkthrough. Both
READMEs lead with the cache-read flow; debugging remains an optional use. The
cache preview was regenerated from its explanation, diagram, and actual run.

A fresh agent received only the revised skill, the cache-read request, and its
Python source. The answer traced the entry point, calls, data, component roles,
and both return paths without inventing services or proposing an unrequested fix.
It ran the example and its assertions, and its Mermaid rendered successfully
with the official CLI. This is one qualitative trial on a synthetic fixture.

Repository checks passed again: 48 local references, all three example checks,
8 diagrams in 6 Markdown files, copied installations for Codex and Claude Code,
and skill metadata validation. The updated preview was visually inspected.

## Initial version — 2026-10-05

Local first-version checks, 2026-10-05. These are packaging, example, rendering,
and qualitative first-use checks. They are not a model-quality benchmark or
production validation.

## Environment and scope

- macOS, Node.js 23.11.0, Python 3.12.6 for repository checks.
- Official Mermaid CLI 12.0.0, using an existing Google Chrome through
  `PUPPETEER_EXECUTABLE_PATH`. Downloading Puppeteer's browser was skipped locally.
- Official `skills` CLI 1.7.0, pinned in development dependencies and the lockfile.
- The upstream skill-creator `quick_validate.py` also passed, using the system
  Python 3.9.6 with its existing PyYAML. This is metadata validation only.

## Completed checks

| Check | Observed result | Limit |
| --- | --- | --- |
| Dependency installation | Final lockfile installation completed with `npm ci`, followed by both repository checks. | Browser download was skipped in favor of installed Chrome. |
| Three `app.py --check` programs | All passed at their caller-visible boundaries. | Synthetic fixtures, not live services or exhaustive concurrency tests. |
| Local Markdown references | 48 inline file/line references resolved after adding README previews; installed skill references stayed inside its directory. | The checker does not prove a cited line supports a claim, or validate all Markdown syntax. |
| Packaged diagrams | Official CLI rendered all 8 Mermaid blocks in 6 Markdown files. | Syntax and renderability, not architectural truth. |
| README previews | Two PNGs regenerated from the cache and late-result explanations, their Mermaid, and actual example stdout; visually inspected for clipping and legibility. | Documentation layout, not a native agent-app screenshot or a fixed output theme. |
| Installed license | Root and installed MIT license files matched exactly. | No claim about trademark availability. |
| Official skill discovery | Found one skill, `whywire`. | CLI discovery, not native host loading. |
| Codex copied installation | All 5 files matched byte-for-byte, with no symlinks. | Temporary project installation only. |
| Claude Code copied installation | All 5 files matched byte-for-byte, with no symlinks. | Temporary project installation only. |

The installer smoke test creates separate temporary projects and temporary
state/cache locations. It uses no global flag, preserves `HOME` and `CODEX_HOME`,
and removes its temporary output. Its final form invokes the locally installed
official CLI, so it does not download the installer for every check.

## First-use trials and an actual correction

Fresh agent contexts received the skill, one raw request, and the corresponding
Python source. They were allowed to run that source. The worked explanations,
other examples, and previous outputs were withheld.

1. **Cache read:** the response explained the shared cache and early-return
   branch, cited source, and reported the two values and one origin read it
   actually observed. Its diagram rendered successfully.
2. **Delivery handoff, initial trial:** the response distinguished the durable
   row, observer-only broker acceptance, and recovery's missing evidence. Its
   diagram failed Mermaid parsing because literal semicolons in message text
   were treated as statement separators.
3. **Correction and fresh-context rerun:** the bundled diagram guide gained a
   short rule to avoid that punctuation in sequence messages and notes. A new
   context repeated the delivery task without seeing the prior response or
   expected explanation. It retained the important evidence distinctions, and
   its diagram rendered successfully. The final two rendered trial diagrams
   and the authored cover were visually inspected.

This records one useful correction, not a guaranteed syntax fix for every
model. There was no controlled no-skill baseline, repeated sampling, blind
human scoring, or statistical evaluation. Trial renderings and session outputs
are development artifacts and are not part of the installed skill.

## Not yet established

- Native automatic triggering and discovery in a fresh Codex or Claude Code
  application session. Reading a skill in an agent trial is a different check.
- Operating systems beyond the macOS checks and Ubuntu CI described above,
  additional agents or models, or real multi-repository systems.
- Better answer quality or fewer errors than a strong prompt without this skill.
- Safety or correctness of a proposed production fix. The examples explain
  bounded behaviors; they do not deploy a recovery protocol.

To repeat the qualitative check, start a fresh conversation with only the skill,
one `request.md`, and its `app.py`. Inspect the answer against the source and
actual run, then render its Mermaid independently. Keep failed trials in the
assessment rather than reporting only successful diagrams.
