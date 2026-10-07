---
name: whywire
description: Create a concise, source-backed HTML guide to an unfamiliar project, organized by product use cases and their request flows. Use for project onboarding, understanding how a user action works across modules, and finding code entry points. Answer small follow-up questions briefly without rebuilding the guide.
license: MIT
---

# Whywire

**Follow the flow. Understand the why.**

Help someone new to the project understand what the product does, how its main
user scenarios work, and where to continue reading code. The main deliverable
for a project walkthrough is **one self-contained HTML guide**, not a long chat
response or separate source and preview documents. Honor an explicitly requested
format. A small question can stay a short answer; debugging is optional.

## Start with the product, then its scenarios

Read enough product documentation, UI routes, entry points, and implementation
to identify the audience, their actions, and the outcomes the product supports.
Treat documentation as a lead to verify, not proof of current implementation.
Name scenarios in the user's language: “Send a message and receive a reply”,
not “Frontend”, “API service”, or a directory name.

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
- What happens after the action in this scenario?
- Which module owns each step and how does the result reach the user?
- Which code should I read or change next?

Lead with a one-sentence product explanation. Give each scenario a short goal,
one compact flow, and brief step explanations with code entry points. Aim for
5–8 steps when sufficient; preserve a necessary boundary rather than meeting a
quota. Make each step an operation, not just a component name. Avoid repeating
the same explanation in an introduction, table, diagram, and conclusion.

Keep branches and longer source evidence expandable. Leave deployment commands,
recovery matrices, audit findings, and test inventories out unless requested or
necessary to explain the scenario. Deep source reading should produce a clear
guide, not a transcript of the investigation.

## Deliver one HTML

Read [references/guide.md](references/guide.md) and use the bundled template and
zero-dependency builder. Fill a temporary JSON input with the inspected product,
scenarios, flows, and sources. The helper renders **authored flow steps**; it
does not discover architecture, execute requests, or render Mermaid.

```sh
node /path/to/whywire/scripts/build-guide.mjs /path/to/input.json /path/to/whywire.html
```

Keep preparation files outside the repository unless the user asks to keep them.
Deliver the HTML as the single reading entry point. Its content, diagrams,
styles, and interactions must work offline with no sibling files or CDN. Keep
source paths and symbols readable even when a source URL cannot be opened.
Optional Mermaid source belongs inside a collapsed section of that same file;
use [references/diagrams.md](references/diagrams.md) only when useful.

If Node is unavailable, author the same standalone HTML directly using the
template's reading structure; do not install tooling just to force a preview.
If file output is unavailable, explain the limitation and give a compact inline
guide without claiming an HTML artifact exists.

Before delivery, check scenario coverage, supporting source for key steps,
input-to-result completeness, and local links or declared reference limitations.
Open the actual HTML when a browser is available: check scenario navigation,
expandable evidence, readable flow labels, and narrow-screen layout. If preview
is unavailable, report it. Do not treat render or packaging checks as validation
of the project's runtime behavior.

Finish with the product conclusion, the HTML link, and a short scope/verification
note. Do not paste the whole guide into chat. Generate screenshots when requested
or needed to demonstrate the output. Do not change project code or publish the
guide merely because the source was readable.
