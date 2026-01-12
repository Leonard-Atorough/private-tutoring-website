# Architectural Decision Records (ADRs)

This folder contains documentation of significant architectural and technical decisions made during the development of the tutoring website.

## What is an ADR?

An **Architectural Decision Record (ADR)** is a document that captures an important architectural decision along with its context and consequences. ADRs help:

- **Document "why"** - Future developers understand the reasoning behind decisions
- **Prevent revisiting** - Avoid rehashing the same debates
- **Onboard new team members** - Quickly understand project history
- **Track evolution** - See how thinking changed over time

## ADR Format

Each ADR follows this structure:

```markdown
# [Number]. [Title]

**Date**: YYYY-MM-DD  
**Status**: Proposed / Accepted / Deprecated / Superseded  
**Deciders**: [Names of decision makers]  
**Technical Story**: [Link to GitHub issue or ticket]

## Context and Problem Statement

What is the issue we're trying to solve? What factors are relevant?

## Decision Drivers

- Driver 1 (e.g., Performance requirements)
- Driver 2 (e.g., Budget constraints)
- Driver 3 (e.g., Developer experience)

## Considered Options

- Option 1
- Option 2
- Option 3

## Decision Outcome

**Chosen option**: "[Option X]", because [justification].

### Consequences

**Good**:
- Benefit 1
- Benefit 2

**Bad**:
- Drawback 1
- Drawback 2

**Neutral**:
- Trade-off 1

## Pros and Cons of the Options

### [Option 1]

[Brief description]

**Pros**:
- Pro 1
- Pro 2

**Cons**:
- Con 1
- Con 2

### [Option 2]

[Same structure as Option 1]

## More Information

- Links to research, docs, or discussions
- Related ADRs
```

## ADR Naming Convention

```
[number]-[short-title].md

Examples:
- 001-headless-cms-selection.md
- 002-testing-strategy.md
- 003-student-portal-architecture.md
```

Numbers are sequential and never reused (even if an ADR is deprecated).

## ADR Lifecycle

### Status Values

- **Proposed** - Under discussion, not yet decided
- **Accepted** - Decision has been made and is active
- **Deprecated** - No longer relevant (explain why in the ADR)
- **Superseded** - Replaced by a newer ADR (link to the new one)

### When to Create an ADR

Create an ADR when making decisions about:

- **Technology choices** (frameworks, databases, hosting)
- **Architecture patterns** (monolith vs. microservices, state management)
- **Third-party services** (payment processors, CMS, analytics)
- **Development workflows** (Git branching strategy, CI/CD)
- **Major refactors** (CSS methodology, file structure)

### When NOT to Create an ADR

Don't create ADRs for:

- Simple implementation details (use code comments instead)
- Temporary experiments (use feature flags or branches)
- Obvious best practices (following established conventions)
- Content changes (use git commit messages)

## Current ADRs

| Number | Title | Status | Date |
|--------|-------|--------|------|
| [001](001-headless-cms-selection.md) | Headless CMS Selection | Proposed | 2025-12-17 |
| [002](002-testing-strategy.md) | Testing Strategy | Proposed | 2025-12-17 |
| [003](003-student-portal-architecture.md) | Student Portal Architecture | Proposed | 2025-12-17 |

## ADR Best Practices

### Keep It Concise
- Aim for 1-2 pages max
- Focus on "why" not "how"
- Link to external docs for details

### Be Honest About Trade-offs
- No decision is perfect
- Document downsides transparently
- Explain why the trade-off is acceptable

### Update Status Over Time
- Mark ADRs as deprecated when circumstances change
- Link to superseding ADRs
- Keep historical context intact

### Review Regularly
- Quarterly review of active ADRs
- Revisit decisions as project evolves
- Update "More Information" with learnings

## Example ADRs

### ADR Template (Blank)
See [adr-template.md](adr-template.md) for a blank template to copy when creating new ADRs.

### Sample Completed ADR
See [001-headless-cms-selection.md](001-headless-cms-selection.md) for an example of a completed ADR.

## Resources

- **ADR GitHub Org**: [adr.github.io](https://adr.github.io/) - ADR tools and examples
- **Joel Parker Henderson's ADR repo**: [github.com/joelparkerhenderson/architecture-decision-record](https://github.com/joelparkerhenderson/architecture-decision-record)
- **ThoughtWorks on ADRs**: [thoughtworks.com/radar/techniques/lightweight-architecture-decision-records](https://www.thoughtworks.com/radar/techniques/lightweight-architecture-decision-records)

---

**Maintainer**: Development Team  
**Last Updated**: December 17, 2025
