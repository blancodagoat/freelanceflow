'use client';

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-neutral-50 border-b border-neutral-200">
          <tr>
            <th className="text-left text-sm font-medium text-neutral-600 px-4 py-3">Title</th>
            <th className="text-left text-sm font-medium text-neutral-600 px-4 py-3">Client</th>
            <th className="text-left text-sm font-medium text-neutral-600 px-4 py-3">Status</th>
            <th className="text-right text-sm font-medium text-neutral-600 px-4 py-3">Total</th>
            <th className="w-24" />
          </tr>
        </thead>
        <tbody>
          {[...Array(rows)].map((_, i) => (
            <tr key={i} className="border-b border-neutral-100 last:border-0">
              <td className="px-4 py-3">
                <div className="h-4 w-32 bg-neutral-200 rounded animate-pulse" />
              </td>
              <td className="px-4 py-3">
                <div className="h-4 w-24 bg-neutral-200 rounded animate-pulse" />
              </td>
              <td className="px-4 py-3">
                <div className="h-5 w-16 bg-neutral-200 rounded animate-pulse" />
              </td>
              <td className="px-4 py-3">
                <div className="h-4 w-16 bg-neutral-200 rounded animate-pulse ml-auto" />
              </td>
              <td className="px-4 py-3">
                <div className="h-4 w-10 bg-neutral-200 rounded animate-pulse" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ClientsTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-neutral-50 border-b border-neutral-200">
          <tr>
            <th className="text-left text-sm font-medium text-neutral-600 px-4 py-3">Name</th>
            <th className="text-left text-sm font-medium text-neutral-600 px-4 py-3">Email</th>
            <th className="text-left text-sm font-medium text-neutral-600 px-4 py-3">Company</th>
            <th className="w-20" />
          </tr>
        </thead>
        <tbody>
          {[...Array(rows)].map((_, i) => (
            <tr key={i} className="border-b border-neutral-100 last:border-0">
              <td className="px-4 py-3">
                <div className="h-4 w-32 bg-neutral-200 rounded animate-pulse" />
              </td>
              <td className="px-4 py-3">
                <div className="h-4 w-40 bg-neutral-200 rounded animate-pulse" />
              </td>
              <td className="px-4 py-3">
                <div className="h-4 w-24 bg-neutral-200 rounded animate-pulse" />
              </td>
              <td className="px-4 py-3">
                <div className="h-4 w-10 bg-neutral-200 rounded animate-pulse" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-8">
      <div className="space-y-3 animate-pulse">
        <div className="h-4 w-3/4 bg-neutral-200 rounded" />
        <div className="h-4 w-1/2 bg-neutral-200 rounded" />
        <div className="h-4 w-5/6 bg-neutral-200 rounded" />
      </div>
    </div>
  );
}
