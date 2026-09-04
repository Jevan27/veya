# Veya

> Digital identity, simplified.

Veya is a modern digital business card SaaS platform. This monorepo is managed with **pnpm workspaces**.

## Repository Structure

```text
veya/
├── app/          # React Native + Expo mobile application (@veya/app)
├── backend/      # Node.js + NestJS backend API (@veya/backend)
├── frontend/     # Reserved for future Next.js web application (EMPTY)
├── packages/
│   └── shared/   # Shared TypeScript types, constants & schemas (@veya/shared)
│
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.json
├── .env.example
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- Node.js >= 20
- pnpm >= 9
- Git

### Installation

Install all workspace dependencies:

```bash
pnpm install
```

### Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

### Development

- Run the backend API:

  ```bash
  pnpm --filter @veya/backend start:dev
  ```

  Swagger documentation available at: `http://localhost:3000/api/docs`
  Health check: `http://localhost:3000/api/v1/health`

- Run the mobile app:

  ```bash
  pnpm --filter @veya/app start
  ```

- Build workspace packages:

  ```bash
  pnpm build
  ```

- Lint all packages:

  ```bash
  pnpm lint
  ```

- Format codebase:
  ```bash
  pnpm format
  ```
