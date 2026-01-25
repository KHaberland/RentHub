export default function DashboardLoading() {
  return (
    <div className="space-y-4">
      <div className="h-7 w-48 animate-pulse rounded-lg bg-slate-200" />
      <div className="h-4 w-64 animate-pulse rounded-lg bg-slate-100" />
      <div className="space-y-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-20 animate-pulse rounded-2xl border border-slate-200 bg-slate-50"
          />
        ))}
      </div>
    </div>
  );
}
