interface AdminAnalyticsProps {
  byBlock: Array<{ block: string; count: number; open: number }>;
  byCategory: Array<{ category: string; count: number }>;
  total: number;
}

export function AdminAnalytics({ byBlock, byCategory, total }: AdminAnalyticsProps) {
  const safeTotal = Math.max(1, total);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-3">
        <h3 className="text-sm font-semibold text-white">Issues by Hostel Block</h3>
        <div className="space-y-3">
          {byBlock.map((row) => {
            const pct = Math.round((row.count / safeTotal) * 100);
            return (
              <div key={row.block} className="space-y-1">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>{row.block}</span>
                  <span className="text-slate-400">
                    {row.count} total ({row.open} open)
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-3">
        <h3 className="text-sm font-semibold text-white">Issues by Category</h3>
        <div className="space-y-3">
          {byCategory.map((row) => {
            const pct = Math.round((row.count / safeTotal) * 100);
            return (
              <div key={row.category} className="space-y-1">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>{row.category}</span>
                  <span className="text-slate-400">
                    {row.count} ({pct}%)
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-sky-400 rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
