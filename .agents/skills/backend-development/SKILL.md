---
name: backend-development
description: >-
  Architectural and coding standards for the Veya NestJS REST API backend.
  Use when creating or updating NestJS modules, controllers, services, DTOs,
  guards, database operations via Prisma, and Cloudflare R2 storage integration.
---

# Backend Development Skill for Veya

This skill defines the technical standards, architectural rules, and engineering workflows for Veya's backend application (`backend/`), built with NestJS 11, Express, Prisma ORM, PostgreSQL, Passport JWT, and TypeScript.

This skill is **exclusively responsible for backend development**.

---

## 1. Purpose

Ensure backend code in `backend/` is secure, scalable, strictly modularized by feature, maintains thin controllers, delegates all data access and domain invariants to services, and serves as the authoritative single source of truth for business rules in the Veya platform.

---

## 2. When to Use & Skill Boundaries

### Activate this skill when:

- Creating or modifying NestJS feature modules, controllers, or services in `backend/src/`.
- Defining or updating request and response DTOs with `class-validator` and `class-transformer`.
- Implementing route handlers, query parameters, path parameters, or Swagger OpenAPI documentation.
- Querying PostgreSQL through `PrismaService` or defining database transactions.
- Integrating file uploads and media management with Cloudflare R2 via `StorageService`.
- Managing environment variables and runtime validation in `backend/src/config/`.

### Cross-Skill Boundaries:

- **Security-Sensitive Tasks (`backend-development + security`)**:
  When authoring authentication flows, password hashing, token rotation, rate-limiting, CORS rules, or authorization policies, activate both this skill and the `security` skill. Defer global security policies to the `security` skill.
- **Testing Tasks (`backend-development + testing`)**:
  When authoring unit tests (`.spec.ts`), integration tests, or mocking `PrismaService` with Jest, activate both this skill and the `testing` skill. Defer mock patterns and test runner conventions to the `testing` skill.
- **Documentation Tasks (`backend-development + documentation`)**:
  When authoring or synchronizing Swagger annotations, READMEs, or API contracts, activate the `documentation` skill.

---

## 3. Pre-Implementation Inspection Protocol

Before writing or updating backend code, execute this inspection sequence:

1. **Locate Feature Domain**:
   - Cards domain: `backend/src/cards/` (`cards.module.ts`, `cards.controller.ts`, `cards.service.ts`, `dto/`)
   - Auth domain: `backend/src/auth/` (`auth.module.ts`, `auth.controller.ts`, `auth.service.ts`, `guards/`, `strategies/`)
   - Users domain: `backend/src/users/` (`users.module.ts`, `users.controller.ts`, `users.service.ts`)
   - Storage domain: `backend/src/storage/` (`storage.service.ts`, `file-validation.util.ts`)
   - Prisma service: `backend/src/prisma/prisma.service.ts` and `backend/prisma/schema.prisma`
2. **Inspect Shared Contracts**:
   - Check `packages/shared/src/cards/types.ts` (`CardDto`, `CreateCardDto`, `UpdateCardDto`) and `packages/shared/src/auth/types.ts`.
3. **Inspect Configuration**:
   - Verify environment variables in `backend/src/config/env.validation.ts` and `.env.example`.
4. **Inspect Route & Versioning Setup**:
   - Verify global prefix (`api/v1`) and Swagger builder in `backend/src/main.ts`.
5. **Inspect Existing Tests**:
   - Inspect existing tests in `backend/src/<feature>/__tests__/` or colocated `.spec.ts` files to understand established mock structures.

---

## 4. Architectural Decision Rules for AI Agents

When authoring backend changes, apply this deterministic decision tree:

```text
Decision Matrix:
├─ Is it receiving HTTP requests, parsing parameters, or returning HTTP responses?
│  └─ YES ──> CONTROLLER (backend/src/<feature>/<feature>.controller.ts)
│             Keep thin. Apply Swagger annotations and validation pipes.
│
├─ Is it validating incoming request payloads or formatting responses?
│  └─ YES ──> DTO (backend/src/<feature>/dto/)
│             Use class-validator and class-transformer decorators.
│
├─ Is it executing business rules, database queries, transactions, or state changes?
│  └─ YES ──> SERVICE (backend/src/<feature>/<feature>.service.ts)
│             Single source of truth for domain logic.
│
├─ Is it verifying credentials, JWTs, or route access permissions?
│  └─ YES ──> GUARD (backend/src/auth/guards/ or backend/src/common/guards/)
│
├─ Is it a platform-agnostic type or schema shared between backend and client?
│  ├─ YES ──> packages/shared/src/ (Rule #14 of AGENTS.md)
│  └─ NO  ──> Keep backend-only in backend/src/<feature>/types/ or dto/
│
├─ Does the change require file upload, image validation, or R2 storage?
│  └─ YES ──> DELEGATE TO StorageService (backend/src/storage/storage.service.ts)
│             Never implement raw AWS S3 SDK commands in feature services.
│
└─ Does a new domain represent a distinct business feature?
   ├─ YES ──> CREATE A NEW FEATURE MODULE in backend/src/<feature>/
   └─ NO  ──> EXTEND EXISTING MODULE (cards, users, auth, storage, health)
```

### 4.1 When to Create an Abstraction vs. When NOT To

- **Follow Rule #18 of `AGENTS.md` (Avoid Premature Abstraction)**:
  - ❌ NEVER create `BaseService`, `BaseController`, `GenericRepository`, or `UniversalHandler`.
  - ❌ Do NOT create abstract classes or generic wrappers for operations used by only one or two modules.
  - ✅ Three similar lines of explicit code are better than a fragile generic abstraction.
  - ✅ An abstraction is justified ONLY when three or more distinct feature domains share identical, non-trivial operational logic (e.g. `StorageService` serving both `cards` and `users`).

### 4.2 Module Creation vs. Extension

- **Create a New Module** when introducing a distinct bounded context that owns its own database model, lifecycle, and access control (e.g. `analytics`, `billing`, `webhooks`).
- **Extend an Existing Module** when adding operations related to existing entities (e.g. adding card duplication to `cards`, adding profile photo update to `users`).

---

## 5. API Design Standards (`/api/v1`)

### 5.1 Route Conventions & Naming

- **Global Prefix**: All backend routes automatically inherit `/api/v1` (configured in `backend/src/main.ts`).
- **Resource Naming**: Use plural nouns in lowercase kebab-case for resource paths:
  - `@Controller('cards')` -> `/api/v1/cards`
  - `@Controller('users')` -> `/api/v1/users`
  - `@Controller('auth')` -> `/api/v1/auth`
- **Sub-Resources**: Represent hierarchical relationships naturally:
  - `@Get(':id/vcard')` -> `/api/v1/cards/:id/vcard`
  - `@Get('slug/:slug')` -> `/api/v1/cards/slug/:slug`

### 5.2 HTTP Methods & Status Codes

Use semantically accurate HTTP methods and status codes:

- **`GET`**: Retrieve resources. Returns `200 OK`. If single resource is not found, throw `NotFoundException` (`404 Not Found`).
- **`POST`**: Create resources or trigger non-idempotent operations. Returns `201 Created` with created entity/DTO, or `200 OK` via `@HttpCode(HttpStatus.OK)` for action endpoints (e.g. `/auth/login`, `/auth/refresh`, `/auth/logout`).
- **`PATCH`**: Partial update. Returns `200 OK` with updated entity/DTO.
- **`DELETE`**: Delete resources. Returns `200 OK` or `204 No Content` via `@HttpCode(HttpStatus.NO_CONTENT)`.
- **Failure Status Codes**:
  - `400 Bad Request`: Input payload validation failures.
  - `401 Unauthorized`: Missing, invalid, or expired JWT access/refresh token.
  - `403 Forbidden`: Authenticated user lacks permission to access resource.
  - `404 Not Found`: Requested resource does not exist or user does not own it.
  - `409 Conflict`: Unique constraint violations (e.g. duplicate email, slug, or default card concurrency collision).
  - `429 Too Many Requests`: Throttler rate limit exceeded.
  - `500 Internal Server Error`: Unhandled server failures (logged with stack trace; sanitized for client).
  - `503 Service Unavailable`: External dependency unavailable (e.g. Cloudflare R2 unconfigured/unreachable).

### 5.3 DTO Separation & Request Validation

- **Separation**: Never reuse the database model as an API contract. Separate request DTOs (`CreateCardDto`, `UpdateCardDto`) from response DTOs (`CardDto`, `UserDto`).
- **Validation**: Every request DTO field must be decorated with `class-validator`:
  ```typescript
  import { IsString, IsOptional, MaxLength, IsEmail } from 'class-validator';
  import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

  export class CreateCardDto {
    @ApiProperty({ description: 'Full name on the card', example: 'Jane Doe' })
    @IsString()
    @MaxLength(100)
    name: string;

    @ApiPropertyOptional({ description: 'Contact email', example: 'jane@example.com' })
    @IsOptional()
    @IsEmail()
    email?: string;
  }
  ```
- **Global Validation Pipe**: `backend/src/main.ts` configures:
  - `whitelist: true` (strips unknown properties).
  - `forbidNonWhitelisted: true` (rejects payloads containing undeclared properties).
  - `transform: true` (automatically transforms primitive types and DTO instances).

### 5.4 Pagination, Filtering & Sorting

For endpoints returning collections:

- Accept query parameters with safe defaults:
  - `limit`: Number of items (default: 20, max: 100).
  - `offset` / `cursor`: Pagination marker.
- Always enforce bounded queries (`take: Math.min(limit, 100)` in Prisma). Never execute unbounded `findMany()` without limits on scalable collections.

### 5.5 Swagger / OpenAPI Documentation

Every controller and endpoint must be documented with NestJS Swagger decorators:

- `@ApiTags('cards')` on controller class.
- `@ApiBearerAuth()` on authenticated endpoints.
- `@ApiOperation({ summary: '...' })` on every route.
- `@ApiResponse()` declaring status code, description, and response DTO `type`.
- `@ApiParam()` for route parameters, `@ApiQuery()` for optional query parameters.

---

## 6. Thin Controller Pattern

Controllers have five and only five responsibilities:

1. Define HTTP routes, verbs, and Swagger annotations.
2. Bind and validate request bodies, parameters, and queries via DTOs.
3. Extract authenticated caller identity using `@CurrentUser('sub') userId: string`.
4. Delegate immediately to the domain service.
5. Transform service results into response DTOs.

### Canonical Controller Example:

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
import { CardDto } from '@veya/shared';

@ApiTags('cards')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new card' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Card created', type: CardDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Validation failed' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async create(@CurrentUser('sub') userId: string, @Body() dto: CreateCardDto): Promise<CardDto> {
    const card = await this.cardsService.create(userId, dto);
    return this.cardsService.toCardDto(card);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a card by ID' })
  @ApiParam({ name: 'id', description: 'Card UUID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Card details', type: CardDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Card not found' })
  async findOne(@CurrentUser('sub') userId: string, @Param('id') id: string): Promise<CardDto> {
    const card = await this.cardsService.findOne(userId, id);
    return this.cardsService.toCardDto(card);
  }
}
```

---

## 7. Service Design & Data Integrity

Services own all business logic, data mutations, transaction boundaries, and domain invariants.

### 7.1 Service Invariants

- **Ownership Enforcement**: Always verify that the entity belongs to the requesting user before reading, modifying, or deleting it:
  ```typescript
  const card = await this.prisma.businessCard.findFirst({
    where: { id: cardId, userId },
  });
  if (!card) {
    throw new NotFoundException(`Card with ID ${cardId} not found`);
  }
  ```
- **Explicit Entity-to-DTO Mapping**: Every service must provide explicit mapper methods (e.g. `toCardDto`, `toUserDto`). Never return raw Prisma database models containing sensitive attributes (`passwordHash`, `hashedRefreshToken`) or unformatted Date objects.

### 7.2 Transaction Boundaries (`prisma.$transaction`)

When a business operation touches multiple rows or requires multi-step consistency, execute it inside an atomic Prisma interactive transaction:

```typescript
async create(userId: string, dto: CreateCardDto): Promise<BusinessCard> {
  try {
    return await this.prisma.$transaction(async (tx) => {
      // Invariant: If marked default, unset all existing defaults for this user
      if (dto.isDefault) {
        await tx.businessCard.updateMany({
          where: { userId, isDefault: true },
          data: { isDefault: false },
        });
      }

      return tx.businessCard.create({
        data: {
          userId,
          name: dto.name,
          role: dto.role,
          company: dto.company,
          slogan: dto.slogan,
          phoneNumber: dto.phoneNumber,
          email: dto.email,
          location: dto.location,
          website: dto.website,
          avatarUrl: dto.avatarUrl,
          companyLogoUrl: dto.companyLogoUrl,
          primaryColor: dto.primaryColor || '#111111',
          cardBackgroundColor: dto.cardBackgroundColor || '#FFFFFF',
          isDefault: dto.isDefault ?? false,
        },
      });
    });
  } catch (error: unknown) {
    if (this.isUniqueConstraintViolation(error)) {
      throw new ConflictException('Concurrency collision while updating card defaults.');
    }
    throw error;
  }
}
```

### 7.3 Domain Invariants

- **Default Card Invariant**: Exactly one default card can be marked `isDefault = true` for a given user. Unset prior defaults inside an atomic transaction before setting a new default.
- **Email Normalization**: Always normalize emails using `.toLowerCase().trim()` before querying or storing users.
- **Argon2id Hashing**: Passwords must be hashed using `argon2.hash(password, { type: argon2.argon2id })`. Refresh tokens must be hashed before storage.

---

## 8. Error Handling & Information Shielding

Backend code must handle exceptions intentionally and shield internal system details from clients.

### 8.1 Error Mapping Strategy

- **Prisma Unique Violations (`P2002`)**: Catch and map to NestJS `ConflictException` (`409 Conflict`) with a clear, safe message.
- **Prisma Record Not Found (`P2025`)**: Catch and map to `NotFoundException` (`404 Not Found`).
- **Resource Ownership Mismatch**: Throw `NotFoundException` rather than `ForbiddenException` when querying by ID to prevent resource enumeration.
- **External Dependency Failure**: Catch AWS SDK / network errors and throw `ServiceUnavailableException` (`503 Service Unavailable`).

### 8.2 Client Information Shielding (Zero Leak Invariant)

- **NEVER leak SQL queries, Prisma error codes, or database schema names** to clients.
- **NEVER return stack traces in HTTP responses** (NestJS default exception filter strips stack traces in non-development modes).
- **Log internally, shield externally**: Log the full error message and stack trace using NestJS `Logger`, but return a friendly, generic error message to the client:
  ```typescript
  catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    this.logger.error(`Failed to upload file to R2: ${errMsg}`, error instanceof Error ? error.stack : undefined);
    throw new ServiceUnavailableException('Storage service is temporarily unavailable');
  }
  ```

---

## 9. Configuration & Environment Variables

### 9.1 Configuration Architecture

- Managed via `@nestjs/config` loaded globally in `backend/src/app.module.ts`.
- **Validation**: Validated at startup in `backend/src/config/env.validation.ts` using `class-validator` and `plainToInstance`:
  ```typescript
  export class EnvironmentVariables {
    @IsEnum(Environment)
    NODE_ENV: Environment = Environment.Development;

    @IsNumber()
    PORT: number = 3000;

    @IsString()
    DATABASE_URL: string;

    @IsString()
    JWT_ACCESS_SECRET: string;
  }
  ```
- **Startup Validation**: In production (`NODE_ENV === 'production'`) or when `PRISMA_STRICT_STARTUP === 'true'`, database connectivity failure during `onModuleInit` in `PrismaService` immediately aborts startup (`fail-fast`).

### 9.2 Secrets Management

- **NEVER hardcode secrets**: No JWT secrets, database connection strings, R2 credentials, or production URLs in source code.
- **Access via ConfigService**: Inject `ConfigService` in constructors:
  ```typescript
  constructor(private readonly configService: ConfigService) {
    const secret = this.configService.get<string>('JWT_ACCESS_SECRET');
  }
  ```
- **Safe Placeholders in `.env.example`**: Keep `.env.example` updated with descriptive placeholders (`your-super-secret-jwt-key`).

---

## 10. Storage Integration (Cloudflare R2)

All file and media uploads are encapsulated strictly within `StorageService` (`backend/src/storage/storage.service.ts`).

### 10.1 Storage Invariants & Boundaries

- **Encapsulation**: Feature services (`cards.service.ts`, `users.service.ts`) must NEVER instantiate `S3Client` or issue direct AWS S3 SDK commands. They MUST inject `StorageService`.
- **Controller Boundary**: Controllers receive multipart uploads using NestJS `@UseInterceptors(FileInterceptor('file'))` with `@UploadedFile() file: Express.Multer.File`.
- **Buffer & Format Validation**: `StorageService` delegates validation to `file-validation.util.ts`:
  - **Size Limit**: Enforce `MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024` (5 MB).
  - **Magic-Byte Detection**: True file type is determined by binary magic bytes (`detectImageSignature`). Only `jpeg`, `png`, and `webp` are accepted.
  - **Rejection**: SVG, XML, executables, HTML, and forged extensions are strictly rejected with `BadRequestException`.
- **Object Key Namespacing**: Use strict, sanitized directory structures:
  - Users profile photos: `users/<userId>/userpfp/avatar-<timestamp>.<ext>`
  - Company logos: `users/<userId>/companylogo/logo-<timestamp>.<ext>`
  - Card attachments: `users/<userId>/cards/<filename>`
- **Public CDN URL**: Returns `https://<R2_PUBLIC_DOMAIN>/<key>`.
- **Cleanup**: When a user account is deleted, call `storageService.deleteUserDirectory(userId)` to delete all associated R2 assets.

---

## 11. Performance & Query Optimization

- **Avoid N+1 Queries**: When loading cards with related user profiles, use Prisma `include` to fetch in a single joined query rather than mapping in a loop:
  ```typescript
  // GOOD: Single query with relation join
  await this.prisma.businessCard.findMany({
    where: { userId },
    include: { user: { select: { name: true, email: true } } },
  });
  ```
- **Use Selective Projections (`select`)**: When checking existence or retrieving specific fields, avoid fetching large, unused columns:
  ```typescript
  // GOOD: Fetch only what is needed for verification
  const exists = await this.prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
  ```
- **Mandatory Bounded Queries**: Always supply `take: limit` on collection queries. Unbounded queries will degrade database performance as tables grow.
- **Index Alignment**: Ensure query `where` clauses match indexes defined in `backend/prisma/schema.prisma` (e.g. `@@index([userId])`, `@@index([userId, isDefault])`).
- **Pragmatic Optimization**: Do not prematurely introduce Redis caching or complex query builders for trivial single-entity lookups.

---

## 12. Absolute Non-Negotiable Rules

1. **NO PRISMA IN CONTROLLERS**: Controllers must NEVER inject `PrismaService` or execute database queries.
2. **NO BUSINESS LOGIC IN CONTROLLERS**: Controllers only route, validate, extract caller context, delegate to services, and map responses.
3. **NO RAW SECRETS IN CODE**: Never hardcode JWT keys, passwords, connection strings, or R2 credentials.
4. **NO DIRECT R2 CALLS OUTSIDE STORAGESERVICE**: Feature services must never import `@aws-sdk/client-s3` or bypass `StorageService`.
5. **NO UNEXPLAINED ABSTRACTIONS**: Never introduce `BaseService`, `GenericRepository`, or premature inheritance hierarchies (Rule #18 of `AGENTS.md`).
6. **NO BYPASSING VALIDATION**: Every request body must pass through strongly-typed DTOs with `class-validator` decorators.
7. **NO BYPASSING AUTHORIZATION**: Every protected endpoint must declare `@UseGuards(JwtAuthGuard)` and verify resource ownership in the service.
8. **NO LEAKING SENSITIVE DATA**: Never return `passwordHash`, `hashedRefreshToken`, or internal server stack traces to clients.
9. **NO BREAKING CONTRACTS WITHOUT SHARED UPDATES**: Any changes to API response schemas must update `packages/shared/src/` concurrently.
10. **NO MACHINE-SPECIFIC PATHS**: Never write `file:///f:/...`, `C:\...`, or machine-specific paths in documentation or code.

---

## 13. Verification Protocol

Before declaring backend development work complete, run and verify the appropriate suite of commands:

### 1. Automated Tests:

```bash
pnpm --filter @veya/backend test
```

### 2. Monorepo & Backend Typecheck:

```bash
pnpm --filter @veya/backend typecheck
```

### 3. Backend Linting:

```bash
pnpm --filter @veya/backend lint
```

### 4. Code Formatting:

```bash
pnpm format:check
```

### 5. Backend Production Build:

```bash
pnpm --filter @veya/backend build
```

Never claim a verification step passed without executing it and observing an exit code of 0.
