---
name: security
description: >-
  Security practices, threat modeling, vulnerability prevention, and authentication auditing for Veya.
  Use when designing authentication flows, verifying authorization, securing API endpoints,
  reviewing file upload handling, managing secrets, or auditing data protection across the monorepo.
---

# Security Engineering Skill for Veya

This skill defines the security architecture, threat modeling standards, vulnerability defenses, and verification workflows across the Veya monorepo (`@veya/backend`, `@veya/app`, `@veya/shared`).

This skill is **exclusively responsible for application security**.

---

## 1. The Adversarial Security Mindset

For every security-sensitive feature or code modification, never ask only:

> **"Does this work?"**

Always ask:

> **"How could an untrusted user, malicious client, or compromised network abuse this?"**

Assume all client requests are potentially forged, all network payloads may be tampered with, and all client-side storage mechanisms outside hardware keychains are vulnerable.

---

## 2. The 8-Element Threat Modeling Framework

For every new endpoint, authentication flow, or data-handling feature, perform an explicit threat model:

1. **Assets**: What must be protected? (User accounts, passwords, JWT tokens, card contact data, uploaded images, PostgreSQL tables, Cloudflare R2 buckets).
2. **Trust Boundaries**: Where does untrusted input cross into trusted systems? (Mobile Client -> API Gateway; Controller -> Service; Service -> Database / R2).
3. **Attackers**: Who might target this surface? (Unauthenticated internet scanners, authenticated malicious users attempting cross-tenant access, compromised client devices).
4. **Attack Surfaces**: What is exposed? (HTTP verbs, route parameters, query strings, JSON payloads, multipart file uploads, headers, CORS origins).
5. **Sensitive Operations**: High-impact business actions (Registration, login, password reset, token refresh, email update, account deletion).
6. **Privileged Operations**: Mutations of state (Updating business card content, toggling default card status, uploading avatars, modifying user profiles).
7. **Possible Abuse Paths**: Specific exploitation scenarios (Insecure Direct Object Reference (IDOR) on card UUIDs, user enumeration via login timing, stored XSS via SVG uploads, parameter pollution, brute-force credential stuffing).
8. **Impact**: Business and technical fallout (Account takeover, horizontal data leakage, unauthorized profile tampering, service denial, brand damage).

---

## 3. When to Use & Skill Boundaries

### Activate this skill when:

- Designing or modifying authentication, registration, password hashing, or token lifecycles.
- Implementing authorization checks, route guards, and resource ownership verification.
- Configuring environment variables, API secrets, JWT keys, or Cloudflare R2 credentials.
- Implementing file uploads, media buffers, or avatar/logo storage.
- Defending against injection, parameter pollution, cross-origin tampering, or brute-force attacks.
- Triaging security advisories or conducting code security reviews.

### Cross-Skill Boundaries:

- **Backend Feature Implementation (`security + backend-development`)**:
  When authoring controller route decorators, service transaction logic, or database queries with security constraints, coordinate with `backend-development`.
- **Automated Security Regression Testing (`security + testing`)**:
  When creating regression tests for security vulnerabilities (e.g. IDOR test cases, rate-limiting assertions, timing attack defenses), coordinate with `testing`.

---

## 4. Authentication Architecture & Mitigations

Veya enforces a defense-in-depth authentication model across `@veya/backend` and `@veya/app`.

### 4.1 Password Handling & Hashing (Argon2id)

- **Hashing Standard**: Always hash passwords using Argon2id (`argon2.hash(password, { type: argon2.argon2id })`).
- **Prohibitions**: **NEVER** use MD5, SHA-1, SHA-256, or plain bcrypt.
- **Client Security**: Passwords must be transmitted over TLS and never logged or cached on mobile devices.

### 4.2 Timing-Equalized Login & Enumeration Defense

To prevent email enumeration via execution time disparities:

- When a user is not found, evaluate password verification against `AuthService.DUMMY_HASH` to ensure execution time remains constant:
  ```typescript
  const hashToVerify = user?.passwordHash || AuthService.DUMMY_HASH;
  let passwordMatches = false;
  try {
    passwordMatches = await argon2.verify(hashToVerify, dto.password);
  } catch {
    passwordMatches = false;
  }

  // Generic message: never disclose whether the email exists in the database
  if (!user || !user.passwordHash || !passwordMatches) {
    throw new UnauthorizedException('Incorrect email or password.');
  }
  ```

### 4.3 JWT Access Tokens & Refresh Token Rotation

- **Short-Lived Access Tokens**: Access tokens expire in 15 minutes (`JWT_ACCESS_EXPIRES_IN=15m`).
- **Single-Use Refresh Token Rotation**: Refresh tokens expire in 7 days (`JWT_REFRESH_EXPIRES_IN=7d`). Every refresh request issues a new access token AND a new refresh token, immediately invalidating the old refresh token.
- **Hashed Refresh Token Invariant**: Refresh tokens must **NEVER** be stored in plain text in PostgreSQL. Store only the Argon2id hash in `User.hashedRefreshToken`:
  ```typescript
  const refreshTokenMatches = await argon2.verify(user.hashedRefreshToken, refreshToken);
  if (!refreshTokenMatches) {
    throw new UnauthorizedException('Access Denied');
  }
  ```
- **Token Revocation on Logout**: When a user logs out, immediately nullify `hashedRefreshToken` in the database.

### 4.4 Brute-Force & Denial-of-Service Protection

- Protect public authentication endpoints using `@Throttle` from `@nestjs/throttler`:
  - `POST /api/v1/auth/login`: 5 requests per 60 seconds.
  - `POST /api/v1/auth/register`: 5 requests per 60 seconds.
  - `POST /api/v1/auth/forgot-password`: 3 requests per 60 seconds.
  - `POST /api/v1/auth/reset-password`: 5 requests per 60 seconds.
- Ensure `app.set('trust proxy', 1)` is enabled in `backend/src/main.ts` so rate limiters inspect true client IPs behind reverse proxies and CDNs.

### 4.5 Mobile Token Persistence

- On mobile devices (`app/`), store tokens exclusively in hardware-backed keychains using `TokenStorage` (`app/services/storage/token.storage.ts`), backed by `expo-secure-store` with `KeychainAccessibility.AFTER_FIRST_UNLOCK`.
- **Prohibition**: **NEVER** store JWT access tokens, refresh tokens, or user passwords in plain `AsyncStorage` or unencrypted SQLite files.

---

## 5. Authorization & IDOR Prevention

Authorization must be verified for every protected endpoint and at every architectural layer.

### 5.1 The Client-Identity Trust Invariant

- **NEVER trust client-supplied user identifiers**: Never accept `userId` from request bodies, query strings, or client headers to identify the actor.
- **Always extract caller identity from verified JWT claims**:
  ```typescript
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @CurrentUser('sub') userId: string,
    @Param('id') cardId: string,
    @Body() dto: UpdateCardDto,
  ) {
    return this.cardsService.update(userId, cardId, dto);
  }
  ```

### 5.2 Resource Ownership Enforcement in Services

Every read, update, or delete operation must enforce that the target resource belongs to the authenticated caller:

```typescript
// GOOD: Scope database query directly to the user's ID
const card = await this.prisma.businessCard.findFirst({
  where: { id: cardId, userId },
});

// Shielding resource existence from attackers:
if (!card) {
  throw new NotFoundException(`Card with ID ${cardId} not found`);
}
```

### 5.3 404 vs. 403 Information Shielding

- Throw `NotFoundException` (`404`) instead of `ForbiddenException` (`403`) when a user attempts to access a resource they do not own.
- Throwing `403 Forbidden` reveals that the resource ID exists, allowing malicious actors to enumerate valid UUIDs across the platform.

---

## 6. Data Protection & Secrets Zero-Leak Invariant

Sensitive credentials and private internal states must never leave secure boundaries.

### 6.1 Data Classifications to Protect:

- **Credentials**: Passwords, Argon2 hashes (`passwordHash`), refresh token hashes (`hashedRefreshToken`).
- **Keys & Tokens**: JWT secret keys (`JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`), Cloudflare R2 access keys.
- **Infrastructure**: Database URLs with embedded credentials (`DATABASE_URL`, `DIRECT_URL`).
- **Private User Data**: Contact phone numbers, email addresses, and unverified onboarding flags.

### 6.2 Zero-Leak DTO Mapping

- **NEVER return raw database models directly from controllers**:
  - ❌ `return this.prisma.user.findUnique(...)` (Leaks `passwordHash` and `hashedRefreshToken`).
  - ✅ Always transform entities through explicit mappers (`toUserDto`, `toCardDto`) that omit private columns.

### 6.3 Secrets Management Standards

1. **Zero Hardcoded Secrets**: Secrets must never be committed to source control.
2. **Repository Protection**: Verify `.env` is listed in `.gitignore` and never committed (Rule #20 of `AGENTS.md`).
3. **Safe Documentation Placeholders**: Never document real keys. Use standardized placeholders:
   - `postgresql://postgres:postgres@localhost:5432/veya?schema=public`
   - `your-super-secret-jwt-access-key-here`
4. **Log Sanitization**: Never log passwords, authorization headers, or database connection strings containing passwords.

---

## 7. Input Hardening & File Upload Security

All data crossing trust boundaries must be strictly validated and sanitized.

### 7.1 Input Validation & Anti-Pollution

- **Global Validation Pipe**: `backend/src/main.ts` configures:
  ```typescript
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  });
  ```
  Any extra, unmodeled properties sent by attackers (e.g. attempting mass assignment of `onboardingCompleted` or `providerId`) are rejected immediately with HTTP 400.
- **SQL Injection Defense**: Use Prisma ORM parameterized queries exclusively. Never use template literal string interpolation in raw queries.
- **Identifier Validation**: Route parameters (e.g. `:id`) should be validated as valid UUIDs.

### 7.2 File Upload & Media Hardening (Cloudflare R2)

File uploads are high-risk attack surfaces (Stored XSS, remote code execution, server-side request forgery).

- **Strict Size Limits**: Enforce `MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024` (5 MB) in both controller limits and buffer validation.
- **Binary Magic-Byte Inspection**:
  - Never trust the client-supplied `Content-Type` header or file extension.
  - Inspect initial buffer bytes via `detectImageSignature(buffer)` in `backend/src/storage/file-validation.util.ts`.
  - Whitelist only true image formats: `jpeg`, `png`, and `webp`.
- **Anti-XSS Invariant (SVG Rejection)**:
  - SVG and XML files can embed executable `<script>` tags, leading to Stored Cross-Site Scripting when served from domains sharing cookies or storage.
  - **Explicitly reject SVG, XML, HTML, and executables** (checked via byte inspection and text headers).
- **Safe Namespacing & Path Traversal Defense**:
  - Sanitize all user IDs and filenames before generating S3/R2 keys:
    ```typescript
    const safeUserId = userId.replace(/[^a-zA-Z0-9_-]/g, '');
    const key = `users/${safeUserId}/companylogo/logo-${Date.now()}.${extension}`;
    ```
  - Eliminates directory traversal (`../`) attacks.

---

## 8. Security Severity Classification

When evaluating security issues or triaging audit findings, classify severity according to this rubric:

| Severity          | Exploitability & Impact                                                                              | Examples in Veya                                                                                                                                               |
| :---------------- | :--------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Critical**      | Unauthenticated remote code execution, credential exposure, or total authentication bypass.          | Hardcoded production database credentials, unauthenticated password reset without token, arbitrary file write to server filesystem.                            |
| **High**          | Horizontal privilege escalation (IDOR), Stored XSS, or unauthorized cross-tenant data modification.  | Updating or deleting another user's business card by guessing its UUID, uploading active SVG containing XSS scripts, leaking password hashes in API responses. |
| **Medium**        | Missing rate limiting on sensitive routes, information leakage of user metadata, weak CORS policies. | Email enumeration via login response differences, unthrottled password reset triggering email flooding, permissive CORS wildcard `*` in production.            |
| **Low**           | Non-sensitive information disclosure, missing non-critical security headers.                         | Stack traces exposed in local development mode, minor HTTP header misconfigurations.                                                                           |
| **Informational** | Defense-in-depth improvements, hardening recommendations.                                            | Upgrading hash parameters, adding additional audit logging for security events.                                                                                |

---

## 9. Security Review Workflow

Before merging any security-sensitive pull request or feature, execute this systematic 8-step review:

```text
Step 1: IDENTIFY ASSETS
        Enumerate all sensitive data and capabilities touched by the change.
           ↓
Step 2: IDENTIFY ATTACKERS
        Consider both unauthenticated attackers and authenticated malicious users.
           ↓
Step 3: IDENTIFY TRUST BOUNDARIES
        Map inputs crossing from client to controller, service, or external storage.
           ↓
Step 4: INSPECT ATTACK SURFACES
        Examine route parameters, request payloads, headers, and file streams.
           ↓
Step 5: TEST ABUSE CASES
        Attempt forbidden actions: access resource without auth, access another user's card ID,
        send unexpected JSON properties, upload an SVG with script tags.
           ↓
Step 6: IMPLEMENT MITIGATION
        Apply guards, ownership checks, magic-byte validators, and DTO decorators.
           ↓
Step 7: REGRESSION TEST (security + testing)
        Author automated Jest unit/integration tests asserting that the abuse case is blocked.
           ↓
Step 8: VERIFY
        Run typecheck, linter, test suites, and build verification.
```

---

## 10. Verification Protocol

Before declaring security engineering work complete, execute the full verification sequence:

### 1. Security Regression & Unit Tests:

```bash
pnpm --filter @veya/backend test
```

Verify tests covering authorization, ownership checks, throttler limits, and file validation.

### 2. Static Analysis & Typecheck:

```bash
pnpm --filter @veya/backend typecheck
pnpm --filter @veya/app typecheck
```

### 3. Linter & Formatting Checks:

```bash
pnpm --filter @veya/backend lint
pnpm --filter @veya/app lint
pnpm format:check
```

### 4. Git Secrets Cleanliness Check:

```bash
git status --porcelain
```

Ensure no `.env`, local credential files, or secret keys are tracked in git.

Never declare a system secure merely because no obvious issue was found.
