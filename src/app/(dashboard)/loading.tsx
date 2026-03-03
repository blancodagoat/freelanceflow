export default function DashboardLoading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 w-48 bg-neutral-200 rounded-lg" />
      <div className="bg-white border border-neutral-200 rounded-lg divide-y">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-4">
            <div className="space-y-2">
              <div className="h-4 w-48 bg-neutral-200 rounded" />
              <div className="h-3 w-32 bg-neutral-100 rounded" />
            </div>
            <div className="h-6 w-16 bg-neutral-200 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
