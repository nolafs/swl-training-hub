export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50">
      <div className="text-center">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-800" />
        <p className="mt-4 text-zinc-600">Loading...</p>
      </div>
    </main>
  );
}
