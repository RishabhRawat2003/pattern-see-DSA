export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-5xl min-w-0 flex-1 px-4 py-8 sm:px-6 sm:py-12">
      <div className="h-3 w-36 animate-pulse rounded bg-paper/10" />
      <div className="mt-6 h-10 w-2/3 max-w-md animate-pulse rounded bg-paper/10" />
      <div className="mt-4 h-4 w-full max-w-xl animate-pulse rounded bg-paper/10" />
      <div className="surface mt-8 h-72 animate-pulse rounded-2xl bg-paper/5" />
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="surface h-28 animate-pulse rounded-2xl bg-paper/5" />
        <div className="surface h-28 animate-pulse rounded-2xl bg-paper/5" />
      </div>
    </main>
  );
}
