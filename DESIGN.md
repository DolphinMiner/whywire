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
source paths and code. Mermaid uses Arial with a sans-serif fallback. All work
offline without font downloads. The display role titles the guide; the headline
role names scenarios. Mermaid participant and message labels remain readable
at their rendered size. Introduction and summary lines stay within 65ch;
detailed explanations stay within 70ch.

## Layout

The desktop page has a 1290px maximum width, a 235px sticky scenario rail, and a
flexible reading column. At 800px and below, the rail becomes wrapping navigation
below the introduction. At 520px and below, page padding narrows, scenario
metadata stacks, and secondary masthead text and step counts are hidden.

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
and code blocks use the compact radius. Expanded evidence has circular numbered
markers connected by thin arrows. Containers and separators use 1px borders.

## Components

- **Print button:** a small outlined control in the masthead. Its hover surface
  becomes lighter green. It appears when JavaScript is available; printing
  expands disclosures and restores their prior states afterward.
- **Scenario navigation:** ordinary anchor links with a filled current state.
  Selecting a scenario opens it and closes other scenarios. On small screens,
  links wrap and gain borders; they remain navigation links.
- **Scenario disclosure:** a native `details` section with a title, short summary,
  step count, and plus/minus indicator. The first scenario starts open. Its
  visible body leads with the outcome and diagram.
- **Flow diagram:** the scenario's required Mermaid source renders as SVG using
  the pinned runtime embedded in the HTML. Fit to width / Actual size controls
  preserve legibility across viewports. The source remains in a folded disclosure;
  rendering errors are visible and reveal that source.
- **Evidence disclosure:** native `details` contains step explanations and code
  entry points; branches and timing use a separate folded section. Source paths
  and symbols remain readable offline, whether or not a web URL is available.

All interactive elements retain a visible accent focus outline (3px with a 4px
offset). Preserve native keyboard behavior and the focus-revealed skip link.
Print hides navigation and controls and exposes the complete reading content.
Diagrams require JavaScript; text, source references, and native disclosures
remain available without it.

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
