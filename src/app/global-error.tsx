"use client";

export default function GlobalError({ reset }: Readonly<{ reset: () => void }>) {
  return (
    <html lang="en">
      <body>
        <main className="centered-message">
          <p className="eyebrow">Application error</p>
          <h1>Something went wrong</h1>
          <p>The dashboard shell could not be loaded. Try the request again.</p>
          <button className="button" type="button" onClick={reset}>
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
