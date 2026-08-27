import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

export function Panel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-xl border border-border bg-surface/80 shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset]",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function PanelHeader({
  title,
  subtitle,
  right,
  className,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "flex items-start justify-between gap-3 border-b border-border/70 px-4 py-3",
        className,
      )}
    >
      <div>
        <h2 className="label-xs text-foreground/90">{title}</h2>
        {subtitle ? <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p> : null}
      </div>
      {right ? <div className="flex shrink-0 items-center gap-2">{right}</div> : null}
    </header>
  );
}

export function PageHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle: string;
  right?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-xl font-semibold tracking-wide text-primary uppercase sm:text-2xl">
          {title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      </div>
      {right}
    </div>
  );
}

const TONES = {
  cyan: "from-cyan/18 border-cyan/30 text-cyan",
  purple: "from-purple/18 border-purple/30 text-purple",
  danger: "from-danger/18 border-danger/35 text-danger",
  ok: "from-ok/18 border-ok/30 text-ok",
  warn: "from-warn/18 border-warn/30 text-warn",
} as const;

export type Tone = keyof typeof TONES;

export function KpiCard({
  label,
  value,
  status,
  delta,
  icon,
  tone = "cyan",
  spark,
}: {
  label: string;
  value: string;
  status?: string;
  delta?: { value: string; up: boolean };
  icon: ReactNode;
  tone?: Tone;
  spark?: number[];
}) {
  const t = TONES[tone];
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border bg-gradient-to-br to-surface/40 px-4 pt-3 pb-4",
        t,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="label-xs max-w-[70%] leading-tight">{label}</p>
        <div className={cn("rounded-lg border border-current/30 bg-background/40 p-1.5", t)}>{icon}</div>
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="font-display text-3xl font-semibold text-foreground">{value}</span>
        {status ? <span className={cn("text-xs font-semibold", t.split(" ").pop())}>{status}</span> : null}
      </div>
      {delta ? (
        <p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
          {delta.up ? (
            <TrendingUp className="h-3 w-3 text-ok" />
          ) : (
            <TrendingDown className="h-3 w-3 text-danger" />
          )}
          {delta.value}
        </p>
      ) : null}
      {spark ? <Sparkline points={spark} className="mt-2" /> : null}
    </div>
  );
}

export function Sparkline({ points, className }: { points: number[]; className?: string }) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const d = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * 100;
      const y = 24 - ((p - min) / range) * 20 - 2;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg viewBox="0 0 100 24" preserveAspectRatio="none" className={cn("h-6 w-full opacity-80", className)}>
      <path d={d} fill="none" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function ScoreBar({ score, className }: { score: number; className?: string }) {
  const color = score >= 75 ? "bg-ok" : score >= 60 ? "bg-warn" : score >= 50 ? "bg-high" : "bg-danger";
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-background/70", className)}>
      <div className={cn("h-full rounded-full", color)} style={{ width: `${score}%` }} />
    </div>
  );
}

export function StatTile({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "cyan" | "purple" | "ok" | "warn" | "danger";
}) {
  const color = tone ? `text-${tone}` : "text-foreground";
  return (
    <div className="rounded-lg border border-border bg-background/40 px-3 py-2.5">
      <p className="label-xs leading-tight">{label}</p>
      <p className={cn("mt-1 font-display text-xl font-semibold", color)}>{value}</p>
      {hint ? <p className="text-[11px] text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export function PrototypeNote({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-lg border border-warn/25 bg-warn/10 px-3 py-2 text-[11px] leading-relaxed text-warn">
      {children}
    </p>
  );
}
