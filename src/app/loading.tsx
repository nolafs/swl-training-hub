export default function Loading() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-50">
      <div className="text-center">
        <div className="inline-block w-12 h-12 border-4 border-zinc-200 border-t-zinc-800 rounded-full animate-spin" />
        <p className="mt-4 text-zinc-600">Loading...</p>
      </div>
    </main>
  );
}
