import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { signOutAction } from "./actions";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/signin");

  return (
    <main className="shell dashboard-shell">
      <nav className="topbar">
        <Link className="brand" href="/">launchpad<span>✳</span></Link>
        <Link className="navlink" href="/projects">projects</Link>
        <form action={signOutAction}><button className="nav-button">Sign out ↗</button></form>
      </nav>
      <section className="dashboard-card">
        <p className="eyebrow"><span className="status-dot" /> YOU’RE SIGNED IN</p>
        <h1>Good to have<br /><span>you here.</span></h1>
        <p className="intro">Your protected space is ready. Start building something worth signing in for.</p>
        <div className="user-panel">
          {session.user.image ? <img className="avatar" src={session.user.image} alt="" /> : <div className="avatar avatar-fallback">{session.user.name?.[0] ?? "U"}</div>}
          <div><p className="user-label">SIGNED IN AS</p><p className="user-name">{session.user.name ?? session.user.email}</p></div>
        </div>
      </section>
      <footer><span>Made for the things you haven’t built yet.</span><span>STARTER KIT · 2026</span></footer>
    </main>
  );
}
