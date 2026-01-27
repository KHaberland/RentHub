export default function HomeLoading() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:gap-10 sm:px-6 sm:py-10">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft sm:p-8">
        <div className="flex flex-col gap-4">
          <div className="h-8 w-72 animate-pulse rounded-lg bg-slate-200" />
          <div className="h-4 w-96 animate-pulse rounded-lg bg-slate-100" />
          <div className="flex gap-3">
            <div className="h-9 w-36 animate-pulse rounded-full bg-slate-200" />
            <div className="h-6 w-40 animate-pulse rounded-full bg-slate-100" />
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="space-y-2">
          <div className="h-6 w-32 animate-pulse rounded-lg bg-slate-200" />
          <div className="h-4 w-64 animate-pulse rounded-lg bg-slate-100" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={`recent-${item}`}
              className="h-28 animate-pulse rounded-2xl border border-slate-200 bg-white"
            />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="space-y-2">
          <div className="h-6 w-40 animate-pulse rounded-lg bg-slate-200" />
          <div className="h-4 w-72 animate-pulse rounded-lg bg-slate-100" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={`popular-${item}`}
              className="h-28 animate-pulse rounded-2xl border border-slate-200 bg-white"
            />
          ))}
        </div>
      </section>
    </main>
  );
}
