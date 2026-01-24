'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50">
      <div className="px-6 text-center">
        <h1 className="text-9xl font-bold text-zinc-200">404</h1>
        <h2 className="mt-4 text-2xl font-semibold text-zinc-800">Page Not Found</h2>
        <p className="mx-auto mt-2 max-w-md text-zinc-600">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or
          doesn&apos;t exist.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/"
            className="rounded-lg bg-zinc-900 px-6 py-3 font-medium text-white transition-colors hover:bg-zinc-800"
          >
            Go Home
          </Link>
          <button
            onClick={() => history.back()}
            className="rounded-lg border border-zinc-300 px-6 py-3 font-medium text-zinc-700 transition-colors hover:bg-zinc-100"
          >
            Go Back
          </button>
        </div>
      </div>
    </main>
  );
}
