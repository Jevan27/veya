---
name: testing
description: >-
  Testing standards, test patterns, and verification workflows in Veya.
  Use when creating, updating, or running automated unit tests, integration tests,
  mocking NestJS services, testing React Native components, or running CI checks.
---

# Testing Engineering Skill for Veya

This skill defines the testing philosophy, architectural standards, test design principles, mocking conventions, and verification workflows across the Veya monorepo (`@veya/backend`, `@veya/app`, `@veya/shared`).

This skill is **exclusively responsible for testing engineering**:

- Test strategy and test level selection
- Unit, integration, E2E, and regression test design
- Mocking discipline, fixtures, and fake timers
- Test isolation, determinism, and flakiness prevention
- Test failure root-cause investigation
- Code coverage philosophy and verification

This skill must **NOT** become a backend, frontend, database, security, or debugging skill. For domain-specific implementation logic, collaborate across skill boundaries.

---

## 1. Core Testing Principles

Automated tests are living specifications of system behavior and the primary safeguard against regressions.

### Non-Negotiable Invariants:

1. **Test Behavior, Not Implementation**:
   - Assert observable outputs, state changes, returned DTOs, and emitted exceptions.
   - Do NOT test private methods, internal variable names, or the exact sequence of internal collaborator calls unless contractually required.
2. **Select the Lowest Useful Test Level**:
   - Verify business calculations, DTO mapping, and input validation at the **Unit** level.
   - Verify controller routing, database transactions, and auth guards at the **Integration** level.
   - Verify critical multi-step revenue or onboarding paths at the **E2E** level.
3. **Test the Full Path Spectrum**:
   - **Happy Paths**: Normal valid execution with standard inputs.
   - **Meaningful Negative Paths**: Assert explicit error codes and exceptions (`400 Bad Request`, `401 Unauthorized`, `404 Not Found`, `409 Conflict`).
   - **Important Boundaries**: Null, empty string, maximum string length (`MaxLength(100)`), 5 MB file size limit, and concurrency collisions.
4. **Zero Assertion Weakening (Absolute Rule)**:
   - **NEVER** weaken an assertion, broaden an `expect()`, or delete an expectation simply to make a failing test pass.
   - A failing test is an alert that code, mocks, or contracts have diverged. Investigate the root cause.
5. **Deterministic & Sleep-Free**:
   - Absolute ban on arbitrary `sleep()`, `setTimeout()`, or `delay()` calls. Tests must execute deterministically using `await` on promises, async event flushers, or Jest fake timers.

---

## 2. The Veya Test Pyramid

```text
       ▲
      / \
     /E2E\        Narrow Apex: Full end-to-end user journeys
    /-----\       (Registration -> Onboarding -> Card Creation -> View)
   / Integ \      Middle Layer: Controller + Service + Guard interactions,
  /---------\     API Client + TokenStorage, Prisma transaction handling
 /   Unit    \    Broad Base: Pure services, validation DTOs, mappers,
/_____________\   custom hooks, formatters, and utility functions
```

### When to Use Each Level:

- **Unit Tests (`*.spec.ts`, `*.test.ts`)**:
  - _When to use_: Testing pure business logic in services (`cards.service.ts`), mapping functions (`toCardDto`), file validation logic (`file-validation.util.ts`), or utility functions (`format-phone.ts`).
  - _Execution_: Extremely fast (< 50ms per test). Uses Jest and mocked external dependencies.
- **Integration Tests**:
  - _When to use_: Verifying NestJS `TestingModule` compilation, controller route decorators with guards, service transaction rollbacks, throttler rate limits, or API client 401 token refresh queues.
  - _Execution_: Fast (< 500ms per suite). Mocks external network and database I/O while executing real framework pipelines.
- **End-to-End (E2E) Tests**:
  - _When to use_: Critical path verification spanning client and server (e.g. user signup -> default card creation -> QR code retrieval).
  - _Execution_: Slower. Reserved strictly for smoke verification of top-tier business flows.

---

## 3. Test Isolation & Determinism

Every test must run in complete isolation from every other test.

### Isolation Rules:

1. **Order Independence**: Running tests in random order (`jest --randomize`) must produce identical results.
2. **State Resetting**: Reset all mocks and internal state before every test:
   ```typescript
   beforeEach(() => {
     jest.clearAllMocks();
   });
   ```
3. **No Cross-Test Contamination**: Never let a test rely on state written by a preceding test.
4. **Zero Live Cloud Dependencies**: Unit and integration tests must NEVER require live internet access, Cloudflare R2 credentials, or external SMS/email gateways.
5. **Clock Determinism**: When testing time-sensitive features (JWT expiry, rate-limiting TTLs, timestamp formatting), use Jest fake timers:
   ```typescript
   jest.useFakeTimers();
   jest.setSystemTime(new Date('2026-03-01T12:00:00.000Z'));
   // ... run test ...
   jest.useRealTimers();
   ```

---

## 4. Mocking Discipline

Mocks are necessary boundaries to isolate the unit under test from non-deterministic external systems.

### 4.1 What to Mock vs. What NOT to Mock

| Category                  | Rule                   | Examples                                                                   |
| :------------------------ | :--------------------- | :------------------------------------------------------------------------- |
| **External I/O**          | **ALWAYS MOCK**        | Cloudflare R2 S3 Client, live network `fetch()`, email providers.          |
| **Database I/O**          | **MOCK IN UNIT TESTS** | `PrismaService` (`businessCard.findMany`, `user.create`, `$transaction`).  |
| **Hardware / Native**     | **ALWAYS MOCK**        | `expo-camera`, `expo-image-picker`, `expo-secure-store`.                   |
| **Business Logic**        | **NEVER MOCK**         | Service methods being tested, transaction coordination, state transitions. |
| **Data Contracts & DTOs** | **NEVER MOCK**         | Shared DTOs (`CardDto`, `CreateCardDto`), `class-validator` rules.         |
| **Pure Utilities**        | **NEVER MOCK**         | String helpers, date formatters, phone validators.                         |

### 4.2 Realistic Mock Behavior

- **Match Reality**: Mocks must return objects that accurately conform to `@veya/shared` types.
- **Simulate Asynchrony**: For asynchronous methods, use `mockResolvedValue()` or `mockRejectedValue()` rather than synchronous values:
  ```typescript
  // GOOD: Realistic async resolution
  mockCardsService.findOne.mockResolvedValue(mockCardDto);

  // GOOD: Realistic exception simulation
  mockCardsService.findOne.mockRejectedValue(new NotFoundException('Card not found'));
  ```
- **Simulate Errors Accurately**: When mocking failures, throw authentic NestJS HTTP exceptions (`NotFoundException`, `ConflictException`, `BadRequestException`).

### 4.3 Over-Mocking Detection

If a test mocks 80%+ of the methods in the class under test, or verifies that function A called function B with exact internal parameter shapes, it is over-mocked.

- _Remedy_: Step back, treat the module as a black box, pass inputs to the public API, and assert the observable output.

---

## 5. Critical Veya Test Scenarios

The following scenarios represent Veya's core business and security boundaries and must always have rigorous test coverage:

### 5.1 Ownership & Authorization

Assert that user A cannot view, update, or delete a card belonging to user B:

```typescript
it('should throw NotFoundException when user attempts to access another user card', async () => {
  mockPrisma.businessCard.findFirst.mockResolvedValue(null);

  await expect(service.findOne('user-attacker-id', 'card-victim-id')).rejects.toThrow(
    NotFoundException,
  );
});
```

### 5.2 Authentication & Password Exposure Prevention

Assert that `passwordHash` and `hashedRefreshToken` are stripped from response DTOs:

```typescript
it('should never expose passwordHash or hashedRefreshToken in response', async () => {
  const result = await authService.register(registerDto);
  expect((result.user as any).passwordHash).toBeUndefined();
  expect((result.user as any).hashedRefreshToken).toBeUndefined();
});
```

### 5.3 Default-Card Invariant & Transactions

Assert that setting a card as default atomically unsets previous defaults inside a transaction:

```typescript
it('should atomically unset prior default cards when creating a new default card', async () => {
  mockPrisma.$transaction.mockImplementation(async (callback) => {
    return callback(mockPrisma);
  });

  await service.create(userId, { ...createCardDto, isDefault: true });

  expect(mockPrisma.businessCard.updateMany).toHaveBeenCalledWith({
    where: { userId, isDefault: true },
    data: { isDefault: false },
  });
});
```

### 5.4 Token Refresh Concurrency Queue

Assert that concurrent 401 responses queue behind a single refresh request without triggering multiple refresh calls or logout loops.

### 5.5 File Upload Validation

Assert that invalid formats (SVG, XML, executables) and files exceeding 5 MB are rejected with `BadRequestException`.

---

## 6. The 6-Step Regression Workflow

When a bug or security vulnerability is reported, execute this deterministic workflow:

```text
Step 1: REPRODUCE
        Reproduce the issue with minimal input data.
           ↓
Step 2: FAILING TEST
        Write a targeted unit or integration test that fails cleanly due to the bug.
           ↓
Step 3: FIX CODE
        Implement the minimal fix in application source code.
           ↓
Step 4: PASSING TEST
        Verify that the new test now passes with exit code 0.
           ↓
Step 5: RELATED TESTS
        Run the complete feature test suite to verify no unintended side-effects.
           ↓
Step 6: VERIFICATION
        Run monorepo lint and typecheck across all workspaces.
```

---

## 7. Test Failure Investigation Taxonomy

When a test fails, **NEVER** change the test immediately. Classify the root cause using this taxonomy:

1. **Code Regression**: The implementation code introduced a bug. Fix the application code.
2. **Stale Test Contract**: The test asserts deprecated behavior that was intentionally altered. Update the test to reflect the new verified contract.
3. **Mock Desynchronization**: The mock returns an outdated data shape missing newly added required fields. Update the mock to match current Prisma/DTO schemas.
4. **Configuration Issue**: A required environment variable or test config option is missing or mismatched.
5. **Environment / OS Issue**: File lock (Windows), execution policy, or path separator differences.
6. **Timing / Asynchrony Issue**: A promise was not awaited, or an event loop cycle did not complete before assertions ran.
7. **Dependency Issue**: A third-party package upgrade changed signature or behavior.
8. **Cascading Failure**: A failure in `beforeEach` or a preceding setup hook broke subsequent assertions.

---

## 8. Coverage Philosophy

- **Coverage is a diagnostic signal, not proof of correctness**: 100% line coverage with weak assertions provides false confidence. 80% coverage with rigorous boundary and negative path assertions is vastly superior.
- **Prioritize Critical Paths**: Focus testing on authentication, card ownership, transactions, storage validation, and payment/billing boundaries.
- **Do Not Test Trivial Code**: Never write tests solely to satisfy coverage quotas on trivial getters, boilerplate constructor assignments, or static constants.

---

## 9. Cross-Skill Collaboration Boundaries

When working on tasks touching multiple domains, coordinate cleanly:

- **`testing + backend-development`**: Testing skill designs the test cases, mocks, and assertions; backend skill implements the controller/service architecture.
- **`testing + frontend-development`**: Testing skill designs mock API responses and component interaction tests; frontend skill builds the React Native components and custom hooks.
- **`testing + database`**: Testing skill designs mock `PrismaService` methods and transaction assertions; database skill manages the Prisma schema and migrations.
- **`testing + security`**: Testing skill authors regression tests for IDOR, timing attacks, and throttler limits; security skill defines the threat model and mitigations.
- **`testing + debugging`**: Testing skill produces minimal reproducible failing test cases to isolate root causes identified by the debugging skill.

---

## 10. Verification Protocol

Before declaring testing work complete, run and report the actual executed commands:

### 1. Execute Backend Test Suites:

```bash
pnpm --filter @veya/backend test
```

### 2. Workspace Typechecks:

```bash
pnpm --filter @veya/backend typecheck
pnpm --filter @veya/app typecheck
```

### 3. Monorepo Linting:

```bash
pnpm lint
```

### 4. Code Formatting Check:

```bash
pnpm format:check
```

### 5. Backend Production Build:

```bash
pnpm --filter @veya/backend build
```

Never claim a verification step passed without running it and observing an exit code of 0.
