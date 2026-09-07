---
name: debugging
description: >-
  Systematic debugging methodology and diagnostic procedures for Veya.
  Use when diagnosing errors, network failures, mobile-backend communication issues,
  token refresh loops, Prisma errors, or visual rendering bugs in Veya.
---

# Debugging Engineering Skill for Veya

This skill defines the root-cause debugging methodology, evidence collection protocols, hypothesis testing systems, architectural tracing procedures, and failure runbooks across the Veya monorepo (`@veya/backend`, `@veya/app`, `@veya/shared`).

This skill is **exclusively responsible for diagnosing and resolving unexpected behavior**.

---

## 1. Core Rule: Hypothesis-Driven Debugging

> **Never modify code merely because it might fix the symptom.**
> **Every meaningful debugging change must be based on an explicit, testable hypothesis.**

Patching code speculatively without understanding root cause masks underlying defects, introduces regressions, and creates technical debt. Debugging in Veya is an empirical, scientific investigation: observe evidence, isolate the failure mechanism, formulate a testable hypothesis, prove or disprove it, and apply the minimal targeted fix.

---

## 2. The 9-Step Debugging Workflow

When investigating any defect or unexpected behavior, execute this deterministic sequence:

```text
1. Observe
   ↓
2. Reproduce
   ↓
3. Collect Evidence
   ↓
4. Form Hypothesis
   ↓
5. Test Hypothesis
   ↓
6. Identify Root Cause
   ↓
7. Apply Smallest Fix
   ↓
8. Verify
   ↓
9. Regression Check
```

### Step-by-Step Instructions:

1. **Observe**: Note the unexpected behavior reported by the user, test failure, or log alert.
2. **Reproduce**: Determine the exact user flow, network state, or input payload that reliably triggers the failure. If a bug cannot be reproduced, gather more diagnostic evidence before modifying code.
3. **Collect Evidence**: Systematically gather error traces, logs, HTTP statuses, and database states.
4. **Form Hypothesis**: State the suspected technical cause and explicitly define what evidence would disprove it.
5. **Test Hypothesis**: Run the smallest targeted probe, inspection query, or test assertion to confirm or refute the hypothesis.
6. **Identify Root Cause**: Distinguish the visible symptom from the fundamental failure mechanism.
7. **Apply Smallest Fix**: Implement the minimal code change that resolves the root cause with zero unrelated changes.
8. **Verify**: Test the exact reproduction scenario and inspect adjacent boundary conditions.
9. **Regression Check**: Author a regression test (`debugging + testing`), then execute workspace typecheck, lint, and test suites.

---

## 3. Systematic Evidence Collection Protocol

Before altering a single line of production code, collect evidence across these 10 dimensions:

```text
Evidence Checklist:
├─ 1. Exact Error Message: Full unedited string (e.g. "P2002 Unique constraint failed")
├─ 2. Stack Trace: Complete call stack locating the exact source file and line number
├─ 3. HTTP Status & Headers: Status code (400, 401, 403, 404, 409, 429, 500, 0)
├─ 4. Request / Response Payloads: Serialized JSON request body and response payload
├─ 5. Runtime Logs: NestJS Logger output, Metro terminal logs, Docker container logs
├─ 6. State Transitions: Component state, form state, or context values before and after
├─ 7. Database State: Inspecting records via Prisma Studio or query inspection
├─ 8. Environment / Config: Variables in .env, NODE_ENV, port numbers, CORS origin
├─ 9. Recent Code Changes: Git diff against origin/master or recent commits
└─ 10. Platform Differences: iOS vs Android vs Web; physical phone vs emulator
```

### Critical Axiom: Symptom ≠ Root Cause

- **Symptom**: "The mobile app screen is blank white on startup."
- **Root Cause**: `index.tsx` checks `user.onboardingCompleted`, which evaluates to `undefined` because the backend `/users/me` endpoint omitted the field in its response DTO.
- _Rule_: Never fix the symptom by adding a random null check in the UI if the backend contract was violated. Fix the source of truth.

---

## 4. The 5-Step Hypothesis System

For any non-trivial or multi-layered issue, follow this structured hypothesis protocol:

1. **State the Suspected Cause**:
   - Write a clear, falsifiable assertion: _"The login request is failing with 401 Unauthorized because the Argon2 hash comparison in AuthService fails due to leading/trailing whitespace in the submitted email."_
2. **Explain Why Evidence Supports It**:
   - _"The user registered with `test@veya.app `, but the login form sends `test@veya.app`."_
3. **Identify What Would Disprove It**:
   - _"If querying PostgreSQL via Prisma shows the email was already normalized to lower-case trimmed text, this hypothesis is disproven."_
4. **Run the Smallest Diagnostic Needed**:
   - Inspect the database record or run a targeted single test: `pnpm --filter @veya/backend test -t "AuthService"`.
5. **Update the Hypothesis**:
   - If disproven, discard the hypothesis and formulate a new one using the newly discovered evidence.
   - **Prohibition**: Never generate and apply multiple speculative fixes simultaneously.

---

## 5. Tracing Down the 9 Veya Architectural Layers

When diagnosing full-stack or communication failures, trace systematically through Veya's layers:

```text
Layer 1: UI Presentation
         Component JSX, styles, conditional rendering flags (isLoading, isAuthenticated)
            ↓
Layer 2: Feature Hook & State
         useCardForm, AuthContext, useAuth, local useState, derived useMemo
            ↓
Layer 3: Feature API Service
         cards.api.ts, users.api.ts, auth.api.ts (endpoint URI, payload serialization)
            ↓
Layer 4: API Client
         client.ts (getBaseApiUrl, Bearer token injection, token refresh queue)
            ↓
Layer 5: Network Transport
         LAN IP discovery, Wi-Fi firewall, CORS headers, reverse proxy, SSL/TLS
            ↓
Layer 6: Controller Layer
         CardsController, route path decorators, ValidationPipe, JwtAuthGuard
            ↓
Layer 7: Service Layer
         CardsService, AuthService, ownership checks, transaction boundaries
            ↓
Layer 8: Prisma ORM
         PrismaClient, schema mappings, P2002/P2025 error codes, query generation
            ↓
Layer 9: PostgreSQL Database
         Constraints, partial unique indexes, connection pool, foreign key cascades
```

_Rule_: Inspect only as deep as necessary. Start at the layer where the symptom was observed, inspect the immediate boundary, and step inward until the defect is isolated.

---

## 6. Diagnostic Runbooks for 11 Common Failure Classes

### 6.1 Frontend Rendering Bugs

- **Symptoms**: Blank screen, white flash, crash with _"Cannot read property of undefined"_, or infinite re-render loop.
- **Diagnostic Procedure**:
  1. Inspect component props and hook return values. Check if an API response returned `null` instead of an expected empty array `[]`.
  2. Check `useEffect` dependency arrays: if a state setter or unmemoized object/function is in the dependency array, it triggers an infinite re-render cycle.
  3. Ensure all conditionally rendered screens return valid React elements (never `undefined`).

### 6.2 API Communication Failures

- **Symptoms**: HTTP 400, 404, 500, or `ApiError: Network request failed (status 0)`.
- **Diagnostic Procedure**:
  1. **Status 400**: Inspect the `data.message` array returned by NestJS `ValidationPipe`. Check DTO decorators in `backend/src/<feature>/dto/` against the JSON payload sent by `apiClient`.
  2. **Status 404**: Check route path matching (e.g. `/api/v1/cards` vs `/cards`). If querying an entity by ID, check if the service threw 404 due to resource ownership mismatch (`userId` check).
  3. **Status 500**: Inspect the backend console/log. Look for unhandled exceptions or database connectivity drops.
  4. **Status 0**: Network failure. Check physical device LAN configuration.

### 6.3 Authentication Failures

- **Symptoms**: "Incorrect email or password", 401 Unauthorized during login.
- **Diagnostic Procedure**:
  1. Inspect `AuthService.login` in `backend/src/auth/auth.service.ts`.
  2. Verify that the incoming email is normalized (`.toLowerCase().trim()`) before database lookup.
  3. Check password verification: ensure Argon2id (`argon2.verify`) is being executed against the stored `passwordHash`.
  4. Verify that `DUMMY_HASH` is not inadvertently overwriting valid user hashes.

### 6.4 Token Refresh Loops & Cascading 401s

- **Symptoms**: Infinite redirect loop between login screen and home screen, or flashing authenticated views.
- **Diagnostic Procedure**:
  1. Inspect `app/services/api/client.ts` lines 56–123 (`refreshAuthTokens`).
  2. Check `isRefreshing` mutex flag: ensure concurrent requests subscribe to `refreshSubscribers` rather than launching parallel refresh requests.
  3. Verify `TokenStorage.getRefreshToken()` retrieves a valid token from `expo-secure-store`.
  4. Check backend `AuthService.refreshTokens`: verify that the submitted refresh token matches the Argon2 hash in `User.hashedRefreshToken`.
  5. Check whether the token refresh endpoint itself returned 401 (if so, tokens must be wiped and `router.replace('/(auth)/login')` invoked immediately).

### 6.5 Authorization & IDOR Issues

- **Symptoms**: User A sees User B's card, or user A gets 404 when updating their own card.
- **Diagnostic Procedure**:
  1. Inspect controller route handler: verify caller identity is extracted from `@CurrentUser('sub') userId: string` (never from `@Body()`).
  2. Inspect service query: verify query includes `{ where: { id: cardId, userId } }`.
  3. Check JWT strategy (`backend/src/auth/strategies/jwt.strategy.ts`): verify `validate(payload)` returns `{ sub: payload.sub, email: payload.email }`.

### 6.6 Prisma ORM Errors

- **Symptoms**: `P2002` (Unique constraint failed), `P2025` (Record not found), `P2021` (Table does not exist).
- **Diagnostic Procedure**:
  1. **P2002**: A unique index was violated. Check if the error occurred on `business_cards_user_default_unique` (concurrency race when designating a default card) or `users_email_key`.
  2. **P2021**: Schema mismatch. Verify model has explicit `@@map("table_name")` matching PostgreSQL, and run `pnpm --filter @veya/backend prisma:generate`.
  3. **P2025**: An update or delete targeted a non-existent row. Wrap query in `findFirst` check.

### 6.7 Database Migrations & Lockouts

- **Symptoms**: Migration fails to apply, or database hangs during startup.
- **Diagnostic Procedure**:
  1. Check `DIRECT_URL` in `.env`: migrations require a direct connection, whereas pooled connections (`DATABASE_URL`) may block advisory locks.
  2. Inspect `backend/prisma/migrations/`: verify migration folders contain valid `migration.sql` files without conflicting timestamps.
  3. If Prisma Client is locked on Windows (`EPERM: rename query_engine`), terminate background Node processes holding file handles before running `prisma generate`.

### 6.8 Cloudflare R2 Upload Failures

- **Symptoms**: "Failed to upload photo" or `ServiceUnavailableException`.
- **Diagnostic Procedure**:
  1. Inspect `backend/src/storage/storage.service.ts`: check if `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, and `R2_SECRET_ACCESS_KEY` are present in `.env`.
  2. Check file buffer validation (`file-validation.util.ts`):
     - Ensure file size is <= 5 MB (`MAX_IMAGE_SIZE_BYTES`).
     - Check magic bytes via `detectImageSignature`: verify file is valid JPEG, PNG, or WebP. SVGs, XML, and executables are intentionally rejected.
  3. Check Express body parser limits in `backend/src/main.ts`: verify `limit: '10mb'` is configured.

### 6.9 Environment Variable Issues

- **Symptoms**: Backend crashes during bootstrap with validation errors, or mobile app points to wrong URL.
- **Diagnostic Procedure**:
  1. Backend: Inspect `backend/src/config/env.validation.ts`. If a variable is marked non-optional without default, `validateSync` will throw on startup.
  2. Mobile: Inspect `process.env.EXPO_PUBLIC_API_URL`. Ensure prefix `EXPO_PUBLIC_` is used for client-exposed variables in Expo.

### 6.10 Platform-Specific Quirks (Physical Devices vs. Emulator)

- **Symptoms**: Mobile app connects on simulator but fails with "Network request failed" on physical phone.
- **Diagnostic Procedure**:
  1. On physical devices, `http://localhost:3000` refers to the phone itself.
  2. Inspect `getBaseApiUrl()` in `app/services/api/client.ts`: verify `Constants.expoConfig?.hostUri` dynamically discovers the host machine's LAN IP (e.g. `192.168.1.X`).
  3. Check backend listener: ensure `backend/src/main.ts` listens on `0.0.0.0` (all interfaces), not `127.0.0.1`.
  4. Ensure mobile phone and workstation are connected to the same Wi-Fi subnet without client isolation.

### 6.11 Asynchronous Race Conditions

- **Symptoms**: Stale data displays after save, double-tap creates duplicate cards, state update on unmounted component.
- **Diagnostic Procedure**:
  1. **Double-Tap Creation**: Check if submission button disables immediately upon click (`isSubmitting = true`).
  2. **Unmounted Updates**: Verify `useEffect` cleanup functions cancel pending async calls (`isMounted = false`).
  3. **Out-of-Order Responses**: If search queries or filter calls return out of order, use cancellation tokens or track request sequence IDs.

---

## 7. Fix Discipline & Minimal Blast Radius

When implementing the solution to a diagnosed root cause, enforce strict discipline:

- **Smallest Appropriate Change**: Modify only the code necessary to correct the defect.
- **Minimal Blast Radius**: Avoid refactoring surrounding methods or altering function signatures unless required to resolve the bug.
- **Zero Unrelated Cleanup**: Do NOT rename variables, reformat untouched blocks, or clean up dead code in unrelated files while fixing a bug (Rule #33 of `AGENTS.md`).
- **Architectural Changes**: If fixing the root cause requires an architectural modification (e.g. introducing an atomic transaction or altering a shared DTO), explicitly document the rationale in the pull request or commit.

---

## 8. Regression Prevention Workflow

Every resolved defect must be safeguarded against future regression. Coordinate with the testing skill (`debugging + testing`):

1. **Write a Reproducing Test**:
   - Before applying the fix, author an automated test in `backend/src/<feature>/__tests__/` or `app/` that reproduces the failure and asserts expected behavior.
2. **Apply the Minimal Fix**:
   - Implement the fix in the source file.
3. **Assert Test Passes**:
   - Execute the test and verify it passes with exit code 0.
4. **Run Related Test Suites**:
   - Execute the entire domain test suite to ensure adjacent flows remain healthy.

---

## 9. Verification Protocol

After applying a fix, complete this verification checklist before concluding:

### 1. Reproduce Original Scenario:

- Manually or programmatically execute the exact reproduction steps. Confirm the bug no longer occurs.

### 2. Test Adjacent Edge Cases:

- Test boundary values: empty input, null values, network timeout, maximum payload size.

### 3. Run Relevant Test Suites:

```bash
pnpm --filter @veya/backend test
```

### 4. Run Monorepo Typecheck & Linting:

```bash
pnpm --filter @veya/backend typecheck
pnpm --filter @veya/app typecheck
pnpm lint
pnpm format:check
```

### 5. Verify Build Integrity:

```bash
pnpm --filter @veya/backend build
pnpm --filter @veya/shared build
```

**Never declare a bug fixed solely because an error disappeared once.** Verify it deterministically through tests and type checks.
