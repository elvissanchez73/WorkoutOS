This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

The app's backend is implemented as Next.js route handlers in `app/api` and expects PostgreSQL through `DATABASE_URL`.

## Getting Started

First, run the development server:

```bash
npm install
npm run dev
```

For local PostgreSQL with pgAdmin 4:

1. Create a database named `gym_tracker` in pgAdmin.
2. Copy `.env.local.example` to `.env.local`.
3. Replace `your_password` with your PostgreSQL password.
4. Start the app with `npm run dev`.

Example local connection string:

```text
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/gym_tracker
```

The API creates the database tables automatically on first request.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

Set this environment variable in the Vercel project:

```text
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require
```

Your pgAdmin local database will not work on Vercel because Vercel cannot connect to `localhost` on your computer. For production, create a hosted PostgreSQL database with Neon, Supabase, Railway, or a Vercel Marketplace Postgres provider, then paste that hosted connection string into Vercel.

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
