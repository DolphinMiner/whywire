---
name: whywire
description: Create a concise, source-backed HTML guide to an unfamiliar project, organized by product use cases and their request flows. Use for project onboarding, understanding how a user action works across modules, and finding code entry points. Answer small follow-up questions briefly without rebuilding the guide.
license: MIT
---

# Whywire

**Follow the flow. Understand the why.**

Help someone new to the project understand what the product does, how its code
is organized, how its main user scenarios work, and where to continue reading.
The main deliverable
for a project walkthrough is **one self-contained HTML guide**, not a long chat
response or separate source and preview documents. Honor an explicitly requested
format. A small question can stay a short answer; debugging is optional.

## Understand the product and its code organization

Read enough product documentation, UI routes, entry points, and implementation
to identify the audience, their actions, and the outcomes the product supports.
Treat documentation as a lead to verify, not proof of current implementation.
Name scenarios in the user's language: “Send a message and receive a reply”,
not “Frontend”, “API service”, or a directory name.

For a whole-project guide, author three separate reading pages inside the same
HTML: **Overview → Code structure → Scenarios**. Overview explains the product,
its principal capabilities, and the languages, frameworks, middleware, and
storage actually used. Verify technology roles against manifests, imports,
configuration, and implementation; a dependency or directory name alone does
not prove how the product uses it or where it is deployed.

Code structure explains the major applications, services, shared libraries,
contracts, and tooling directories. Give each included package a concise
responsibility and inspected source entry points. The Code structure page first
shows a directory tree derived from the same package paths, with each package's
concise name beside it as a function label; detailed responsibilities follow.
Group shared parent directories without inventing roles for them. This tree
covers inspected package paths, not every repository file. State uncovered
packages or uncertain technology usage instead of guessing.

For a whole-project request, show the principal scenarios before following any
single one. Usually 3–5 explain a useful first slice; use the number the product
needs, and state what is outside this guide. Every included scenario needs its
own complete path. Do not present a list of capabilities and trace only one.
For a specific scenario request, go straight to that scenario without adding a
tour of the rest of the product.

## Trace each included scenario

Follow source from the user's action to the visible outcome:

```text
user goal → entry point → module actions and data → state changes → result returned or delivered
```

Read both ends of consequential handoffs. Explain what each component actually
does and what crosses its boundary. Link the important steps to inspected files
and symbols or verified lines. Preserve important alternatives, asynchronous
handoffs, and return paths; an arrow must not invent order or guarantee delivery.
Distinguish a saved request, completed execution, and a result visible to the user
when those are separate facts. Explain the normal path first.

Use [references/evidence.md](references/evidence.md) for source references and
uncertain claims. Source-backed behavior is not a runtime observation. State
the inspected revision and relevant dirty changes; never invent a deployment,
file, line, test result, author intent, or business capability. If a required
path cannot be traced, expose that specific gap instead of drawing through it.

## Edit for a first-time reader

Keep the visible guide focused on these questions:

- What is this product, who uses it, and what can they accomplish?
- What technologies and packages should I recognize before reading the code?
- What happens after the action in this scenario?
- Which module owns each step and how does the result reach the user?
- Which code should I read or change next?

Lead with a one-sentence product explanation. Give each scenario a short goal,
one Mermaid diagram, and brief step explanations with code entry points. Use a
`sequenceDiagram` for request flows: show the real participants, calls, returns,
and consequential branches or asynchronous handoffs. Choose another supported
Mermaid view only when it explains the question better. Aim for
5–8 steps when sufficient; preserve a necessary boundary rather than meeting a
quota. Make each step an operation, not just a component name. Avoid repeating
the same explanation in an introduction, table, diagram, and conclusion.

Give each text block one job: goal and outcome orient the reader; steps explain
operations; branches explain actual alternatives or timing; reading guidance
points to the next code entry. Keep source references attached to the claim
they support. Do not mix a reading suggestion or source caveat into a branch.
Keep branches and longer source evidence expandable. Leave deployment commands,
recovery matrices, audit findings, and test inventories out unless requested or
necessary to explain the scenario. Deep source reading should produce a clear
guide, not a transcript of the investigation.

## Deliver one HTML

Read [references/guide.md](references/guide.md) and use the bundled template and
Node standard-library builder. Fill a temporary JSON input with the inspected
product features, technology stack, package responsibilities, scenarios,
Mermaid, and sources. Every scenario requires an authored
`mermaid` field; follow [references/diagrams.md](references/diagrams.md). Read the
source to draw it. Do not derive a diagram from step titles: the `steps` field
supplies the folded explanation and evidence, not the participants or arrows.
The builder embeds the pinned Mermaid runtime once; the browser renders SVG.
It does not discover architecture or execute the project's requests.

```sh
node /path/to/whywire/scripts/build-guide.mjs /path/to/input.json /path/to/whywire.html
```

Keep preparation files outside the repository unless the user asks to keep them.
Deliver the HTML as the single reading entry point. Its content, diagrams,
styles, and interactions must work offline with no sibling files or CDN.
Diagrams require JavaScript in a compatible browser; text, source references,
and native disclosures remain readable without it. Keep the Mermaid source in
the same file. A rendering failure must be visible, with source available to
inspect; do not replace the diagram with a row of step cards.

If Node is unavailable, author the same standalone HTML using the bundled
template and embedded runtime; do not install tooling just to force a preview.
If file output is unavailable, explain the limitation and give a compact inline
guide without claiming an HTML artifact exists.

Before delivery, check product and package coverage, supporting sources for the
technology stack and key steps,
input-to-result completeness, and local links or declared reference limitations.
Open the actual HTML when a browser is available: check all three pages, direct
scenario links, browser back/forward navigation,
expandable evidence, actual SVG rendering, readable participants and arrows,
and narrow-screen diagram scrolling. If preview is unavailable, report it.
Do not treat render or packaging checks as validation
of the project's runtime behavior.

Finish with the product conclusion, the HTML link, and a short scope/verification
note. Do not paste the whole guide into chat. Generate screenshots when requested
or needed to demonstrate the output. Do not change project code or publish the
guide merely because the source was readable.
