# Backend

This is the backend API for the Yardstick Assignment project. It is built using Bun (a fast JavaScript runtime), Express-style routing, Prisma ORM, and PostgreSQL. The backend provides authentication, notes management, and plan-based access control for the frontend application.

---

## Project Explanation

The backend exposes a RESTful API for user authentication, notes CRUD operations, and enforces business logic such as plan-based note limits (FREE/PRO). It uses Prisma for database access and migrations, and Zod for request validation. Logging and error handling are centralized for maintainability.

---

## Approach

- **Bun** is used for fast server-side execution and development.
- **Express-like structure**: Controllers, services, and middlewares are used for clean separation of concerns.
- **Prisma ORM**: Handles all database interactions and migrations with PostgreSQL.
- **Authentication**: JWT-based authentication with role-based access control (Manager/Member).
- **Validation**: Zod is used to validate incoming requests.
- **Logging**: Centralized logging for errors and requests.
- **Plan Enforcement**: Business logic enforces note limits based on user subscription (FREE/PRO).

---

## Getting Started

To install dependencies:

```bash
bun install
```

To run the backend server:

```bash
bun run dev
```

To run database migrations:

```bash
bunx prisma migrate deploy
```

To seed the database (optional):

```bash
bun run src/seed/index.ts
```

---

This project was created using `bun init` in bun v1.2.21. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
