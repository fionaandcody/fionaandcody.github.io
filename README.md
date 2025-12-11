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
      ADMIN_PASSWORD="your-strong-password"
      ```

3.  **Database**:
    - Run migrations:
      ```bash
      npx prisma migrate dev
      ```

4.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000).

## Admin Management

- **Login**: Go to `/admin`.
- **Password**: Set in your `.env` file.
- **Manage Vacations**: Create, edit, and publish vacations locally.
- **Publishing**: Commit and push your changes (including the database) to update the live site.

## Deployment

This site is set up for **GitHub Pages**.

1.  Push code to GitHub.
2.  Ensure you have added `NEXT_PUBLIC_ADMIN_PASSWORD` to your GitHub Repository Secrets if you want immediate admin protection on the live site (though admin features are disabled on the static site).
3.   The GitHub Action will automatically build and deploy.

## Project Structure

- `/app`: App Router pages and layouts.
- `/components`: Reusable UI components.
- `/lib`: Utilities (Prisma client, etc).
- `/prisma`: Database schema and seed.
