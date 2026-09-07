---
name: database
description: >-
  PostgreSQL database architecture, Prisma schema modeling, safe migrations,
  and query performance in Veya. Use when modifying backend/prisma/schema.prisma,
  running Prisma migrations, designing relations, indexes, transactions, or optimizing queries.
---

# Database Engineering Skill for Veya

This skill defines the technical standards, schema conventions, migration safety frameworks, transaction rules, and query optimization guidelines for Veya's database layer (`backend/prisma/`), built with PostgreSQL and Prisma Client 6.4.

This skill is **exclusively responsible for database engineering**:

- PostgreSQL schema modeling and Prisma DSL
- Schema migrations and staged refactoring
- Indexes, foreign keys, and unique constraints
- Transaction boundaries and concurrency isolation
- Query design, N+1 prevention, and database performance
- Data integrity invariants across database and application layers

Do not turn this skill into a general backend skill. For controller routing, NestJS module architecture, and business service implementation, activate `backend-development`.

---

## 1. Core Principle: Defense-in-Depth Data Integrity

The database is the ultimate guardian of data correctness. Application code can have bugs, race conditions, or unhandled exceptions, but the database schema must guarantee that invalid, orphaned, or corrupted states are structurally impossible to persist.

### The 6 Data Integrity Reasoning Questions

Before adding or modifying any database model, field, constraint, or query, every engineer and AI agent must answer:

1. **What invalid states are possible?**
   - _Example_: Multiple business cards marked as default for a single user, orphaned cards without an owning user, duplicate emails, or negative counters.
2. **Can the database prevent them?**
   - _Example_: Enforce foreign keys with `onDelete: Cascade`, add `@unique` constraints, or apply PostgreSQL partial unique indexes (`WHERE is_default = true`).
3. **Does this invariant belong in the database, application, or both?**
   - _Rule_: Hard invariants belong in the database first (as constraints), with user-friendly conflict detection and validation handled gracefully in the application service.
4. **Can concurrent requests violate the invariant?**
   - _Rule_: Application-level checks (`findFirst` followed by `create`) will race under concurrent load. Only atomic database constraints or transaction locks provide absolute protection.
5. **Does this operation require a transaction?**
   - _Rule_: If an operation updates multiple rows or depends on intermediate state consistency, wrap it in an atomic transaction.
6. **What happens if step 2 succeeds but step 3 fails?**
   - _Rule_: If partial execution leaves corrupted state, the entire operation must be executed inside `prisma.$transaction`.

---

## 2. When to Use & Skill Boundaries

### Activate this skill when:

- Creating or modifying models in `backend/prisma/schema.prisma`.
- Writing, reviewing, or applying database migrations in `backend/prisma/migrations/`.
- Adding indexes (`@@index`), unique constraints (`@unique`), or relations (`@relation`).
- Designing multi-step database transactions in backend services.
- Diagnosing database connection pool issues or Prisma query performance bottlenecks.
- Generating Prisma Client bindings (`pnpm --filter @veya/backend prisma:generate`).

### Cross-Skill Boundaries:

- **Backend Service Implementation (`database + backend-development`)**:
  When mapping Prisma models to DTOs or injecting `PrismaService` into feature services, coordinate with `backend-development`.
- **Database Testing & Mocking (`database + testing`)**:
  When authoring unit tests that mock `PrismaService` or running integration tests against a database, coordinate with `testing`.

---

## 3. Pre-Implementation Inspection Protocol

Before touching database definitions, execute this inspection sequence:

1. **Inspect `AGENTS.md`**:
   - Rule #8: Database access via Prisma must be encapsulated inside services. No direct database calls from controllers.
2. **Inspect Complete Prisma Schema**:
   - Read `backend/prisma/schema.prisma` in full. Check existing model structures, relations, field decorators, and datasource configuration.
3. **Inspect Existing Migrations**:
   - Review `backend/prisma/migrations/` to understand existing migration history, partial indexes, and database evolution.
4. **Inspect Prisma Configuration & Runtime Service**:
   - Check `backend/src/prisma/prisma.service.ts`:
     - Inspect connection pooling via `DATABASE_URL` (client queries) vs. direct migrations via `DIRECT_URL`.
     - Inspect strict startup logic in production (`PRISMA_STRICT_STARTUP`).
5. **Inspect Affected Services**:
   - Verify how services (`cards.service.ts`, `users.service.ts`, `auth.service.ts`) interact with the affected models.
6. **Inspect Package Scripts**:
   - Verify active scripts in `backend/package.json` (`prisma:generate`, `prisma:studio`, `typecheck`, `test`).

---

## 4. Schema Design Standards

### 4.1 Naming Conventions (Non-Negotiable)

| Concept               | Convention                  | Example                                                 | Rule                                                       |
| :-------------------- | :-------------------------- | :------------------------------------------------------ | :--------------------------------------------------------- |
| **Prisma Model**      | PascalCase (singular)       | `User`, `BusinessCard`                                  | Must map to plural snake_case table via `@@map`.           |
| **Prisma Field**      | camelCase                   | `avatarUrl`, `isDefault`, `phoneNumber`                 | Multi-word fields must have explicit `@map("snake_case")`. |
| **Database Table**    | snake_case (plural)         | `@@map("users")`, `@@map("business_cards")`             | Mandatory on every model.                                  |
| **Database Column**   | snake_case                  | `@map("avatar_url")`, `@map("created_at")`              | Mandatory on every non-single-word column.                 |
| **Foreign Key Field** | camelCase ending in `Id`    | `userId String @map("user_id")`                         | Must have explicit `@map` and `@@index`.                   |
| **Index Names**       | snake_case ending in `_idx` | `@@index([userId], name: "business_cards_user_id_idx")` | Descriptive naming.                                        |

### 4.2 Primary Keys & Identifiers

- **Always use UUID strings** for primary keys to prevent ID enumeration attacks and enable client-side UUID generation:
  ```prisma
  id String @id @default(uuid())
  ```
- Never use auto-incrementing sequential integers for public-facing business entities.

### 4.3 Timestamps & Auditing

Every table must include standard, immutable audit timestamps:

```prisma
createdAt DateTime @default(now()) @map("created_at")
updatedAt DateTime @updatedAt @map("updated_at")
```

### 4.4 Nullability & Defaults

- **Prefer explicit nullability**: Use `?` only when a field is truly optional (e.g. `slogan String?`, `avatarUrl String?`).
- **Use meaningful defaults**:
  - Booleans: Always provide default values (e.g. `isDefault Boolean @default(false) @map("is_default")`).
  - Colors: Provide safe hex defaults (e.g. `primaryColor String? @default("#111111") @map("primary_color")`).
- **Never make a new field required on an existing model** without a default value, or existing rows will cause migration failure.

### 4.5 Relationships & Cascade Behaviors

- **Always define explicit `@relation` attributes**:
  ```prisma
  userId String   @map("user_id")
  user   User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  ```
- **Cascade Rules**:
  - `onDelete: Cascade`: When child records cannot exist without the parent (e.g., `BusinessCard` records belonging to a deleted `User`).
  - `onDelete: Restrict`: When deleting a parent entity must be blocked if active dependent records exist (e.g., preventing organization deletion if cards exist).
  - `onDelete: SetNull`: When child records should survive parent deletion with an unlinked foreign key (only valid if foreign key is nullable `String?`).

### 4.6 Indexing Standards (Require Reasoning)

Do **NOT** add indexes blindly. Every index incurs write overhead and memory consumption:

- **Foreign Keys**: Always index foreign keys to optimize joins and cascading deletes:
  ```prisma
  @@index([userId])
  ```
- **Compound Query Indexes**: Index fields that are frequently filtered and sorted together:
  ```prisma
  @@index([userId, isDefault])
  ```
- **Unique Lookups**: Use `@unique` for naturally unique identifiers:
  ```prisma
  email String @unique
  ```
- **Partial Unique Indexes**: When uniqueness applies only under specific conditions (e.g. at most one default card per user), define a partial unique index in migration SQL:
  ```sql
  CREATE UNIQUE INDEX IF NOT EXISTS "business_cards_user_default_unique"
  ON "business_cards"("user_id")
  WHERE ("is_default" = true);
  ```

---

## 5. Migration Safety Decision Framework

Every proposed schema change must be classified into one of the following risk tiers before execution:

```text
Schema Change Classification:
├─ [ADDITIVE] ───────────────> Non-breaking. Apply migration immediately.
│  Examples: New model, new nullable field, new field with @default, new index.
│
├─ [BACKWARD-COMPATIBLE] ────> Non-breaking with app sync.
│  Examples: Adding nullable relation, relaxing a constraint.
│
├─ [POTENTIALLY DESTRUCTIVE] > Requires data audit before migration.
│  Examples: Adding non-null field without default, adding @unique to existing table.
│  Action: Verify zero nulls or duplicates exist in database first.
│
├─ [DATA-TRANSFORMING] ──────> Requires programmatic backfill script.
│  Examples: Splitting fields, changing column data formats.
│  Action: Use staged migration strategy.
│
└─ [BREAKING / DESTRUCTIVE] ─> High risk. Strictly staged over multiple deployments.
   Examples: Dropping column/table, renaming column/table, narrowing data types.
   Action: MANDATORY 6-step staged migration strategy.
```

### 5.1 The 6-Step Staged Migration Strategy (For Renames & Removals)

Never drop or rename a column or table in a single migration. Always execute across multiple safe deployments:

```text
Step 1: ADD
        Add the new column as nullable or with a default. Deploy migration.
           ↓
Step 2: DUAL-WRITE
        Update application code to write to BOTH old and new columns,
        reading from the old column with fallback to new. Deploy app.
           ↓
Step 3: BACKFILL
        Run a verified migration script to copy existing data from old to new column.
           ↓
Step 4: SWITCH READS
        Update application code to read and write exclusively using the new column. Deploy app.
           ↓
Step 5: VERIFY
        Verify application telemetry, logs, and database metrics over a burn-in period.
           ↓
Step 6: REMOVE
        Drop the old column in a final, standalone cleanup migration.
```

---

## 6. Production Safety & Prohibited Operations

### Absolute Prohibitions (NEVER DO):

1. **NEVER run `prisma migrate reset`** in production, staging, or shared database environments. This drops the database and destroys all data.
2. **NEVER run `prisma db push --force-reset`**.
3. **NEVER drop production tables or columns** without an approved, staged migration plan.
4. **NEVER point test scripts or local development commands at production databases**. Verify that `DATABASE_URL` does not point to production hostnames.
5. **NEVER commit real credentials or production connection strings**. Always use environment variable interpolation (`env("DATABASE_URL")`).
6. **NEVER execute unparameterized raw SQL**: Always use tagged templates `$queryRaw` or parameterized `$executeRaw`. Never concatenate strings into `$queryRawUnsafe`.

---

## 7. Transactions & Concurrency Isolation

### 7.1 When Transactions Are Required

Wrap operations in `prisma.$transaction(async (tx) => { ... })` when:

- **Multiple Writes Must Succeed Atomically**: Creating a user and their initial default business card.
- **Invariant Preservation Across Multiple Rows**: Unsetting prior default cards before designating a new default card:
  ```typescript
  return await this.prisma.$transaction(async (tx) => {
    if (dto.isDefault) {
      await tx.businessCard.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    return tx.businessCard.create({
      data: { userId, ...dto },
    });
  });
  ```
- **Dependent State Transitions**: Where a failure in step 2 leaves step 1 in a corrupted, inconsistent state.

### 7.2 When Transactions Are Unnecessary

Do **NOT** use transactions for:

- Single atomic writes (`prisma.user.update`, `prisma.businessCard.create`). Single statements in PostgreSQL are already atomic.
- Read-only operations (`findUnique`, `findMany`).
- Independent operations where eventual consistency or individual failure is acceptable.

### 7.3 Transaction Hygiene Rules

- **Keep Transactions Extremely Short (< 100ms)**: Hold database locks for the absolute minimum time possible to prevent connection pool exhaustion and lock contention.
- **NEVER perform external network calls inside a transaction**:
  - ❌ NEVER call Cloudflare R2 (`uploadBuffer`, `uploadUserFile`).
  - ❌ NEVER perform HTTP requests to third-party APIs.
  - ❌ NEVER execute CPU-heavy password hashing (`argon2.hash`).
  - ✅ Hash passwords and upload images _before_ opening the transaction.

---

## 8. Query Design & Database Performance

### 8.1 N+1 Query Prevention

Never execute database queries inside application loops:

```typescript
// BAD: N+1 queries (1 query for cards + N queries for users)
const cards = await this.prisma.businessCard.findMany({ where: { userId } });
for (const card of cards) {
  card.user = await this.prisma.user.findUnique({ where: { id: card.userId } });
}

// GOOD: Single joined query using relation eager loading
const cards = await this.prisma.businessCard.findMany({
  where: { userId },
  include: {
    user: {
      select: { name: true, email: true, avatarUrl: true },
    },
  },
});
```

### 8.2 Selective Projections (`select`)

Avoid fetching unnecessary columns, especially large text fields, tokens, or hashed credentials:

```typescript
// GOOD: Retrieve only required attributes
const user = await this.prisma.user.findUnique({
  where: { id: userId },
  select: {
    id: true,
    email: true,
    name: true,
    avatarUrl: true,
  },
});
```

### 8.3 Mandatory Bounded Queries

Never issue unbounded queries on scalable collections:

```typescript
// BAD: Potential memory exhaustion and slow query
await this.prisma.businessCard.findMany({ where: { userId } });

// GOOD: Strictly bounded query with safe defaults
const safeLimit = Math.min(Math.max(limit || 20, 1), 100);
await this.prisma.businessCard.findMany({
  where: { userId },
  take: safeLimit,
  skip: offset || 0,
  orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
});
```

### 8.4 Catching & Mapping Prisma Errors

Backend services must catch specific Prisma errors and map them to standard HTTP exceptions:

- **`P2002` (Unique constraint violation)**: Map to `ConflictException` (e.g. duplicate email or default card concurrency collision).
- **`P2025` (Record not found for operation)**: Map to `NotFoundException`.
- **`P2003` (Foreign key constraint violation)**: Map to `BadRequestException`.

---

## 9. Verification Protocol

Before declaring database changes complete, execute the full verification sequence:

### 1. Prisma Client Generation & Schema Validation

```powershell
pnpm --filter @veya/backend prisma:generate
```

Ensure the generated client compiles without schema syntax errors.

### 2. Inspect Generated SQL Migration

When creating a new migration, always inspect the generated `migration.sql` file before applying:

- Verify table and column names match snake_case mapping.
- Verify indexes and foreign keys are created properly.
- Verify no accidental `DROP TABLE` or `DROP COLUMN` statements exist.

### 3. Backend Typecheck

```powershell
pnpm --filter @veya/backend typecheck
```

Verify that Prisma model changes compile cleanly against all feature services and DTO mappers.

### 4. Backend Unit & Integration Tests

```powershell
pnpm --filter @veya/backend test
```

Verify that existing Prisma mocks, concurrency tests, and database transactions pass.

### 5. Backend Lint & Monorepo Format Check

```powershell
pnpm --filter @veya/backend lint
pnpm format:check
```

Never claim a database change or migration is safe without running tests and inspecting the generated SQL.
