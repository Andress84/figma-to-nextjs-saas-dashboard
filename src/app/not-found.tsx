import Link from "next/link";

export default function NotFound() {
  return (
    <main className="centered-message">
      <p className="eyebrow">404</p>
      <h1>Page not found</h1>
      <p>The requested dashboard route does not exist.</p>
      <Link className="button" href="/">
        Return to overview
      </Link>
    </main>
  );
}
