"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-50">
      <div className="text-center px-6">
        <h1 className="text-9xl font-bold text-zinc-200">404</h1>
        <h2 className="text-2xl font-semibold text-zinc-800 mt-4">
          Page Not Found
        </h2>
        <p className="text-zinc-600 mt-2 max-w-md mx-auto">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have
          been moved or doesn&apos;t exist.
        </p>
        <div className="mt-8 flex gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-800 transition-colors"
          >
            Go Home
          </Link>
          <button
            onClick={() => history.back()}
            className="px-6 py-3 border border-zinc-300 text-zinc-700 rounded-lg font-medium hover:bg-zinc-100 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </main>
  );
}
