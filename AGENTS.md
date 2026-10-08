# Working on Whywire

Whywire is a skill for understanding a product through its user scenarios and
source-backed request flows, with debugging as one optional use. Saved guides
default to one offline `whywire.html`; short questions may stay in chat, and the
user's requested format takes precedence.
The canonical skill is `skills/whywire/SKILL.md`. Its bundled HTML builder and
template ship with the skill; examples and repository tooling are development
material.

- Read the skill and the example relevant to a change before editing.
- Preserve the user's question. Architecture explanations need not become audits.
- Lead with the product, then its principal scenarios, a Mermaid diagram for
  every included scenario, and source entry points. Keep visible prose brief;
  put supporting detail in expandable sections and state uncovered scope.
- Keep source observations, runtime observations, inference, proposals, and unknowns
  separate. Do not invent benchmark numbers, production incidents, or compatibility.
- A reference used by the skill must ship inside its directory.
- Reuse the bundled builder and template before adding dependencies or renderers.
  The builder uses the Node standard library and embeds the vendored Mermaid
  12.1.0 runtime once. Keep producing one offline page with no CDN or sibling
  assets. Preserve Mermaid's bundled license when updating its runtime.
- Require authored `mermaid` in each scenario. Prefer sequence diagrams with
  real participants, calls, returns, and relevant branches or async handoffs;
  never derive a step-card substitute from `steps`. Template-owned strict
  security settings cannot be overridden by input directives or frontmatter.
- Text, source references, and native disclosures must remain readable without
  JavaScript. Diagram rendering errors must be visible with source available.
- Run `npm run check` for changes to examples, Mermaid, or packaging. Run
  `npm run check:guide` for HTML generation changes and `npm run check:install`
  when changing discovery, metadata, or installed resources.
- Keep temporary renderings, session logs, local installations, and private inputs
  out of version control. The README demonstration images in `docs/previews/`
  are intentional documentation assets; regenerate them with `npm run previews`.
  The public `examples/cache-read/guide.html` is also an intentional demo artifact;
  rebuild it from its JSON input with `npm run demo:guide`.
  `docs/cover.svg` is an editable authored source asset.
- Do not publish, add a remote, or change global agent settings without a request.
