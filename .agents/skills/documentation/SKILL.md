---
name: documentation
description: >-
  Production-quality documentation engineering standards, API specification guidelines,
  domain terminology rules, and AI agent skill authoring in Veya. Use when writing,
  reviewing, or synchronizing READMEs, architecture notes, OpenAPI/Swagger annotations,
  agent skills, environment schemas, setup guides, troubleshooting documents, or inline comments.
---

# Documentation Engineering Skill for Veya

This skill defines the technical standards, authoring rules, and verification workflows for documentation across the Veya monorepo (`@veya/backend`, `@veya/app`, `@veya/shared`).

This skill is **exclusively responsible for documentation**.

---

## 1. Core Principle: Documentation Must Describe Reality

Documentation is an accurate mirror of active, verified code. Speculative, aspirational, or outdated documentation is worse than no documentation because it misleads developers and AI agents.

### The Reality-First Invariants

- **Active State Only**: Document what the system _currently does_, not what it _might do_ in the future.
- **Single Source of Truth**: When documentation conflicts with verified code, the verified code represents reality; update the documentation to match or fix the bug in code if intentional.
- **Zero Hallucination**: Never invent configuration options, scripts, or architectural layers.

### Negative Invariants — Never Document:

- **Assumed Behavior**: Never document behavior inferred from naming alone without inspecting the implementation.
- **Intended Future Behavior as Current Reality**: `frontend/` is reserved for a future Next.js web application (Rule #29 of `AGENTS.md`). Never document it as an active web client.
- **Outdated Architecture**: Never document deprecated endpoints, removed database tables, or discarded abstractions.
- **Unverified APIs**: Never document routes, query parameters, or payload shapes without inspecting the controller and DTO definitions.
- **Invented Configuration**: Never document environment variables that are not declared in `backend/src/config/env.validation.ts` or `.env.example`.
- **Nonexistent Files**: Never reference files, directories, or scripts that do not exist in the repository.

---

## 2. Required 7-Step Inspection & Authoring Workflow

Before authoring or updating any documentation, execute this deterministic 7-step sequence:

```text
1. Inspect existing documentation
   ↓
2. Inspect actual implementation
   ↓
3. Inspect relevant configuration
   ↓
4. Inspect API / schema contracts
   ↓
5. Identify inconsistencies & drift
   ↓
6. Update documentation
   ↓
7. Verify links, commands, and examples
```

### Step 1: Inspect Existing Documentation

- Locate the document to update (`README.md`, `AGENTS.md`, `.agents/skills/<name>/SKILL.md`, or inline docstrings).
- Identify existing conventions, target audience, and scope.

### Step 2: Inspect Actual Implementation

- Read the relevant source files:
  - Backend controllers, services, guards: `backend/src/`
  - Mobile screens, components, hooks: `app/`
  - Shared contracts and schemas: `packages/shared/src/`

### Step 3: Inspect Relevant Configuration

- Verify environment variable requirements in `.env.example` and validation rules in `backend/src/config/env.validation.ts`.
- Verify runtime scripts in `package.json` (monorepo root and package-level `package.json` files).

### Step 4: Inspect API / Schema Contracts

- Verify database models in `backend/prisma/schema.prisma`.
- Verify request DTOs in `backend/src/<feature>/dto/` and shared DTOs in `packages/shared/src/`.
- Verify NestJS Swagger setup in `backend/src/main.ts` (`/api/docs`).

### Step 5: Identify Inconsistencies & Drift

- Compare existing documentation against active code.
- Flag phantom endpoints, renamed fields, removed parameters, or outdated command flags.

### Step 6: Update Documentation

- Apply edits using precise, concise, and technically accurate language.
- Maintain repository-relative paths and safe credential placeholders.

### Step 7: Verify Links, Commands, and Examples

- Ensure all relative links point to real files.
- Test that every code example and shell command executes cleanly against current dependencies.

---

## 3. Standards Across Documentation Types

### 3.1 README Files (`README.md`)

README files serve as entry points for developers and agents.

- **Root `README.md`**:
  - Project identity and high-level purpose ("Digital identity, simplified").
  - Monorepo directory map (`app/`, `backend/`, `frontend/`, `packages/shared/`).
  - Prerequisites with minimum supported versions (Node.js >= 20, pnpm >= 9).
  - Quickstart commands (`pnpm install`, `cp .env.example .env`, `pnpm dev`, `pnpm dev:app`).
  - Core service URLs (API: `http://localhost:3000/api/v1`, Swagger: `http://localhost:3000/api/docs`, Health: `http://localhost:3000/api/v1/health`).
- **Package READMEs** (`backend/README.md`, `app/README.md`):
  - Focus strictly on package-specific setup, test execution, and architecture.
  - Do not duplicate root-level repository policies.

### 3.2 Architecture Documentation

Architecture documents explain structural decisions, system boundaries, and data flow.

- **Boundary Enforcement**:
  - Explicitly document directory roles (e.g., `frontend/` is reserved; do not create files there).
  - Document package boundaries: `packages/shared/` contains only platform-agnostic types, schemas, and utilities—never NestJS services or React Native components (Rule #14 of `AGENTS.md`).
- **Data Flow & Dependency Rules**:
  - Flow direction: `UI -> Feature Hooks -> API Service -> Backend Controller -> Service -> Prisma -> PostgreSQL`.
  - Ban circular dependencies (Rule #15 of `AGENTS.md`).
- **Diagrams**:
  - Use GitHub-flavored Mermaid diagrams to illustrate component relationships and data lifecycles.

### 3.3 API Documentation

Every REST API endpoint in Veya must have complete, verified documentation:

- **Base Path**: All backend routes use prefix `/api/v1/` (configured in `backend/src/main.ts`).
- **HTTP Methods**: Semantically accurate (`GET` for retrieval, `POST` for creation, `PATCH` for partial updates, `DELETE` for removal).
- **Authentication**: Indicate whether `Bearer <access_token>` is required via `JwtAuthGuard`.
- **Request Parameters**: Document route params (e.g., `:id`), query parameters (e.g., `?search=`), and headers.
- **Request Body**: Reference the exact DTO class with field types, optionality, and validation rules.
- **Response Schemas**: Document HTTP 200/201 response bodies using shared DTOs (`BusinessCardDto`, `UserDto`).
- **Error Responses**: Document expected error status codes (`400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `409 Conflict`, `429 Too Many Requests`).

### 3.4 Swagger / OpenAPI Specifications

NestJS backend controllers are the single source of truth for the OpenAPI specification generated at `/api/docs`.

#### Swagger Annotation Invariants:

1. Every controller class must have `@ApiTags('feature-name')`.
2. Every authenticated endpoint or controller must have `@ApiBearerAuth()`.
3. Every route handler must declare `@ApiOperation({ summary: '...' })`.
4. Every route handler must declare explicit `@ApiResponse()` decorators for success and failure codes.
5. Every field in a request DTO must have `@ApiProperty()` or `@ApiPropertyOptional()` matching its `class-validator` rules.

#### Canonical Swagger Controller Example:

```typescript
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { BusinessCardDto } from '@veya/shared';

@ApiTags('cards')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new digital business card' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Card created successfully',
    type: BusinessCardDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Validation failed' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Missing or invalid JWT token' })
  async create(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateCardDto,
  ): Promise<BusinessCardDto> {
    const card = await this.cardsService.create(userId, dto);
    return this.cardsService.toCardDto(card);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a card by ID' })
  @ApiParam({ name: 'id', description: 'Unique Card UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Card details',
    type: BusinessCardDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Card not found or access denied' })
  async findOne(
    @CurrentUser('sub') userId: string,
    @Param('id') id: string,
  ): Promise<BusinessCardDto> {
    const card = await this.cardsService.findOne(userId, id);
    return this.cardsService.toCardDto(card);
  }
}
```

### 3.5 Environment Documentation

Environment variables must be documented in `.env.example` and validated at runtime:

1. **`.env.example`**: Keep up to date with clear, commented sections. Every variable must have a safe placeholder.
2. **`backend/src/config/env.validation.ts`**: All backend environment variables must be declared in `EnvironmentVariables` class with `class-validator` decorators (`@IsString()`, `@IsNumber()`, `@IsEnum()`, `@IsOptional()`).
3. **Expo Mobile Config**: Document mobile public variables (`EXPO_PUBLIC_API_URL`) in `app/` documentation.

### 3.6 AI-Agent Skills (`.agents/skills/<name>/SKILL.md`)

Skills guide AI agents through specialized workflows. See [Section 5](#5-ai-agent-documentation-standards) for the complete engineering standard.

### 3.7 Setup Guides

Setup guides must provide unambiguous step-by-step instructions:

- **Prerequisites**: Exact runtime versions (Node.js, pnpm, PostgreSQL, Expo Go).
- **Environment Bootstrapping**:
  ```bash
  # 1. Install dependencies
  pnpm install

  # 2. Configure environment
  cp .env.example .env

  # 3. Initialize database
  pnpm --filter @veya/backend prisma:generate
  pnpm --filter @veya/backend prisma:migrate:dev

  # 4. Start backend
  pnpm dev:backend

  # 5. Start mobile app
  pnpm dev:app
  ```
- **Physical Device Networking**: Document that physical phones running Expo Go cannot reach `localhost`. Instruct developers to configure their workstation's LAN IP (e.g., `EXPO_PUBLIC_API_URL=http://192.168.1.X:3000/api/v1`).

### 3.8 Troubleshooting Documentation

Troubleshooting documents must follow a strict, diagnostic incident structure:

```markdown
### [Problem Title / Symptom]

- **Observed Symptom**: Exact error message, HTTP status code, or log output.
- **Root Cause**: The underlying technical issue (e.g., LAN IP unreachable from Expo Go, Prisma schema migration mismatch).
- **Diagnostic Commands**: How to confirm the issue (e.g., `curl -I http://<LAN_IP>:3000/api/v1/health`).
- **Verified Resolution**: Concrete steps to resolve the issue.
```

### 3.9 Business Workflows

Business workflows document end-to-end domain lifecycles in Veya:

- **Card Lifecycle**: Creation -> Default card assignment/unsetting (`isDefault`) -> Public slug resolution (`/cards/slug/:slug`) -> vCard export (`/cards/:id/vcard`).
- **Authentication Lifecycle**: Registration -> JWT access token (15m expiry) + refresh token (7d expiry in HTTP-only cookie or secure store) -> Token refresh rotation (`/auth/refresh`) -> Invalidation on logout.
- **Media Asset Storage**: Client image selection -> Client-side size validation (< 5MB) -> NestJS upload endpoint -> Cloudflare R2 object storage -> Public CDN URL generation.
- **Card Scanner Flow**: Camera barcode/QR scan -> Slug extraction -> Backend lookup (`/cards/slug/:slug`) -> Card profile presentation.

### 3.10 Inline Comments (Rule #23 of `AGENTS.md`)

- **Explain the "Why", Never the "What"**:
  ```typescript
  // BAD: Explaining what the code visibly says
  // Check if card is default
  if (card.isDefault) { ... }

  // GOOD: Explaining the non-obvious business constraint or rationale
  // If the user marks this card as default, unmark all other cards owned
  // by this user within an atomic transaction to ensure exactly one default card.
  ```
- **Document Quirks and Non-Obvious Constraints**:
  - External API oddities (Cloudflare R2 S3 SDK multipart peculiarities).
  - Platform-specific workarounds (Expo SecureStore size limits on Android).
  - Rate-limiting rules and security invariants.
- **Never Leave Dead Code**:
  - Do not comment out blocks of unused code. Delete them. Version control preserves history.

---

## 4. Documentation Decision Rules

When deciding whether, where, and how to document, apply these decision rules:

```text
Decision Matrix:
├─ Is it a self-explanatory variable, function, or type?
│  └─ YES ──> DO NOT COMMENT. Use descriptive naming.
│
├─ Does it explain a non-obvious "Why", constraint, or platform quirk in code?
│  └─ YES ──> USE AN INLINE COMMENT directly in the source file.
│
├─ Does it enforce a universal, repo-wide rule for all developers & agents?
│  └─ YES ──> ADD TO AGENTS.md (keep concise).
│
├─ Is it a specialized, domain-specific operational workflow or engineering guide?
│  └─ YES ──> CREATE OR UPDATE A SKILL in .agents/skills/<name>/SKILL.md.
│
├─ Is it a REST endpoint, request payload, or response contract?
│  └─ YES ──> USE NESTJS SWAGGER ANNOTATIONS (@ApiOperation, @ApiResponse, DTOs).
│
├─ Can this information be expressed natively in TypeScript types or validators?
│  └─ YES ──> PUT IT IN CODE (Zod schema, DTO with class-validator), not prose.
│
└─ Does a document already exist for this topic (e.g. README.md, existing skill)?
   ├─ YES ──> UPDATE THE EXISTING DOCUMENT. Avoid duplicate docs.
   └─ NO  ──> CREATE A DEDICATED DOCUMENT only if the topic is a distinct system > 3 paragraphs.
```

### 4.1 When Documentation Is Necessary

- Public API surfaces and controller contracts.
- Architectural boundaries and module dependency rules.
- Local development onboarding and environment bootstrapping.
- Non-obvious domain rules (e.g., default card exclusivity, token refresh rotation).
- Disaster recovery, migrations, and troubleshooting playbooks.

### 4.2 When a Comment Is Unnecessary

- Code that explains itself through clear names:
  ```typescript
  // BAD: Redundant comment
  // Get user by id
  getUserById(id: string)
  ```
- Restating framework lifecycle methods (`// Constructor`, `// Component mount`).
- Commenting out deprecated or unused code.

### 4.3 When to Create a Dedicated Document vs. Update an Existing One

- **Update Existing**: If extending a feature, altering an API contract, or refining a workflow that already has a designated file (`README.md`, `.env.example`, existing skill), update that file.
- **Create Dedicated**: Create a new document only when introducing a major, distinct subsystem (e.g., an entirely new service or workflow) that cannot logically fit into existing documentation without causing bloat.

### 4.4 When to Use a Skill Instead of `AGENTS.md`

- **`AGENTS.md`**: Global, universal, repository-wide rules that apply to _every_ interaction (e.g., feature-based directory structure, PascalCase for React components, no code in `frontend/`).
- **Skill (`.agents/skills/<name>/SKILL.md`)**: Domain-specific, deep-dive operational guides activated _on demand_ (e.g., `database` for Prisma migrations, `testing` for Jest mocks, `documentation` for documentation engineering).

### 4.5 When Information Belongs in Code Rather Than Documentation

- Field types, nullability, and string formats belong in TypeScript types and `class-validator` DTOs.
- Validation constraints (e.g. `min: 1`, `max: 100`, regex patterns) belong in DTO decorators or Zod schemas.
- Default configuration values belong in configuration objects, not scattered across text files.

---

## 5. AI-Agent Documentation Standards (`.agents/skills/`)

Skills inside `.agents/skills/` are machine-readable instruction manuals for AI coding agents. They must be engineered with the same rigor as production software.

### 5.1 Skill File Structure

Every skill resides in `.agents/skills/<skill-name>/SKILL.md` and must contain:

```markdown
---
name: skill-name
description: >-
  Actionable summary of what the skill covers and explicit activation triggers.
---

# Skill Title for Veya

One-sentence overview of scope and purpose.

---

## 1. Purpose

Why this skill exists and what high-level outcomes it guarantees.

---

## 2. When to Use

Unambiguous triggers defining when an agent MUST activate this skill.

---

## 3. Pre-Task Inspection Protocol

Numbered, step-by-step inspection checklist before modifying files.

---

## 4. Technical Rules & Conventions

Imperative guidelines organized by subcategory, accompanied by BAD vs GOOD examples.

---

## 5. Decision Criteria & Boundaries

What is in-scope, what is out-of-scope, and concrete branch choices.

---

## 6. Prohibited Behaviors

Explicit negative constraints ("NEVER do X").

---

## 7. Verification Checklist

Deterministic checklist of checks, linters, and tests before finishing the task.
```

### 5.2 Guidelines for Authoring Agent Skills

- **Use Imperative, Explicit Rules**: Write `MUST`, `MUST NOT`, `NEVER`, `ALWAYS`. Avoid passive or advisory suggestions ("consider doing", "it might be good to").
- **Specify Activation Conditions**: Clearly define file globs, user request keywords, and scenarios that trigger the skill.
- **Define Boundaries**: Explicitly state what the skill is responsible for and what belongs to other skills.
- **Provide Paired Examples**: Always accompany complex rules with side-by-side `BAD` and `GOOD` code examples.
- **Avoid Vague Prose**: Instead of "write good tests", specify "write unit tests with `@nestjs/testing` mocking `PrismaService` with `jest.fn()`".

---

## 6. API Documentation & OpenAPI Synchronization

When backend endpoints are added, changed, or removed, Swagger/OpenAPI documentation must be synchronized in the same commit.

| Element            | Synchronization Requirement                                                     | NestJS Decorator / Artifact                            |
| :----------------- | :------------------------------------------------------------------------------ | :----------------------------------------------------- |
| **Routes**         | Controller path and method decorator must match the documented route.           | `@Controller('cards')`, `@Get(':id')`                  |
| **Parameters**     | All route params and query params must have names, types, and descriptions.     | `@ApiParam({ name: 'id' })`, `@ApiQuery(...)`          |
| **DTOs**           | All request properties must match validation decorators and OpenAPI properties. | `@ApiProperty(...)`, `@ApiPropertyOptional(...)`       |
| **Responses**      | Every response must specify the HTTP status code and response DTO class.        | `@ApiResponse({ status: 200, type: BusinessCardDto })` |
| **Authentication** | Guarded routes must declare Bearer authentication.                              | `@UseGuards(JwtAuthGuard)`, `@ApiBearerAuth()`         |
| **Status Codes**   | Explicitly declare all possible error statuses (400, 401, 403, 404, 409).       | `@ApiResponse({ status: 404, description: '...' })`    |

---

## 7. Documentation Drift Protocol

Documentation drift occurs when code changes but documentation remains static. Prevent drift by enforcing this synchronous protocol:

```text
Implementation Change (Controller, Service, Schema, or Config)
   ↓
Identify Affected Documentation:
   ├─ Swagger/OpenAPI decorators in backend controllers
   ├─ DTO properties and decorators in backend/src/*/dto/
   ├─ Shared contracts in packages/shared/src/
   ├─ Environment variables in .env.example and env.validation.ts
   ├─ Root or package README.md
   └─ Specialized skills in .agents/skills/
   ↓
Update Documentation in the Same Commit / PR
   ↓
Verify Examples, Links, and Runnable Commands
```

### Drift Triggers to Watch For:

- **Prisma Schema Changes**: Adding or removing columns in `backend/prisma/schema.prisma` requires updating shared DTOs and Swagger annotations.
- **Route Changes**: Renaming endpoints or changing HTTP verbs requires updating controller decorators and any API call examples in READMEs.
- **New Environment Variables**: Introducing a variable requires updating `.env.example`, `backend/src/config/env.validation.ts`, and setup docs.
- **Dependency Changes**: Upgrading node versions, package managers, or major libraries requires updating prerequisites in `README.md`.

---

## 8. Security & Path Portability

### 8.1 Security Standards

- **Zero Real Credentials**: Never commit or document real passwords, JWT secrets, database connection strings with credentials, Cloudflare R2 tokens, or Stripe API keys.
- **Standardized Safe Placeholders**:
  - PostgreSQL: `postgresql://postgres:postgres@localhost:5432/veya?schema=public`
  - JWT Secret: `your-super-secret-jwt-access-key-here`
  - Cloudflare R2: `https://<account_id>.r2.cloudflarestorage.com`
  - Ports: `3000` (backend), `8081` (Expo mobile)

### 8.2 Path Portability Standards

- **Never Use Machine-Specific Paths**: Prohibit paths containing local drive letters or user directories:
  - ❌ `file:///f:/Self Projects/veya/backend/src/main.ts`
  - ❌ `C:\Users\username\veya\app\index.tsx`
  - ❌ `/Users/username/veya/...`
- **Always Use Repository-Relative Paths**:
  - ✅ `backend/src/main.ts`
  - ✅ `app/features/cards/components/CardHeader.tsx`
  - ✅ `packages/shared/src/cards/types.ts`
  - ✅ `AGENTS.md`

### 8.3 Domain Terminology (Rule #26 of `AGENTS.md`)

Always use Veya's standardized domain terminology:

- **`Card`**: The core business card product entity. Never use `BusinessCard` in user-facing domain terms, `ContactPage`, `DigitalCard`, or `Profile` unless explicitly referencing the technical Prisma model name `BusinessCard`.
- **`User`**: The account holder who creates and manages Cards.
- **`Scanner`**: The QR code and camera scanning feature.
- **`Storage`**: Cloudflare R2 object storage for images and media assets.

---

## 9. Verification Checklist

Before completing any documentation task, run and confirm every check:

- [ ] **Reality Check**: Verified that documented features, endpoints, and options match active code.
- [ ] **Terminology (Rule #26)**: Core business entity is consistently named `Card`.
- [ ] **Path Portability**: Zero machine-specific paths (`file:///`, `C:\`, `/Users/`); all paths are repository-relative.
- [ ] **Security**: Zero real secrets, passwords, or tokens; all examples use safe placeholders.
- [ ] **OpenAPI Parity**: Every updated backend endpoint includes `@ApiTags`, `@ApiOperation`, `@ApiResponse`, and `@ApiBearerAuth`.
- [ ] **Runnable Commands**: All shell commands match active `package.json` scripts and use `pnpm`.
- [ ] **Valid Links**: All repository-relative links point to existing files and directories.
- [ ] **Formatting**: Markdown formatting is clean and passes repository format check:
  ```bash
  pnpm format:check
  ```
- [ ] **No Unrelated Changes**: Only documentation files were modified; application source code remains untouched.
