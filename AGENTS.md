# Working on Whywire

Whywire is a small instruction-based skill for understanding architecture through
source-backed scenario walkthroughs, with debugging as one optional use.
The canonical skill is `skills/whywire/SKILL.md`; examples and repository tooling
are development material, not runtime requirements.

- Read the skill and the example relevant to a change before editing.
- Preserve the user's question. Architecture explanations need not become audits.
- Keep source observations, runtime observations, inference, proposals, and unknowns
  separate. Do not invent benchmark numbers, production incidents, or compatibility.
- A reference used by the skill must ship inside its directory.
- Follow existing methods before adding dependencies or a renderer.
- Run `npm run check` for changes to examples, Mermaid, or packaging. Run
  `npm run check:install` when changing discovery, metadata, or installed resources.
- Keep temporary renderings, session logs, local installations, and private inputs
  out of version control. The README demonstration images in `docs/previews/`
  are intentional documentation assets; regenerate them with `npm run previews`.
  `docs/cover.svg` is an editable authored source asset.
- Do not publish, add a remote, or change global agent settings without a request.
