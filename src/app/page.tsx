import Link from "next/link";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();

  return (
    <main className="shell">
      <nav className="topbar">
        <Link className="brand" href="/">launchpad<span>✳</span></Link>
        <Link className="nav-link" href={session ? "/dashboard" : "/signin"}>
          {session ? "Open dashboard ↗" : "Sign in ↗"}
        </Link>
      </nav>
      <section className="hero">
        <p className="eyebrow"><span className="status-dot" /> YOUR NEXT PROJECT STARTS HERE</p>
        <h1>Less setup.<br /><span>More making.</span></h1>
        <p className="intro">A calm, ready-to-build foundation for your next big idea. Authentication, database, and all the essentials are already in place.</p>
        <div className="actions">
          <Link className="button button-primary" href={session ? "/dashboard" : "/signin"}>{session ? "Go to your dashboard" : "Get started"}<span>↗</span></Link>
          <a className="button button-quiet" href="https://supabase.com/docs/guides/database/prisma" target="_blank" rel="noreferrer">Explore the stack <span>↗</span></a>
        </div>
      </section>
      <section className="stack" aria-label="Included technology">
        <div className="stack-heading"><span>THE FOUNDATION</span><span>01 — 03</span></div>
        <div className="stack-grid">
          <article className="stack-card"><span className="stack-number">01</span><div className="stack-icon auth-icon">A</div><h2>Authentication</h2><p>NextAuth.js with Discord OAuth and secure database sessions.</p><span className="tag">NEXTAUTH.JS</span></article>
          <article className="stack-card"><span className="stack-number">02</span><div className="stack-icon db-icon">◈</div><h2>Database</h2><p>Supabase Postgres, connected through a type-safe Prisma client.</p><span className="tag">SUPABASE + PRISMA</span></article>
          <article className="stack-card"><span className="stack-number">03</span><div className="stack-icon next-icon">N</div><h2>App framework</h2><p>Next.js App Router with TypeScript, ready for your next feature.</p><span className="tag">NEXT.JS</span></article>
        </div>
      </section>
      <footer><span>Made for the things you haven’t built yet.</span><span>STARTER KIT · 2026</span></footer>
    </main>
  );
}
