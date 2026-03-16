'use client';

export function StatCard({ label, value, subtitle, trend }: {
  label: string;
  value: string;
  subtitle?: string;
  trend?: { points: number[]; color: string };
}) {
  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-muted-foreground mb-2">{label}</p>
          <p className="text-2xl font-semibold text-foreground">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        {trend && (
          <svg viewBox="0 0 100 40" className="h-10 w-20">
            <polyline
              points={trend.points.map((p, i) => `${(i / (trend.points.length - 1)) * 100},${40 - p * 40}`).join(' ')}
              fill="none"
              stroke={trend.color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
    </div>
  );
}
