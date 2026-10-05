# Launchpad starter

A Next.js App Router starter with Discord sign-in through NextAuth (Auth.js), Supabase Postgres, and Prisma.

## Get started

1. Install Node.js 20.9 or newer.
2. Install pnpm with `corepack enable` if it is not already available, then install dependencies with `pnpm install`.
3. Copy `.env.example` to `.env` and fill in the values.
4. Create an application in the [Discord Developer Portal](https://discord.com/developers/applications). Under OAuth2, add `http://localhost:3000/api/auth/callback/discord` as a redirect URL, then add the application ID and client secret to `.env` as `AUTH_DISCORD_ID` and `AUTH_DISCORD_SECRET`.
5. In your Supabase project, copy the transaction pooler connection string into `DATABASE_URL`. Use the direct connection string for `DIRECT_URL` if your network supports IPv6; on IPv4-only networks, use the session pooler connection string instead. Replace the password placeholders with your database password.
6. Apply the Prisma migration workflow below for your database (existing or empty).
7. Start the app with `pnpm dev`.

Generate `AUTH_SECRET` with `pnpm dlx auth secret`. For deployments, add the production callback URL to your Discord application and configure the same environment variables in your hosting provider.

## Useful commands

- `pnpm db:generate` regenerates Prisma Client after schema changes.
- `pnpm db:migrate --name <migration>` creates and applies a local migration.
- `pnpm db:deploy` applies checked-in migrations in production.
- `pnpm db:studio` opens Prisma Studio.

## First migration for an existing database

The schema contains the existing database models plus the NextAuth models. If the database already has tables and no Prisma migration history, baseline its current state before applying the new auth tables. This records the existing schema without running SQL against those tables.

With the existing database reachable through `DIRECT_URL`, create a baseline from its current schema and a second migration for the auth models:

```powershell
New-Item -ItemType Directory -Force prisma/migrations/0_init
pnpm exec prisma migrate diff --from-empty --to-schema-datasource prisma/schema.prisma --script --output prisma/migrations/0_init/migration.sql

New-Item -ItemType Directory -Force prisma/migrations/20261005_add_auth_tables
pnpm exec prisma migrate diff --from-schema-datasource prisma/schema.prisma --to-schema-datamodel prisma/schema.prisma --script --output prisma/migrations/20261005_add_auth_tables/migration.sql
```

Review both SQL files. The baseline should describe the existing tables; the auth migration should only create `User`, `Account`, `Session`, and `VerificationToken` and their indexes/foreign keys. Then mark the baseline as already present in this database and apply the auth migration:

```powershell
pnpm exec prisma migrate resolve --applied 0_init
pnpm db:deploy
```

Do not use `pnpm db:migrate` for the first migration on this existing database: it has no migration history to compare against. For a genuinely empty database, `pnpm db:migrate --name init` is appropriate. Prisma's schema diff does not represent Supabase RLS policies or every database comment; preserve those separately in SQL if the baseline will be used to recreate environments.

Prisma manages application data and NextAuth tables in Supabase Postgres. Supabase's client SDK is not required for database access through Prisma; add it separately if you need Supabase Storage, Realtime, or its Data API.

## Project layout

- `src/auth.ts` configures NextAuth and its Prisma adapter.
- `src/lib/prisma.ts` exports the reusable Prisma client.
- `prisma/schema.prisma` defines the database and authentication models.
- `src/app/dashboard` is a server protected route showing the signed-in user.
