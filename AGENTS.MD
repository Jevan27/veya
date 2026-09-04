# AGENTS.md

# Veya Engineering Guidelines

This document defines the rules and conventions for the Veya codebase.

All AI coding agents and developers working on this repository must follow these guidelines unless a specific task explicitly requires an exception.

The primary goals are:

1. Keep the codebase clean and predictable.
2. Keep files small and easy to understand.
3. Keep responsibilities separated.
4. Avoid unnecessary abstraction.
5. Make features easy to locate.
6. Prevent duplicated business logic.
7. Keep the architecture scalable without overengineering.

---

# 1. Project Structure

The repository uses the following top-level structure:

```text
veya/
├── app/              # React Native + Expo mobile application
├── backend/          # Node.js + NestJS backend
├── frontend/         # Next.js web application — currently empty
├── packages/
│   └── shared/       # Shared types, schemas, and utilities
│
├── AGENTS.md
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.json
├── .env.example
├── .gitignore
└── README.md
```

Do not create random top-level directories.

Before creating a new directory, determine whether the file belongs inside an existing feature or architectural layer.

---

# 2. Directory Naming

Use lowercase directory names.

Examples:

```text
auth/
users/
cards/
analytics/
components/
services/
utils/
```

Do not use:

```text
Auth/
Users/
CardComponents/
MyUtils/
```

Avoid unnecessary abbreviations.

Prefer:

```text
components/
services/
repositories/
```

over:

```text
cmp/
svc/
repo/
```

---

# 3. File Naming

Use predictable file names.

### TypeScript

Use:

```text
user.service.ts
user.controller.ts
user.module.ts
user.dto.ts
user.guard.ts
```

Do not use inconsistent naming such as:

```text
UserService.ts
userService.ts
USER.service.ts
```

### React Native

Use:

```text
CardPreview.tsx
ProfileHeader.tsx
CreateCardScreen.tsx
```

Use PascalCase for React components.

### Utilities

Use descriptive lowercase names:

```text
format-phone.ts
generate-slug.ts
validate-email.ts
```

---

# 4. Feature-Based Organization

Organize application code primarily by **feature**, not by dumping everything into global folders.

Prefer:

```text
backend/src/
├── auth/
├── users/
├── cards/
├── analytics/
└── health/
```

rather than:

```text
backend/src/
├── controllers/
├── services/
├── models/
├── helpers/
└── everything/
```

Each feature should own its related files.

For example:

```text
cards/
├── cards.module.ts
├── cards.controller.ts
├── cards.service.ts
├── cards.repository.ts
├── dto/
│   ├── create-card.dto.ts
│   └── update-card.dto.ts
└── types/
```

Do not create a new abstraction unless there is a real reason.

---

# 5. NestJS Architecture

The backend uses:

```text
Node.js
NestJS
TypeScript
REST
Prisma
PostgreSQL
```

Use NestJS modules to separate business domains.

Example:

```text
backend/src/
├── auth/
├── users/
├── cards/
├── analytics/
└── health/
```

Each feature module should generally follow:

```text
feature/
├── feature.module.ts
├── feature.controller.ts
├── feature.service.ts
├── dto/
└── types/
```

Add repositories, guards, strategies, or other layers only when the feature actually requires them.

Do not create empty architectural layers simply because they might be needed someday.

---

# 6. Controllers

Controllers should be thin.

Controllers are responsible for:

* Receiving HTTP requests
* Validating request input
* Calling services
* Returning responses

Controllers should NOT contain substantial business logic.

Bad:

```text
Controller
 ├── Validate business rules
 ├── Query database
 ├── Calculate pricing
 ├── Modify entities
 └── Return response
```

Prefer:

```text
Controller
    ↓
Service
    ↓
Repository / Prisma
    ↓
Database
```

---

# 7. Services

Services contain business logic.

Example:

```text
cards.service.ts
```

can handle:

* Creating cards
* Updating cards
* Publishing cards
* Validating card ownership
* Applying card rules

Avoid putting business logic directly inside controllers.

---

# 8. Database Access

Use **Prisma** for PostgreSQL access.

Do not access the database directly from controllers.

Prefer:

```text
Controller
    ↓
Service
    ↓
Prisma
    ↓
PostgreSQL
```

Keep database-related logic close to the feature that owns it.

Do not create a giant global:

```text
database.service.ts
```

containing unrelated business operations.

---

# 9. DTOs

NestJS request DTOs should live inside the relevant feature.

Example:

```text
cards/
└── dto/
    ├── create-card.dto.ts
    └── update-card.dto.ts
```

Do not create a single global `dto/` directory containing DTOs for every feature.

Use validation decorators where appropriate.

Never trust client-provided input.

---

# 10. React Native Architecture

The `app/` directory contains the mobile application.

Organize the mobile application around features.

Prefer:

```text
app/
├── app/
├── components/
├── features/
│   ├── auth/
│   ├── cards/
│   └── profile/
├── services/
├── hooks/
├── lib/
├── types/
└── assets/
```

Do not create a giant:

```text
components/
```

directory containing every component in the application.

Shared UI components can live in:

```text
components/
```

Feature-specific components should live inside their feature.

For example:

```text
features/cards/
├── components/
│   ├── CardPreview.tsx
│   └── CardForm.tsx
├── screens/
│   └── EditCardScreen.tsx
└── services/
    └── card.service.ts
```

---

# 11. Components

A component should have one clear responsibility.

Prefer:

```text
ProfileHeader
CardActions
SocialLinks
ContactButton
```

rather than a 500-line:

```text
BusinessCardEverything.tsx
```

If a component becomes difficult to understand, split it.

Do not split components unnecessarily just to create more files.

---

# 12. Hooks

React hooks should live in:

```text
hooks/
```

for genuinely reusable application-wide hooks.

Feature-specific hooks should stay inside the feature:

```text
features/cards/hooks/
```

Do not create hooks simply to move code into another file.

---

# 13. API Communication

The mobile application must communicate with the backend through the REST API.

Do not place raw API requests throughout UI components.

Bad:

```text
Screen
 ├── fetch()
 ├── authentication logic
 ├── response transformation
 └── UI
```

Prefer:

```text
Screen
   ↓
Hook
   ↓
API Service
   ↓
REST API
```

For example:

```text
services/
└── api/
    ├── client.ts
    ├── auth.api.ts
    └── cards.api.ts
```

Keep API-specific code separate from presentation code.

---

# 14. Shared Package

`packages/shared/` is for code genuinely shared between applications.

Examples:

```text
packages/shared/
├── types/
├── schemas/
├── constants/
└── utils/
```

Good candidates:

* API types
* Shared enums
* Zod schemas
* Common constants
* Small platform-independent utilities

Do NOT put:

* React Native components
* NestJS services
* Database access
* Platform-specific code
* Business logic that belongs exclusively to backend

into the shared package.

---

# 15. Avoid Circular Dependencies

Dependency direction should remain predictable.

Prefer:

```text
UI
 ↓
Feature
 ↓
Services
 ↓
API
```

Backend:

```text
Controller
 ↓
Service
 ↓
Database
```

Avoid modules importing each other in circular chains.

If circular dependencies appear, stop and reconsider the architecture instead of adding workarounds.

---

# 16. File Size

There is no absolute file-size rule, but large files should be treated as a warning sign.

If a file contains multiple unrelated responsibilities, split it.

As a general guideline:

* Components: ideally under ~200–300 lines
* Services: ideally under ~250–300 lines
* Controllers: preferably small
* Utility files: focused on one concern

Do not split files purely to satisfy a line count.

Clarity matters more than arbitrary limits.

---

# 17. Avoid "Utils" Dumping Grounds

Do not put unrelated functions into:

```text
utils.ts
helpers.ts
common.ts
misc.ts
```

Prefer focused files:

```text
format-phone.ts
generate-slug.ts
parse-vcard.ts
validate-url.ts
```

If a utility belongs specifically to a feature, keep it inside that feature.

---

# 18. Avoid Premature Abstraction

Do not create:

```text
BaseService
BaseRepository
GenericController
AbstractManager
UniversalHandler
```

unless there is a demonstrated need.

Three similar lines of code are often better than a complicated abstraction.

Build for today's requirements while keeping the architecture extensible.

---

# 19. No Duplicate Business Logic

There must be a single source of truth for business rules.

For example, card publishing rules should not be separately implemented in:

```text
React Native
Next.js
NestJS
```

The backend should enforce important business rules.

The frontend may provide validation for user experience, but backend validation is authoritative.

---

# 20. Environment Variables

Never hardcode:

* API keys
* Passwords
* OAuth secrets
* JWT secrets
* Database credentials
* Stripe secrets

Use environment variables.

Example:

```text
.env
```

must never be committed.

Maintain:

```text
.env.example
```

with safe placeholders.

---

# 21. Error Handling

Errors should be handled intentionally.

Do not silently swallow errors.

Bad:

```text
try {
  ...
} catch {
  return null;
}
```

unless there is a clear reason.

Backend errors should use appropriate HTTP status codes.

Frontend errors should provide useful user-facing messages.

Do not expose sensitive backend information to users.

---

# 22. Logging

Use structured and useful logging.

Do not leave random debugging statements throughout the codebase.

Avoid:

```text
console.log("HERE")
console.log(data)
console.log("TEST")
```

before committing code.

Remove temporary debugging code.

---

# 23. Comments

Prefer readable code over excessive comments.

Do NOT comment obvious code.

Bad:

```text
// Set the name
const name = user.name;
```

Comments should explain:

* Why something is done
* Important architectural decisions
* Non-obvious constraints
* External API quirks
* Security considerations

---

# 24. Dependencies

Before adding a dependency, ask:

1. Do we actually need it?
2. Is the functionality small enough to implement ourselves?
3. Is the dependency actively maintained?
4. Does it work with Expo/NestJS/our current stack?
5. Does it introduce unnecessary complexity?

Do not install libraries for trivial functionality.

Avoid multiple libraries solving the same problem.

---

# 25. API Versioning

The backend API uses:

```text
/api/v1
```

Keep API versioning consistent.

Do not randomly create:

```text
/api
/api/v1
/api/v2
```

without an intentional migration strategy.

---

# 26. Naming Business Concepts

Use consistent domain terminology.

The product calls the main entity a:

```text
Card
```

Use that terminology consistently.

Avoid randomly switching between:

```text
Card
Profile
BusinessCard
DigitalCard
ContactPage
Identity
```

unless they represent genuinely different concepts.

Consistent terminology makes the codebase easier to understand.

---

# 27. Adding New Features

When adding a new feature:

1. Identify which application owns the feature.
2. Identify the business domain.
3. Create the feature directory.
4. Keep feature-specific code together.
5. Add only the necessary files.
6. Avoid modifying unrelated modules.
7. Update shared types only when genuinely shared.
8. Add tests where appropriate.
9. Update documentation if architecture changes.

Example:

```text
features/cards/
├── components/
├── hooks/
├── services/
├── screens/
└── types/
```

---

# 28. Do Not Create Random Files at Root

The repository root should remain clean.

Do not create files such as:

```text
test.ts
scratch.ts
debug.ts
temp.ts
notes.txt
new.ts
old.ts
```

for temporary development work.

Use temporary files outside the repository or remove them before committing.

---

# 29. Keep Frontend Empty Until Requested

The top-level:

```text
frontend/
```

directory is reserved for the future Next.js web application.

Until the web application is explicitly initialized:

**DO NOT add files to `frontend/`.**

Do not create:

```text
frontend/package.json
frontend/src/
frontend/app/
frontend/pages/
```

yet.

---

# 30. Git Hygiene

Commit meaningful changes.

Avoid commits containing unrelated changes.

Before committing:

```text
- Remove debugging code
- Remove unused imports
- Remove unused files
- Run lint
- Run type checking
- Verify formatting
- Verify the application still runs
```

Do not commit:

```text
.env
credentials
API keys
build artifacts
node_modules
temporary files
```

---

# 31. Before Creating a File

Before creating a new file, ask:

> "Does this responsibility already have a home?"

If yes, modify the existing file when appropriate.

If no, create a focused file in the correct feature directory.

Do not create files just because a framework example contains them.

---

# 32. Before Creating a Folder

Before creating a new folder, ask:

> "Will this folder contain multiple related files that benefit from grouping?"

If the answer is no, don't create the folder.

Avoid structures such as:

```text
cards/
└── services/
    └── card/
        └── create/
            └── create-card.service.ts
```

unless the project genuinely requires that level of organization.

Prefer simple structures.

---

# 33. Refactoring Rule

When modifying existing code:

**Do not perform unrelated refactors unless explicitly requested.**

If you notice unrelated technical debt:

1. Avoid expanding the scope.
2. Mention it to the developer.
3. Fix it separately if requested.

This keeps commits focused and reduces accidental regressions.

---

# 34. Agent Behavior

When working as an AI coding agent:

1. Inspect the existing structure before creating files.
2. Reuse existing patterns.
3. Follow this document.
4. Do not invent architectural patterns without justification.
5. Do not introduce unnecessary dependencies.
6. Do not duplicate existing functionality.
7. Keep changes focused on the requested task.
8. Run relevant checks after making changes.
9. Explain significant architectural decisions.
10. Never silently restructure the project.

If the requested implementation conflicts with this document, explain the conflict before making a major structural change.

---

# 35. Definition of Clean Code

For Veya, "clean code" means:

```text
Easy to find
Easy to understand
Easy to modify
Easy to test
Minimal duplication
Clear responsibilities
Predictable naming
Minimal unnecessary abstraction
```

The objective is **not** to have the fewest files.

The objective is **not** to have the most sophisticated architecture.

The objective is:

> **A developer should be able to open the repository and quickly understand where a feature belongs.**

---

# 36. Veya Architecture Principle

Keep this principle in mind when making architectural decisions:

```text
Simple first.
Feature-focused.
Explicit over clever.
Reusable when proven necessary.
Backend owns business rules.
Frontend owns presentation.
Shared code only when genuinely shared.
```

Do not optimize for hypothetical scale.

Build a clean foundation that can evolve as Veya gains real users and real requirements.
