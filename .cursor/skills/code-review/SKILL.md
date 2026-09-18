---
name: code-review
description: Comprehensive code review checklist. Use when reviewing code changes, validating pull requests, or preparing releases.
---

# Code Review Workflow

1. Check for TypeScript type safety and ensure no unescaped `any` or loose types.
2. Run linter with `npm run lint` and verify zero errors or warnings.
3. Execute unit tests with `npm test`.
4. Ensure components respect accessibility guidelines (a11y), responsive layouts, and design tokens.
