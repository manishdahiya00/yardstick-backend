# Backend

This is the backend API for the Yardstick Assignment project. It is built using Node.js, Express-style routing, Prisma ORM, and PostgreSQL. The backend provides authentication, notes management, and plan-based access control for the frontend application.

---

## Project Explanation

The backend exposes a RESTful API for user authentication, notes CRUD operations, and enforces business logic such as plan-based note limits (FREE/PRO). It uses Prisma for database access and migrations, and Zod for request validation. Logging and error handling are centralized for maintainability.

---

## Approach

- **Node.js** is used for server-side execution and development.
- **Express-like structure**: Controllers, services, and middlewares are used for clean separation of concerns.
- **Prisma ORM**: Handles all database interactions and migrations with PostgreSQL.
- **Authentication**: JWT-based authentication with role-based access control (Manager/Member).
- **Validation**: Zod is used to validate incoming requests.
- **Logging**: Centralized logging for errors and requests.
- **Plan Enforcement**: Business logic enforces note limits based on user subscription (FREE/PRO).

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) (v9+ recommended)
- [PostgreSQL](https://www.postgresql.org/) (for backend database)

### Setup

1. **Install dependencies:**

    ```sh
    npm install
    ```

2. **Configure environment:**
    - Copy `.env.example` to `.env` and set your database credentials.

3. **Run database migrations:**

    ```sh
    npx prisma migrate deploy
    ```

4. **Seed the database (optional):**

    ```sh
    npm run seed
    ```

    > Make sure your `package.json` has a `seed` script like:
    > `"seed": "ts-node src/seed/index.ts"`

5. **Start the backend server (development):**

    ```sh
    npm run dev
    ```

    The API will be available at `http://localhost:8000`.

6. **Build for production:**

    ```sh
    npm run build
    ```

7. **Start the backend server (production):**
    ```sh
    npm start
    ```

---

## Scripts

- `npm run dev` — Start backend in watch mode
- `npm start` — Start backend in production
- `npm run build` — Build backend for production
- `npx prisma migrate dev` — Run migrations
- `npm run seed` — Seed database

---

## License

MIT

---

This project was created using Node.js and Prisma.

To seed the database (optional):

```bash
bun run src/seed/index.ts
```

---

This project was created using `bun init` in bun v1.2.21. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
