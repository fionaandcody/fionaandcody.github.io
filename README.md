# Fiona & Cody - Site Rebuild

This is a Next.js 14+ application built with TypeScript, Tailwind CSS, and Prisma (SQLite).

## Setup & Run

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Setup**:
    - Ensure `.env` exists with:
      ```
      DATABASE_URL="file:./dev.db"
      ADMIN_PASSWORD="securepassword123"
      ```

3.  **Database**:
    - Run migrations:
      ```bash
      npx prisma migrate dev
      ```
    - Seed the database (optional, adds one vacation):
      ```bash
      npx prisma db seed
      ```

4.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000).

## Admin Management

- **Login**: Go to [/admin/login](http://localhost:3000/admin/login).
- **Password**: `securepassword123` (or whatever is in `.env`).
- **Manage Vacations**: Create, edit, and publish vacations.
- **Note**: Only "published" vacations appear on the public `/adventures` page.

## Deployment to Vercel

1.  Push code to GitHub.
2.  Import project in Vercel.
3.  **Environment Variables**:
    - Set `ADMIN_PASSWORD`.
    - **Database Note**: Since this uses SQLite (`file:./dev.db`), data will **not persist** across Vercel deployments unless you commit the DB file (not recommended) or use a persistent storage provider.
    - **Recommendation**: Switch to Vercel Postgres or Neon for production. Update `prisma/schema.prisma` provider to `postgresql` and `prisma.config.ts` accordingly.

## Project Structure

- `/app`: App Router pages and layouts.
- `/components`: Reusable UI components.
- `/lib`: Utilities (Prisma client, etc).
- `/prisma`: Database schema and seed.
