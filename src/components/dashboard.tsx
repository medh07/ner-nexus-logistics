import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  TriangleAlert,
  CircleCheck,
  ChevronRight,
  Wheat,
  Building2,
  ShoppingBasket,
  Fuel,
  Factory,
  Star,
  ArrowRight,
  Signal,
  Wifi,
  BatteryFull,
  ChevronLeft,
  Home,
  Truck,
  Bell,
  FileBarChart,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Panel, PanelHeader, ScoreBar } from "./kit";
import {
  ALERTS,
  COMMODITIES,
  STATE_SCORES,
  type Alert,
  type Corridor,
  corridorRisk,
  riskLevelFromScore,
  RISK_LABEL,
  riskBgClass,
} from "@/lib/ner-data";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const SEV_STYLES: Record<string, string> = {
  High: "bg-danger/15 text-danger border-danger/30",
  Moderate: "bg-warn/15 text-warn border-warn/30",
  Low: "bg-ok/15 text-ok border-ok/30",
};

export function AlertsPanel({ compact = false }: { compact?: boolean }) {
  const [selected, setSelected] = useState<Alert | null>(null);
  const list = compact ? ALERTS.slice(0, 4) : ALERTS;

  return (
    <Panel>
      <PanelHeader
        title="Active Alerts"
        right={
          <Link to="/incidents" className="text-[11px] font-semibold text-cyan hover:underline">
            View All
          </Link>
        }
      />
      <ul className="divide-y divide-border/60">
        {list.map((a) => (
          <li key={a.id}>
            <button
              onClick={() => setSelected(a)}
              className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-2/50"
            >
              {a.severity === "Low" ? (
                <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-ok" />
              ) : (
                <TriangleAlert
                  className={cn(
                    "mt-0.5 h-4 w-4 shrink-0",
                    a.severity === "High" ? "text-danger" : "text-warn",
                  )}
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{a.title}</p>
                <p className="truncate text-[11px] text-muted-foreground">{a.location}</p>
                <p className="mt-0.5 text-[10px] text-muted-foreground/80">{a.time}</p>
              </div>
              <span
                className={cn(
                  "shrink-0 rounded-md border px-2 py-0.5 text-[10px] font-semibold",
                  SEV_STYLES[a.severity],
                )}
              >
                {a.severity}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              {selected?.title}
              {selected ? (
                <span
                  className={cn(
                    "rounded-md border px-2 py-0.5 text-[10px] font-semibold",
                    SEV_STYLES[selected.severity],
                  )}
                >
                  {selected.severity}
                </span>
              ) : null}
            </DialogTitle>
          </DialogHeader>
          {selected ? (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <Field label="Alert ID" value={selected.id} />
                <Field label="Type" value={selected.type} />
                <Field label="Location" value={selected.location} />
                <Field label="Reported" value={selected.time} />
              </div>
              <p className="rounded-lg border border-border bg-background/50 p-3 text-xs leading-relaxed text-muted-foreground">
                {selected.detail}
              </p>
              <Link
                to="/incidents"
                className="inline-flex items-center gap-1.5 rounded-lg border border-cyan/40 bg-cyan/12 px-3 py-2 text-xs font-semibold text-cyan"
              >
                Open incident workspace <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </Panel>
  );
}

export function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-background/40 px-3 py-2">
      <p className="label-xs leading-tight">{label}</p>
      <p className="mt-0.5 text-xs font-medium">{value}</p>
    </div>
  );
}

export function AiPredictionCard() {
  const pct = 72;
  const circumference = 2 * Math.PI * 42;
  return (
    <Panel>
      <PanelHeader title="AI Prediction" right={<span className="text-[11px] text-cyan">Next 6 Hours</span>} />
      <div className="flex items-center gap-4 p-4">
        <div className="relative h-28 w-28 shrink-0">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            <circle cx="50" cy="50" r="42" fill="none" stroke="oklch(0.28 0.03 260)" strokeWidth="8" />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="var(--danger)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${(pct / 100) * circumference} ${circumference}`}
            />
          </svg>
          <div className="absolute inset-0 grid place-items-center text-center">
            <div>
              <p className="font-display text-2xl font-bold text-danger">{pct}%</p>
              <p className="text-[9px] leading-tight text-muted-foreground">
                Disruption
                <br />
                Probability
              </p>
            </div>
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs leading-relaxed text-muted-foreground">
            High probability of disruption due to heavy rainfall and elevated landslide risk on the
            Assam–Manipur corridor.
          </p>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Corridor: <span className="font-semibold text-foreground">NH-37</span>
          </p>
          <Link
            to="/risk-prediction"
            className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-danger/40 bg-danger/12 px-3 py-2 text-xs font-semibold text-danger"
          >
            View Full Analysis
          </Link>
        </div>
      </div>
    </Panel>
  );
}

export function CorridorDetailCard({
  corridor,
  onClose,
}: {
  corridor: Corridor;
  onClose?: () => void;
}) {
  const score = corridorRisk(corridor);
  const level = riskLevelFromScore(score);
  return (
    <div className="w-[19rem] rounded-xl border border-cyan/25 bg-surface/95 p-3 shadow-2xl backdrop-blur">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold">{corridor.label}</p>
        <span className={cn("shrink-0 rounded-md border px-2 py-0.5 text-[10px] font-semibold", riskBgClass(level))}>
          {RISK_LABEL[level]} Risk
        </span>
      </div>
      <div className="mt-3 flex items-baseline justify-between border-t border-border/70 pt-2 text-xs">
        <span className="text-muted-foreground">Risk Score</span>
        <span className="font-display text-lg font-bold">
          {score}
          <span className="text-[11px] text-muted-foreground">/100</span>
        </span>
      </div>
      <p className="label-xs mt-2">Risk Factors</p>
      <div className="mt-1.5 grid grid-cols-3 gap-2 text-[11px]">
        <FactorPill label="Rainfall" value={corridor.factors.rainfall} />
        <FactorPill label="Landslide" value={corridor.factors.landslide} />
        <FactorPill label="Flood" value={corridor.factors.flood} />
        <FactorPill label="Traffic" value={corridor.factors.traffic} />
        <FactorPill label="Road" value={corridor.factors.roadCondition} />
        <FactorPill label="Bridge" value={corridor.factors.bridge} />
      </div>
      <div className="mt-3 space-y-1 border-t border-border/70 pt-2 text-[11px] text-muted-foreground">
        <div className="flex justify-between">
          <span>Distance</span>
          <span className="text-foreground">{corridor.distanceKm} km</span>
        </div>
        <div className="flex justify-between">
          <span>Base ETA</span>
          <span className="text-foreground">{corridor.baseHours.toFixed(1)} hrs</span>
        </div>
        <div className="flex justify-between">
          <span>Last Updated</span>
          <span className="text-foreground">18 May, 10:15 AM</span>
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <Link
          to="/route-intelligence"
          className="flex-1 rounded-lg border border-cyan/40 bg-cyan/12 py-2 text-center text-xs font-semibold text-cyan"
        >
          View Details
        </Link>
        {onClose ? (
          <button
            onClick={onClose}
            className="rounded-lg border border-border px-3 text-xs text-muted-foreground"
          >
            Close
          </button>
        ) : null}
      </div>
    </div>
  );
}

function FactorPill({ label, value }: { label: string; value: number }) {
  const tone = value >= 70 ? "text-danger" : value >= 45 ? "text-warn" : "text-ok";
  return (
    <div className="rounded-md border border-border bg-background/40 px-2 py-1.5">
      <p className="text-[9px] tracking-wide text-muted-foreground uppercase">{label}</p>
      <p className={cn("text-xs font-semibold", tone)}>{value}%</p>
    </div>
  );
}

const COMMODITY_ICONS = [Wheat, Building2, ShoppingBasket, Fuel, Factory];

export function CommoditiesPanel() {
  return (
    <Panel>
      <PanelHeader title="Top Commodities Moved" right={<span className="text-[11px] text-muted-foreground">This Month</span>} />
      <ul className="divide-y divide-border/60">
        {COMMODITIES.map((c, i) => {
          const Icon = COMMODITY_ICONS[i % COMMODITY_ICONS.length]!;
          return (
            <li key={c.name} className="flex items-center gap-3 px-4 py-2.5">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-border bg-background/50">
                <Icon className="h-4 w-4 text-cyan" />
              </div>
              <span className="min-w-0 flex-1 truncate text-sm">{c.name}</span>
              <span className="shrink-0 text-xs text-muted-foreground">{c.value}</span>
              <span
                className={cn(
                  "flex shrink-0 items-center gap-0.5 text-[11px] font-semibold",
                  c.up ? "text-ok" : "text-danger",
                )}
              >
                {c.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {c.trend}%
              </span>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}

export function AccessibilityByStatePanel() {
  return (
    <Panel>
      <PanelHeader
        title="Accessibility Score by State"
        right={<span className="text-[11px] text-muted-foreground">This Month</span>}
      />
      <ul className="space-y-2.5 px-4 py-3">
        {STATE_SCORES.map((s) => (
          <li key={s.state} className="flex items-center gap-3">
            <span className="w-28 shrink-0 truncate text-xs sm:w-36">{s.state}</span>
            <ScoreBar score={s.score} className="flex-1" />
            <span className="w-14 shrink-0 text-right text-[11px] text-muted-foreground">
              {s.score}/100
            </span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

export function SmartInsightBanner() {
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-xl border border-warn/25 bg-gradient-to-r from-warn/12 to-surface/40 px-4 py-3">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-warn/40 bg-warn/12">
        <Star className="h-4 w-4 text-warn" />
      </div>
      <p className="label-xs shrink-0 text-warn">Smart Insight</p>
      <p className="min-w-[16rem] flex-1 text-sm text-muted-foreground">
        Consider using Route via Silchar – Aizawl – Imphal. 21% safer and only 1.3 hrs additional time.
      </p>
      <Link
        to="/route-intelligence"
        className="rounded-lg border border-cyan/40 bg-cyan/12 px-3 py-2 text-xs font-semibold text-cyan"
      >
        View Recommended Routes
      </Link>
    </div>
  );
}

export function MobileAppPreview() {
  const [accepted, setAccepted] = useState(false);
  return (
    <Panel className="overflow-hidden">
      <PanelHeader title="Mobile App Preview" subtitle="Driver & field officer companion" />
      <div className="flex justify-center px-4 py-4">
        <div className="w-[17rem] rounded-[2rem] border-4 border-surface-2 bg-background p-2 shadow-2xl">
          <div className="flex items-center justify-between px-2 py-1 text-[10px] text-muted-foreground">
            <span>9:41</span>
            <span className="flex items-center gap-1">
              <Signal className="h-3 w-3" />
              <Wifi className="h-3 w-3" />
              <BatteryFull className="h-3 w-3" />
            </span>
          </div>
          <div className="flex items-center justify-between border-b border-border px-2 py-2">
            <ChevronLeft className="h-4 w-4 text-muted-foreground" />
            <p className="text-xs font-semibold">Trip Details</p>
            <span className="text-[10px] text-ok">Live</span>
          </div>
          <div className="space-y-2.5 px-2 py-3">
            <div className="flex items-center gap-2">
              <span className="grid h-6 w-6 place-items-center rounded-md bg-purple/15 text-[10px] font-bold text-purple">
                NE
              </span>
              <p className="flex-1 text-xs font-semibold">NE-027 · Medical Supplies</p>
              <span className="rounded-md border border-ok/30 bg-ok/12 px-1.5 py-0.5 text-[9px] text-ok">
                In Transit
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Guwahati → Imphal</p>
            <div className="grid grid-cols-3 gap-2 text-[10px]">
              <div>
                <p className="label-xs text-[8px]">ETA</p>
                <p className="font-semibold">08:42 PM</p>
              </div>
              <div>
                <p className="label-xs text-[8px]">Distance Left</p>
                <p className="font-semibold">142 km</p>
              </div>
              <div>
                <p className="label-xs text-[8px]">Next Stop</p>
                <p className="font-semibold">Noney</p>
              </div>
            </div>
            <div className="rounded-lg border border-danger/30 bg-danger/12 px-2 py-1.5">
              <p className="flex items-center justify-between text-[10px] font-semibold text-danger">
                HIGH RISK CORRIDOR AHEAD <span>72/100</span>
              </p>
            </div>
            <div className="rounded-lg border border-border bg-surface/70 px-2 py-2">
              <p className="label-xs text-[8px]">Recommended Action</p>
              <p className="mt-0.5 flex items-center justify-between text-[11px] font-semibold text-cyan">
                Reroute via Silchar – Aizawl <ChevronRight className="h-3 w-3" />
              </p>
              <p className="text-[10px] text-ok">+1.3 hrs · +48 km · 21% risk</p>
            </div>
            <button
              onClick={() => setAccepted(true)}
              className={cn(
                "w-full rounded-lg py-2 text-xs font-semibold transition-colors",
                accepted
                  ? "border border-ok/40 bg-ok/15 text-ok"
                  : "border border-cyan/50 bg-cyan/20 text-cyan",
              )}
            >
              {accepted ? "Reroute Accepted · Navigating" : "Accept Reroute"}
            </button>
          </div>
          <div className="flex items-center justify-between border-t border-border px-3 py-2 text-[9px] text-muted-foreground">
            <span className="flex flex-col items-center gap-0.5">
              <Home className="h-3.5 w-3.5" />
              Home
            </span>
            <span className="flex flex-col items-center gap-0.5 text-cyan">
              <Truck className="h-3.5 w-3.5" />
              Trips
            </span>
            <span className="relative flex flex-col items-center gap-0.5">
              <Bell className="h-3.5 w-3.5" />
              Alerts
              <span className="absolute -top-1 right-1 h-2.5 w-2.5 rounded-full bg-danger" />
            </span>
            <span className="flex flex-col items-center gap-0.5">
              <FileBarChart className="h-3.5 w-3.5" />
              Reports
            </span>
            <span className="flex flex-col items-center gap-0.5">
              <MoreHorizontal className="h-3.5 w-3.5" />
              More
            </span>
          </div>
        </div>
      </div>
    </Panel>
  );
}
