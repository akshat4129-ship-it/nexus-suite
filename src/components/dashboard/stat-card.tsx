'use client';

export function StatCard({ label, value, subtitle, trend }: {
  label: string;
  value: string;
  subtitle?: string;
  trend?: { points: number[]; color: string };
}) {
  return (
    <div 
      className="bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-default"
      role="group"
      aria-label={`${label}: ${value}${subtitle ? `, ${subtitle}` : ''}`}
      tabIndex={0}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2" aria-hidden="true">{label}</h3>
          <p className="text-2xl font-semibold text-foreground" aria-hidden="true">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-1" aria-hidden="true">{subtitle}</p>}
        </div>
        {trend && (
          <svg viewBox="0 0 100 40" className="h-10 w-20" aria-hidden="true">
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
