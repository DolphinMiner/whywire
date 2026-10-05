---
name: whywire
description: Explain code behavior with compact, source-backed causal diagrams. Use for architecture walkthroughs, request and event flows, lifecycle questions, bug mechanisms, and before/after change explanations. Follow what crosses a boundary, what changes state, and what the caller actually observes. Use plain text when a diagram adds no clarity.
license: MIT
---

# Whywire

**Follow the flow. Understand the why.**

Explain one behavior at a time. Every meaningful arrow should help the reader
understand what happens, why it happens, or where the evidence ends.

## Start with the question

Identify the reader's question and one observable outcome. Start with the
relevant entry point, its callers, state owner, and downstream consumers.
Expand only far enough to explain that outcome. If scope is ambiguous, state
a reasonable bounded interpretation; ask when competing interpretations
would materially change the answer.

Choose the emphasis that fits the request:

- **Understand:** trace a real path and explain why its boundaries exist.
- **Investigate:** separate the reported symptom from the observed mechanism.
- **Compare:** distinguish current behavior from a proposed or verified change.

A diagram request does not authorize fixing code, querying production, or
publishing artifacts. Use the access and permissions already granted.

## Follow the causal path

Trace:

```text
trigger → boundary crossing → state change → downstream reaction → observable outcome
```

Use concrete operations and state names. `API → worker` is a relationship;
`API commits pending → publishes job → worker claims pending` explains behavior.
For important boundaries, inspect both ends. A successful send call alone
does not establish consumption, persistence, or what the user sees after reload.

Follow the ordering in the source. Label concurrency, delayed callbacks,
retries, and separate transactions when they matter; never turn them into an
invented serial flow. Keep persisted state, cache, transport, and UI projections
distinct. Name which component owns each consequential state transition.

## Ground the explanation

Read [references/evidence.md](references/evidence.md) when citing code, tracing
multiple repositories, comparing revisions, or investigating uncertain results.

- **Observed:** supported by a check actually run, with its scope and result.
- **Source-backed:** supported by inspected code or configuration; not runtime proof.
- **Inferred:** a plausible implication with its assumptions stated.
- **Proposed:** a future path; not an implemented or tested result.
- **Unknown:** the necessary source, environment, or observation is unavailable.

Link key transitions to a file plus symbol or verified line. State the revision
when known and mention relevant dirty changes. Never invent a path, line,
observation, test result, or deployment fact. With only a description, label the
diagram a model of that description. Keep sensitive payloads out of examples.

## Draw the smallest useful view

Default to Mermaid in Markdown. Prefer a sequence diagram for behavior over
time, a state diagram for lifecycle transitions, and a flowchart for decisions
or structural dependencies. Read [references/diagrams.md](references/diagrams.md)
for syntax and compact examples.

Aim for roughly 4–7 participants and 6–10 meaningful steps when they suffice.
These are readability hints, not a requirement to omit a relevant boundary.
Split a crowded view by question; show what was left out. Do not add databases,
queues, services, or owners just to fill a familiar architecture template.

Use exact identifiers where they matter and the reader's language for prose.
Keep raw Mermaid source available. If rendering is unavailable, deliver the
source and say it was not rendered; do not install tools just to force a preview.
Use another output format when the user requests it and a suitable tool exists.

## Make the explanation useful

Lead with the answer, then the diagram and the evidence needed to assess it.
Include only the following parts that matter to the question:

- the path and its source references;
- the invariant: a condition the system must preserve;
- the failure point or unresolved boundary;
- the smallest coherent change, if a change was requested;
- a discriminating check: what observation would support or refute the explanation.

For a bug, explain why the mechanism produces the symptom and where ownership
puts the fix. Do not announce a root cause until evidence distinguishes it from
alternatives. For a proposal, identify what changes and what still needs proof.

At an async handoff, distinguish durable state, external effect, and its
acknowledgement. If their gap matters, show what is recoverable after a crash
or ambiguous result. Commit-then-publish and blind retry are not universal
solutions; neither is adding an outbox or a new state machine by default.

For a simple architecture question, do not turn the answer into a full audit.
Before delivery, check that each important arrow has support, facts and
proposals are distinct, and the diagram answers the actual question.
