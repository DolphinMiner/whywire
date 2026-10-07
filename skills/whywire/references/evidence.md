# Evidence that survives a second reader

Use the minimum evidence that makes the explanation checkable.

## Link claims to sources

For a local checkout, cite a file and symbol or a verified line. For a hosted
repository, prefer a commit-pinned file URL. Do not use a moving `main` link
to imply a historical version was inspected. State when a checkout is dirty.
When a ref is unavailable, say so instead of inventing a revision.

Follow the active caller wiring, registrations, and relevant configuration.
Finding a handler with a plausible name does not establish that the current UI
uses it. Carry caller-side filters and feature conditions into the explanation.

In an HTML guide, attach sources to the corresponding steps and keep longer
evidence expandable. Do not repeat a complete reference table above the flow.
For a requested Markdown answer, a small table can be useful, for example:

| Transition | Evidence | What it establishes |
|---|---|---|
| A read misses cache and calls the store | `cache.py`, `read()` | Source-backed branch |
| Two reads produce one store access | Named check and observed output | Only the tested fixture |
| Production has the same configuration | Not inspected | Unknown |

These names illustrate the citation format; replace them with actual inspected
sources. A code link proves what the code says, not that it ran in production.

## Investigate without filling gaps

Keep the symptom, available evidence, candidate mechanism, and missing check
separate. Prefer the check that distinguishes competing explanations. If a
provider may have acted before timing out, a local exception proves neither
remote success nor remote failure. Label the external outcome unknown until
an authoritative record or safe reconciliation resolves it.

An event emitted by one service does not prove another received it. Inspect
the receiving handler, filtering, persistence, read model, and reload path
only as far as the user's question requires. Absence from the files inspected
is not proof a recovery path does not exist elsewhere.

## Across repositories or versions

Record each inspected repository and revision. Match producer payloads to
consumer contracts, including generated enums when relevant. Label a diagram
that combines independently inspected revisions; do not imply they were
deployed together. Compatibility requirements depend on actual old clients
and persisted data, not just a hypothetical rollout.

For a requested PR comparison, use the intended target's merge base and
relevant working-tree changes. Keep current, proposed, and tested paths
visibly distinct. Unknown target or unavailable source narrows the claim.

## Verify the explanation

Useful checks exercise what the caller can observe: a reload, the returned
resource, a duplicate request, or recovery after reopening durable storage.
Choose checks for the mechanism under discussion; do not mandate a large
matrix for every diagram. Report what ran and what was skipped. Never turn
sample output, an expected result, or another agent's summary into your own
observed evidence.
