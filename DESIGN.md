---
name: Whywire guide
description: A restrained, source-backed reading guide through a codebase.
colors:
  paper: "#f7f4ec"
  white: "#fffefa"
  ink: "#152725"
  muted: "#53635d"
  line: "#d8ddd6"
  accent: "#a65119"
  soft: "#f4e5d4"
typography:
  display:
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif'
    fontSize: "clamp(1.9rem, 3.1vw, 2.65rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-.035em"
  headline:
    fontSize: "1.3rem"
    fontWeight: 700
    lineHeight: 1.35
    letterSpacing: "-.02em"
  body:
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif'
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
  code:
    fontFamily: 'ui-monospace, SFMono-Regular, Consolas, "Liberation Mono", monospace'
    fontSize: ".9em"
    lineHeight: 1.5
rounded:
  compact: "5px"
  scenario: "10px"
  number: "50%"
spacing:
  compact: ".8rem"
  normal: "1rem"
  section: "1.5rem"
  columns: "3rem"
components:
  print-button:
    backgroundColor: "transparent"
    textColor: "{colors.paper}"
    rounded: "{rounded.compact}"
    padding: ".35rem .7rem"
  scenario-navigation:
    rounded: "{rounded.compact}"
    padding: ".7rem .8rem"
  scenario-navigation-current:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  scenario:
    backgroundColor: "{colors.white}"
    rounded: "{rounded.scenario}"
  diagram-viewport:
    backgroundColor: "{colors.white}"
    rounded: "{rounded.compact}"
    padding: ".5rem"
  evidence-disclosure:
    padding: ".8rem 0"
---

# Design System: Whywire guide

## Overview

This documents the standalone HTML reading guide implemented in
`skills/whywire/assets/guide.html` and its bundled builder. Preserve the Whywire
name and restrained dark green/orange identity established by `PRODUCT.md`.
Warm paper, a dark masthead, and quiet bordered sections support reading.

## Colors

**Primary:** `accent` marks evidence numbers, symbols, link hover, and keyboard
focus. `soft` supports the numbered evidence trail.

**Neutral:** `ink` is the body text, masthead, and current navigation background;
`paper` is the page and participant surface; `white` separates scenario sections
and diagram viewports. Diagram signals use `ink`.
`muted` carries secondary explanations; `line` divides evidence and containers.

## Typography

Use the system sans-serif stack for prose and the system monospace stack for
source paths and code. Present a source's function or symbol before its quieter
path, so the reader can choose an entry point before parsing a long filename.
Mermaid uses Arial with a sans-serif fallback. All work
offline without font downloads. The display role titles the guide; the headline
role names scenarios. Mermaid participant and message labels remain readable
at their rendered size. Introduction and summary lines stay within 65ch;
detailed explanations stay within 70ch.

## Layout

Use a stable desktop navigation rail and one flexible reading panel. Its primary
links are Overview, Code structure, and Scenarios, with scenario links grouped
beneath Scenarios. The default panel is Overview. Each page and scenario has an
ordinary hash link; navigation and browser history determine the visible panel.
Keep product introduction and stack on Overview, package responsibilities on
Code structure, and request diagrams with their explanations on Scenarios.

On narrow screens, navigation returns to the document flow, labels wrap, and
metadata stacks. Text and source paths must wrap without causing page overflow;
only a diagram viewport may need horizontal scrolling.

**The Readable Path Rule.** Each scenario renders its authored Mermaid as SVG,
normally a sequence diagram with participant lifelines, calls, and returns.
The desktop view shrinks wide diagrams to fit the reading column without
enlarging smaller diagrams; an Actual size control preserves the SVG's original
width. Screens at 600px or below start at actual size and scroll inside their
own viewport. Preserve the diagram's layout rather than converting it to a
vertical list of steps. Keep labels concise and source paths wrappable.

## Elevation & Depth

The template has no shadows, gradients, or animated transitions. Paper and
near-white surfaces, thin borders, and the dark current-navigation state provide
separation. Keep this flat reading treatment when extending the guide.

## Shapes

Scenario containers use the larger radius; controls, navigation, diagram viewports,
and code blocks use the compact radius. Step explanations use numbered rows
without connecting arrows: the Mermaid diagram owns call and timing semantics.
Containers and separators use 1px borders.

## Components

- **Print button:** a small outlined control in the masthead. Its hover surface
  becomes lighter green. It appears when JavaScript is available; printing
  expands disclosures and restores their prior states afterward.
- **Guide navigation:** stable Overview, Code structure, and Scenarios anchor
  links, with indented scenario choices and a clear current state. Selecting a
  scenario reveals the Scenarios page, opens it, and closes the other scenarios.
  On small screens the links wrap in the normal document flow.
- **Overview:** a product introduction followed by capabilities and technology
  roles. Features may link to their relevant scenario. Keep source evidence
  attached to stack claims, and label unexamined content honestly.
- **Code structure:** a short orientation followed by a familiar directory tree
  and detailed package responsibilities with source entry points. Derive the tree
  from the same package paths, group shared parents, and place each package's
  concise function label beside its path. Use monospace paths and branch marks
  with readable, wrapping annotations. State that the tree covers inspected
  paths; do not imply it is a complete file inventory or invent parent roles.
- **Scenario disclosure:** a native `details` section with a title, short summary,
  step count, and plus/minus indicator. The first scenario starts open within
  its page. Its body states the outcome and leads directly into the diagram;
  avoid repeating explanatory headings and generic instructions.
- **Flow diagram:** the scenario's required Mermaid source renders as SVG using
  the pinned runtime embedded in the HTML. Fit to width / Actual size controls
  preserve legibility across viewports. The source remains in a folded disclosure;
  rendering errors are visible and reveal that source.
- **Evidence disclosure:** native `details` contains step explanations and code
  entry points. Each numbered row groups an operation, responsible component,
  concise explanation, and symbol-first source references.
- **Branches and reading:** actual alternatives and timing use condition/result
  rows in their own folded section, with distinct columns on wide screens and
  stacked labels on narrow screens. Code-reading suggestions and source caveats
  have a separate section; they do not masquerade as branches. Source paths and
  symbols remain readable offline, whether or not a web URL is available.

All interactive elements retain a visible accent focus outline (3px with a 4px
offset). Preserve native keyboard behavior and the focus-revealed skip link.
Print hides navigation and controls, exposes all three pages and disclosures,
then restores the prior reading state. Diagrams require JavaScript; without it,
all pages' text, source references, and native disclosures remain in the document.

## Do's and Don'ts

- **Do** preserve the masthead identity, restrained palette, and clear reading
  hierarchy when adding content.
- **Do** keep evidence available behind native disclosures and preserve readable
  source references without requiring a connection.
- **Do** state the inspected scope and distinguish a source-based diagram from
  a recorded runtime trace.
- **Don't** turn this guide into a dashboard or an architecture editing surface.
- **Don't** introduce remote fonts, icon bundles, or a CDN dependency. The
  Mermaid runtime is embedded once in the single offline HTML file.
