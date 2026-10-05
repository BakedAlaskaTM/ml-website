import Link from "next/link";
import { signInWithDiscord } from "./actions";

export default function SignInPage() {
  return (
    <main className="auth-shell">
      <Link className="brand" href="/">launchpad<span>✳</span></Link>
      <section className="auth-card">
        <p className="eyebrow"><span className="status-dot" /> YOUR WORKSPACE AWAITS</p>
        <h1>Welcome<br /><span>back.</span></h1>
        <p className="intro">Sign in to pick up where your next big idea begins.</p>
        <form action={signInWithDiscord}>
          <button className="button button-primary auth-button" type="submit"><span className="github-mark">◉</span> Continue with Discord <span>↗</span></button>
        </form>
        <p className="fine-print">By continuing, you agree to the terms of this starter app.</p>
      </section>
      <footer><span>Made for the things you haven’t built yet.</span><span>STARTER KIT · 2026</span></footer>
    </main>
  );
}
