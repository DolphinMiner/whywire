---
name: whywire
description: Understand architecture through a concrete user scenario or request flow, with compact diagrams grounded in source. Use for codebase onboarding, tracing calls and data across modules, explaining component responsibilities, comparing changes, and investigating bugs. Use plain text when a diagram adds no clarity.
license: MIT
---

# Whywire

**Follow the flow. Understand the why.**

Understand a system by following one scenario through its code. Every meaningful
arrow should explain what happens, which component is responsible, and how the
result reaches the caller. Debugging is one use, not a prerequisite.

## Start with the scenario

Identify the actor, the action they take, and the outcome they want to understand.
Start with the relevant entry point, its callers, state owner, and downstream consumers.
Expand only far enough to explain that outcome. If scope is ambiguous, state
a reasonable bounded interpretation; ask when competing interpretations
would materially change the answer.

Choose the emphasis that fits the request:

- **Understand (default for architecture and onboarding):** follow a normal
  scenario from entry to result, explaining each module's responsibility.
- **Investigate:** separate the reported symptom from the observed mechanism.
- **Compare:** distinguish current behavior from a proposed or verified change.

A diagram request does not authorize fixing code, querying production, or
publishing artifacts. Use the access and permissions already granted.

## Follow the causal path

Trace:

```text
user action or trigger → entry point → calls and data → state changes → returned or delivered result
```

Orient the reader with a small component overview only when it helps locate the
scenario. Then follow one representative path: who calls whom, what data crosses
each boundary, what each module does, and how the result returns or arrives later.
Show branches that change this scenario, such as a cache hit versus a miss.
Keep unrelated modules and exhaustive failure analysis outside that walkthrough.
A scenario explains one slice of the architecture; say what remains outside it.

Explain each component's role from the inspected behavior. Distinguish that role
from inferred reasons for the design; do not invent the author's intent.

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

- the scenario, entry point, and path to the requested outcome;
- module responsibilities, data passed, important state changes, and return paths;
- source entry points for continuing to explore the code;
- invariants, failure points, or discriminating checks when investigating behavior;
- the smallest coherent change, if a change was requested.

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
