interface AdminAnalyticsProps {
  byBlock: Array<{ block: string; count: number; open: number }>;
  byCategory: Array<{ category: string; count: number }>;
  total: number;
}

export function AdminAnalytics({ byBlock, byCategory, total }: AdminAnalyticsProps) {
  const safeTotal = Math.max(1, total);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="rounded-2xl bg-white border border-[#E5E3DC] p-5 space-y-3 shadow-[0_2px_10px_rgba(19,34,56,0.03)]">
        <h3 className="text-sm font-bold text-[#132238]">Reports by Hostel Block</h3>
        <div className="space-y-3">
          {byBlock.map((row) => {
            const pct = Math.round((row.count / safeTotal) * 100);
            return (
              <div key={row.block} className="space-y-1">
                <div className="flex justify-between text-xs text-[#132238] font-medium">
                  <span>{row.block}</span>
                  <span className="text-[#64748B]">
                    {row.count} total ({row.open} open)
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[#ECEAE2] overflow-hidden">
                  <div className="h-full bg-[#1B6B5A] rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl bg-white border border-[#E5E3DC] p-5 space-y-3 shadow-[0_2px_10px_rgba(19,34,56,0.03)]">
        <h3 className="text-sm font-bold text-[#132238]">Reports by Category</h3>
        <div className="space-y-3">
          {byCategory.map((row) => {
            const pct = Math.round((row.count / safeTotal) * 100);
            return (
              <div key={row.category} className="space-y-1">
                <div className="flex justify-between text-xs text-[#132238] font-medium">
                  <span>{row.category}</span>
                  <span className="text-[#64748B]">
                    {row.count} ({pct}%)
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[#ECEAE2] overflow-hidden">
                  <div className="h-full bg-[#D95D39] rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
