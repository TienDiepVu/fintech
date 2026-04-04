# Design Spec: Git Workflow and Feature Documentation

This specification defines the updated process for AI-driven development tasks, incorporating mandatory Git operations and structured feature documentation.

## Goals
- Ensure all AI tasks are performed on isolated branches derived from the latest `main` branch.
- Maintain persistent, detailed documentation for each feature or bug fix.
- Centralize task logging for traceability.

## Proposed Changes

### 1. Update `gemini.md`
The core instructions for the AI will be updated to include specific Git and documentation requirements within **BƯỚC 3 (EXECUTION & DOCUMENTATION)**.

#### Updated Step 3 Structure:
- **Git Setup:**
  - `git checkout main` && `git pull origin main`.
  - Create branch: `feature/[name]` for features, `fix/[name]` for bug fixes.
- **Implementation:** Execute the approved plan.
- **Feature Documentation:**
  - Path: `docs/features/[feature-name].md`.
  - Content: Overview, usage/logic, and change history.
- **Global Logging:** Update `CHANGELOG_AI.md` with a summary and link to the feature doc.

### 2. Documentation Standards
New features or major changes must have a corresponding markdown file in `docs/features/`.

#### `docs/features/[feature-name].md` Template:
```markdown
# [Feature Name]

## Description
[How it works, purpose, and logic]

## Usage / Examples
[How to use or code snippets]

## Change History
- **[YYYY-MM-DD]:** [Brief description of changes]
```

## Success Criteria
1. The AI starts coding only after switching to a fresh `feature/` or `fix/` branch.
2. Every task results in an updated or new file in `docs/features/`.
3. `CHANGELOG_AI.md` remains the entry point for all AI activity logs.

## Verification Plan
- Manually verify the content of `gemini.md`.
- Perform a test task to ensure the AI correctly executes the Git commands and creates the documentation file.
