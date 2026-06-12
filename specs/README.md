# AIS Spec Framework Specs

This directory is for managing changes to the AIS Spec framework itself using
the AIS Spec lifecycle.

These specs are source-repo development artifacts. They are not part of the
framework payload copied into downstream project repositories.

## Distribution Rule

Downstream project setup and upgrade flows must not copy this directory from
`ais-internal/AIS-spec`.

- `scripts/setup-project.sh` creates an empty `specs/` directory in the target
  project.
- `docs/guides/project-setup.md` instructs new projects to start with empty
  project-owned specs.
- `docs/guides/upgrade.md` treats `specs/` as project-owned and excludes it
  from framework upgrades.

## Self-Management Workflow

Framework changes may use normal spec lifecycle artifacts here:

```text
specs/YYMM-NNN-short-name/
  spec.md
  design.md
  tasks.md
  implementation-plan.md
```

Each spec should map back to a GitHub issue or PR when one exists. The spec is
the durable design and execution record; the GitHub issue remains the tracking
entry for discussion and prioritization.
