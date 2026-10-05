# Validation record

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
| Local Markdown references | 40 inline file/line references resolved; installed skill references stayed inside its directory. | The checker does not prove a cited line supports a claim, or validate all Markdown syntax. |
| Packaged diagrams | Official CLI rendered all 8 Mermaid blocks in 6 Markdown files. | Syntax and renderability, not architectural truth. |
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
- Execution of the GitHub Actions workflow on GitHub, including its Linux
  browser environment. The workflow is supplied; local checks are the evidence.
- Other operating systems, agents, models, or real multi-repository systems.
- Better answer quality or fewer errors than a strong prompt without this skill.
- Safety or correctness of a proposed production fix. The examples explain
  bounded behaviors; they do not deploy a recovery protocol.

To repeat the qualitative check, start a fresh conversation with only the skill,
one `request.md`, and its `app.py`. Inspect the answer against the source and
actual run, then render its Mermaid independently. Keep failed trials in the
assessment rather than reporting only successful diagrams.
