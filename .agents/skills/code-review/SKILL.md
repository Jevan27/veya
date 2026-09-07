---
name: code-review
description: >-
  Rigorous code review standards strictly enforcing Veya's AGENTS.md guidelines.
  Use when reviewing pull requests, inspecting git diffs, auditing newly written code,
  or ensuring changes adhere to architectural conventions and quality standards.
---

# Code Review Engineering Skill for Veya

This skill defines the technical standards, evaluation rubric, severity classifications, and reporting workflows for autonomous code reviews across the Veya monorepo (`@veya/backend`, `@veya/app`, `@veya/shared`).

This skill is **exclusively responsible for reviewing existing code and proposed changes**. It must not be used as a general development skill.

---

## 1. Core Review Principles

A code review is an objective, evidence-based evaluation of software correctness, security, architecture, and maintainability.

### Non-Negotiable Invariants:

1. **Full Context Over Isolated Diffs**:
   - **NEVER** review a `git diff` chunk in isolation. A line that looks harmless in a diff chunk may introduce an injection flaw, race condition, or broken contract when evaluated in the context of the surrounding function or module.
   - Always inspect the complete file, related types in `@veya/shared`, upstream caller code, and corresponding tests.
2. **Distinguish Real Findings From Personal Preferences**:
   - Report a finding **ONLY** when it represents:
     - A real bug or unintended logic flaw.
     - A realistic security vulnerability or authorization bypass.
     - A data loss, corruption, or database transaction risk.
     - A violation of `AGENTS.md` architectural boundaries (e.g. Prisma in controllers, code in `frontend/`).
     - A broken API contract or serialization mismatch.
     - A regression risk or unhandled exception.
     - A missing critical test for a sensitive path.
   - **NEVER** reject or delay code based on personal taste, syntactic bikeshedding, or formatting styles handled by automated tools (Prettier, ESLint).
3. **Evidence-Based False-Positive Discipline**:
   - Before reporting an issue, trace the execution path.
   - Check if an upstream pipe (e.g. global `ValidationPipe` in `main.ts`), middleware, guard (`JwtAuthGuard`), or database constraint (PostgreSQL partial unique index) already handles the concern.
   - Do not speculate. If evidence is ambiguous, explicitly state the observation as a question or request for clarification rather than asserting a defect as fact.

---

## 2. The 9-Step Review Workflow

When conducting a code review on a pull request, branch, or staged commit, follow this sequential protocol:

```text
1. Read AGENTS.md
   ↓
2. Inspect Repository Structure
   ↓
3. Inspect Applicable Skills (.agents/skills/*)
   ↓
4. Determine Target Branch / Base (e.g. origin/master)
   ↓
5. Inspect Git Diff (git diff --stat and git diff)
   ↓
6. Inspect Modified Files in Full Context
   ↓
7. Inspect Relevant Neighboring Code & Contracts
   ↓
8. Inspect Tests Related to the Change
   ↓
9. Run Verification Commands
```

### Protocol Execution:

1. **Read `AGENTS.md`**: Refresh the repository's universal engineering rules.
2. **Inspect Repository Structure**: Verify that no files were added to `frontend/` (Rule #29), no root scratch files were created (Rule #28), and all new files are in appropriate feature folders (Rule #4).
3. **Inspect Applicable Skills**: Load the relevant domain skills (`backend-development`, `frontend-development`, `database`, `security`, `testing`, `documentation`).
4. **Determine Target Branch**: Confirm the base commit/branch to establish accurate diff boundaries.
5. **Inspect Git Diff**: Scan changed files, line counts, and modified symbols.
6. **Inspect in Full Context**: Open and read the modified files completely. Evaluate the whole class, controller, component, or service.
7. **Inspect Neighboring Code**: Check callers, imported DTOs in `@veya/shared`, database models in `schema.prisma`, and API client services.
8. **Inspect Tests**: Verify whether tests were added or modified, whether they test behavior instead of implementation, and whether negative paths are asserted.
9. **Run Verification Commands**: Execute automated typechecks and linters (`pnpm typecheck`, `pnpm lint`).

---

## 3. The 10-Tier Review Priority (Order of Precedence)

Review code strictly according to risk and impact. Never spend review effort on style while overlooking a correctness, security, or data integrity defect.

```text
Priority Hierarchy:
[1]  Correctness              (Logic flaws, unhandled edge cases, runtime exceptions, null safety)
[2]  Security                 (Authentication, authorization, IDOR, input validation, secrets)
[3]  Data Integrity           (Transactions, race conditions, partial unique constraints, cascades)
[4]  API / Contract Parity    (@veya/shared synchronization, OpenAPI annotations, DTO mappings)
[5]  Architecture             (Thin controllers, service-owned business rules, directory boundaries)
[6]  Error Handling           (Exception mapping, information shielding, network retry behavior)
[7]  Performance              (Bounded queries, N+1 prevention, FlatList virtualization, memory leaks)
[8]  Testing                  (Behavioral assertions, negative paths, regression test coverage)
[9]  Maintainability          (File size guidelines, focused utilities, consistent domain terminology)
[10] Style / Nits             (Naming clarity, non-essential code cleanup - strictly non-blocking)
```

---

## 4. The 4-Tier Severity Model

Every finding reported in a review must be assigned an explicit severity level and structured into four mandatory sections:

1. **What is wrong?** (Concrete technical explanation).
2. **Why does it matter?** (Concrete impact or failure mode).
3. **Where does it occur?** (Repository-relative path and line range).
4. **How can it be fixed?** (Actionable code snippet or solution).

### Severity Definitions:

| Severity       | Threshold & Action                                                                                        | Examples in Veya                                                                                                                                                                       |
| :------------- | :-------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`BLOCKER`**  | **Must not be merged**. Immediate rejection. Catastrophic risk to security, build, or architecture.       | Direct database query in a controller; modifying files in `frontend/`; hardcoded production secrets; unauthenticated endpoint exposing private user data; broken build.                |
| **`CRITICAL`** | **Must be fixed before release**. Severe bug, data corruption risk, or contract breach.                   | IDOR vulnerability (missing `userId` check in service); broken API contract causing mobile crash; unhandled promise rejection in a transaction; missing `@map` on database column.     |
| **`WARNING`**  | **Important defect or risk**. Should be resolved unless an explicit architectural exception is justified. | Unbounded query missing `take: limit`; component exceeding 300 lines without separation; missing regression test for a fixed bug; unnecessary scope creep; unmemoized heavy list item. |
| **`NIT`**      | **Minor non-blocking polish**. Advisory feedback; author may merge without resolving.                     | Slightly clearer variable name; minor comment typo; small non-critical simplification.                                                                                                 |

---

## 5. Domain-Specific Audit Standards

### 5.1 Security Auditing (Coordinate with `security`)

- **Authentication**: Are protected endpoints decorated with `@UseGuards(JwtAuthGuard)` and `@ApiBearerAuth()`?
- **Authorization & IDOR**: Does the service verify that the resource being read, updated, or deleted is owned by `@CurrentUser('sub') userId`? Never trust client-supplied `userId` in the body.
- **Data Protection**: Are `passwordHash` and `hashedRefreshToken` completely omitted from response DTOs?
- **File Uploads**: Does upload handling check binary magic bytes (rejecting SVG, XML, HTML, and executables)? Is file size strictly capped at 5 MB?
- **Secrets Cleanliness**: Are credentials injected via `ConfigService`? Is `.env` untracked in git?

### 5.2 Database & Data Integrity Auditing (Coordinate with `database`)

- **Controller Boundary**: Is `PrismaService` completely absent from controllers (Rule #8)?
- **Atomic Operations**: Are multi-step mutations (such as designating a default card while unsetting prior defaults) wrapped in `prisma.$transaction`?
- **Schema Mapping**: Do all models have `@@map("snake_case_plural")` and non-single-word fields have `@map("snake_case")`?
- **Cascade Safety**: Are foreign key relations defined with explicit cascade behavior (`onDelete: Cascade / Restrict / SetNull`)?
- **Destructive Commands**: Are destructive migrations avoided without a staged migration plan?

### 5.3 Mobile & Frontend Auditing (Coordinate with `frontend-development`)

- **Network Boundary**: Are all API calls channeled through `app/services/api/` and `apiClient`? Reject raw `fetch()` calls in components (Rule #13).
- **Secure Storage**: Are auth tokens stored in `TokenStorage` (backed by `expo-secure-store`) rather than plain `AsyncStorage`?
- **Navigation Safety**: Are authentication redirects using `router.replace()` to prevent back-button navigation loops?
- **Accessibility**: Do touchable icons and buttons have explicit `accessibilityLabel` and `accessibilityRole="button"`? Are touch targets >= 44x44 dp?

### 5.4 Scope Creep & Refactoring Auditing (Rule #33 of `AGENTS.md`)

Audit pull requests for discipline and minimal blast radius:

- **Unrelated Refactors**: Did the author refactor code in untouched files outside the requested feature?
- **Premature Abstractions**: Did the author introduce `BaseService`, `GenericRepository`, or unnecessary inheritance hierarchies (Rule #18)?
- **File Moves**: Were files moved without justification?
- **Dependency Churn**: Were new external packages added without necessity (Rule #24)?

### 5.5 Testing Quality Auditing (Coordinate with `testing`)

- **Behavioral Focus**: Do tests assert observable outputs and error states rather than mocking internal helper calls?
- **Negative Paths**: Are failure cases (400, 401, 404, 409) asserted with authentic exceptions?
- **Zero Assertion Weakening**: Did the author weaken existing assertions or delete tests to get CI to pass?

---

## 6. Standardized Final Review Output Format

Every code review must conclude with this standardized evaluation structure:

```text
Verdict:
[APPROVE / REQUEST CHANGES / BLOCK]

Summary:
[Concise 2-3 sentence overview of the change, evaluated architecture, and general quality.]

Critical Findings:
- [BLOCKER] What is wrong? | Why it matters | Where (file:line) | Actionable fix
- [CRITICAL] What is wrong? | Why it matters | Where (file:line) | Actionable fix
(or "None")

Warnings:
- [WARNING] What is wrong? | Why it matters | Where (file:line) | Actionable fix
(or "None")

Nits:
- [NIT] Suggested improvement | Where (file:line)
(or "None")

Testing Assessment:
[Analysis of test coverage: behavior focus, negative path verification, missing edge cases.]

Verification Results:
[Commands executed and results observed, e.g. pnpm typecheck, pnpm lint, test suites.]

Remaining Risk:
[Operational or deployment risks, e.g. database migration sequencing or mobile cache invalidation.]
```

_Rule_: **NEVER** say "looks good to me" or issue an `APPROVE` verdict without inspecting full file contexts and running automated verification.

---

## 7. Verification Protocol

Before issuing a final code review verdict, execute relevant workspace checks:

### 1. Monorepo Typecheck:

```bash
pnpm typecheck
```

### 2. Monorepo Linting:

```bash
pnpm lint
```

### 3. Code Formatting Check:

```bash
pnpm format:check
```

### 4. Relevant Test Suites:

```bash
pnpm --filter @veya/backend test
```

Never report that verification passed unless the command was executed and exited with code 0.
