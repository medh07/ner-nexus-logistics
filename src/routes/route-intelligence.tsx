import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Brain,
  CheckCircle2,
  CloudRain,
  Loader2,
  Mountain,
  RotateCcw,
  Route as RouteIcon,
  TriangleAlert,
} from "lucide-react";
import { PageHeader, Panel, PanelHeader, PrototypeNote, StatTile } from "@/components/kit";
import { NerMap } from "@/components/NerMap";
import {
  CARGO_PRIORITY,
  HUBS,
  ROUTE_OPTIONS,
  rankRoutes,
  recommendationReason,
  routeCost,
  riskLevelFromScore,
  riskBgClass,
  RISK_LABEL,
} from "@/lib/ner-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/route-intelligence")({
  head: () => ({
    meta: [
      { title: "Route Intelligence — NER Smart Logistics" },
      {
        name: "description",
        content:
          "Compare NER route options by distance, ETA, risk score and disruption probability with cargo-priority aware recommendations.",
      },
      { property: "og:title", content: "Route Intelligence — NER Smart Logistics" },
      {
        property: "og:description",
        content: "Cargo-priority aware route comparison and reroute reasoning for North East India.",
      },
    ],
  }),
  component: RouteIntelligencePage,
});

const CARGO_TYPES = Object.keys(CARGO_PRIORITY);

/* ------------------------------------------------------------------ */
/* Environmental simulation layer (front-end only, non-destructive)   */
/* ------------------------------------------------------------------ */

type SimEvent = "off" | "rain" | "landslide";

/** Multipliers applied per route id for each simulated event. */
const SIM_IMPACT: Record<Exclude<SimEvent, "off">, Record<string, number>> = {
  rain: { A: 1.3, C: 1.2 },
  landslide: { A: 1.4 },
};

const SIM_LABEL: Record<Exclude<SimEvent, "off">, string> = {
  rain: "Heavy Rainfall",
  landslide: "Landslide Incident",
};

function simulateRoutes(event: SimEvent) {
  if (event === "off") return ROUTE_OPTIONS;
  const impact = SIM_IMPACT[event];
  return ROUTE_OPTIONS.map((r) => {
    const mult = impact[r.id];
    if (!mult) return r;
    return {
      ...r,
      riskScore: Math.min(100, Math.round(r.riskScore * mult)),
      disruptionProbability: Math.min(95, Math.round(r.disruptionProbability * mult)),
    };
  });
}

function RouteIntelligencePage() {
  const cities = HUBS.map((h) => h.name);
  const [origin, setOrigin] = useState("Guwahati");
  const [destination, setDestination] = useState("Imphal");
  const [cargo, setCargo] = useState("Medical Supplies");
  const priority = CARGO_PRIORITY[cargo] ?? 50;

  const [simEvent, setSimEvent] = useState<SimEvent>("off");
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    if (simEvent === "off") return;
    setAnalyzing(true);
    const t = setTimeout(() => setAnalyzing(false), 900);
    return () => clearTimeout(t);
  }, [simEvent]);

  // Displayed routes: original data when off, temporary adjusted copy when on.
  const displayed = useMemo(() => simulateRoutes(simEvent), [simEvent]);
  const affectedIds = useMemo(
    () => (simEvent === "off" ? new Set<string>() : new Set(Object.keys(SIM_IMPACT[simEvent]))),
    [simEvent],
  );

  const ranked = useMemo(() => rankRoutes(displayed, priority), [displayed, priority]);
  const best = ranked[0]!;
  const fastest = [...displayed].sort((a, b) => a.hours - b.hours)[0]!;
  const originalBest = rankRoutes(ROUTE_OPTIONS, priority)[0]!;
  const recommendationSwitched = simEvent !== "off" && best.id !== originalBest.id;
  const [activeId, setActiveId] = useState(best.id);
  const active = displayed.find((r) => r.id === activeId) ?? best;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Route Intelligence"
        subtitle="Resilience-weighted route comparison for the Guwahati – Imphal emergency corridor"
      />

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-[20rem_minmax(0,1fr)]">
        <Panel className="h-fit">
          <PanelHeader title="Trip Parameters" />
          <div className="space-y-3 p-4">
            <Select label="Origin" value={origin} onChange={setOrigin} options={cities} />
            <Select label="Destination" value={destination} onChange={setDestination} options={cities} />
            <Select label="Cargo Type" value={cargo} onChange={setCargo} options={CARGO_TYPES} />
            <div className="rounded-lg border border-border bg-background/40 px-3 py-2">
              <p className="label-xs">Cargo Priority Weight</p>
              <p className="mt-1 font-display text-2xl font-bold text-cyan">{priority}/100</p>
              <p className="text-[11px] text-muted-foreground">
                {priority >= 90
                  ? "Life-critical cargo — reliability outranks distance."
                  : "Commercial cargo — distance and time weigh more heavily."}
              </p>
            </div>
            <PrototypeNote>
              Prototype computation over synthetic data. Cost = distance + ETA + risk penalty × cargo
              priority.
            </PrototypeNote>

            <div className="space-y-2 rounded-lg border border-border bg-background/40 p-3">
              <p className="label-xs">Simulate Environmental Event</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSimEvent(simEvent === "rain" ? "off" : "rain")}
                  className={cn(
                    "flex items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-[11px] font-medium transition-colors",
                    simEvent === "rain"
                      ? "border-warn/50 bg-warn/12 text-warn"
                      : "border-border bg-background/40 text-muted-foreground hover:text-foreground",
                  )}
                >
                  <CloudRain className="h-3.5 w-3.5" /> Heavy Rainfall
                </button>
                <button
                  onClick={() => setSimEvent(simEvent === "landslide" ? "off" : "landslide")}
                  className={cn(
                    "flex items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-[11px] font-medium transition-colors",
                    simEvent === "landslide"
                      ? "border-danger/50 bg-danger/12 text-danger"
                      : "border-border bg-background/40 text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Mountain className="h-3.5 w-3.5" /> Landslide
                </button>
              </div>
              {analyzing ? (
                <p className="flex items-center gap-1.5 text-[11px] text-cyan">
                  <Loader2 className="h-3 w-3 animate-spin" /> Analyzing environmental impact...
                </p>
              ) : null}
              {simEvent !== "off" && !analyzing ? (
                <button
                  onClick={() => setSimEvent("off")}
                  className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-border bg-background/40 px-2 py-2 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  <RotateCcw className="h-3 w-3" /> Reset Simulation
                </button>
              ) : null}
            </div>
          </div>
        </Panel>

        <div className="space-y-3">
          <Panel className="overflow-hidden">
            <PanelHeader
              title="Route Comparison Map"
              subtitle={`${origin} → ${destination} · ${cargo}`}
            />
            <div className="h-[22rem] w-full">
              <NerMap
                showCorridors={false}
                layers={{ warehouses: true, vehicles: false, incidents: true }}
                extraPaths={displayed.map((r) => ({
                  id: r.id,
                  path: r.path,
                  color: affectedIds.has(r.id)
                    ? "#f43f5e"
                    : r.id === active.id
                      ? "#22d3ee"
                      : r.riskScore >= 65
                        ? "#f43f5e"
                        : "#64748b",
                  dashed: r.id !== active.id,
                }))}
              />
            </div>
          </Panel>

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
            {ranked.map((r, i) => {
              const level = riskLevelFromScore(r.riskScore);
              const recommended = i === 0;
              return (
                <button
                  key={r.id}
                  onClick={() => setActiveId(r.id)}
                  className={cn(
                    "rounded-xl border p-4 text-left transition-colors",
                    activeId === r.id ? "border-cyan/50 bg-cyan/8" : "border-border bg-surface/70",
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold">{r.label}</p>
                    {affectedIds.has(r.id) ? (
                      <span className="flex shrink-0 items-center gap-1 rounded-md border border-danger/40 bg-danger/12 px-1.5 py-0.5 text-[10px] font-bold text-danger">
                        <TriangleAlert className="h-3 w-3" /> {SIM_LABEL[simEvent as Exclude<SimEvent, "off">].toUpperCase()}
                      </span>
                    ) : recommended ? (
                      <span className="flex shrink-0 items-center gap-1 rounded-md border border-ok/35 bg-ok/12 px-1.5 py-0.5 text-[10px] font-bold text-ok">
                        <CheckCircle2 className="h-3 w-3" /> BEST
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">{r.legs.join(" → ")}</p>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <Meta label="Distance" value={`${r.distanceKm} km`} />
                    <Meta label="ETA" value={`${Math.floor(r.hours)}h${String(Math.round((r.hours % 1) * 60)).padStart(2, "0")}`} />
                    <Meta label="Risk" value={`${r.riskScore}/100`} />
                    <Meta label="Disruption" value={`${r.disruptionProbability}%`} />
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span
                      className={cn("rounded-md border px-2 py-0.5 text-[10px] font-semibold", riskBgClass(level))}
                    >
                      {RISK_LABEL[level]} Risk
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      cost {routeCost(r, priority)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <Panel>
            <PanelHeader title="AI Recommendation" right={<Brain className="h-4 w-4 text-cyan" />} />
            <div className="space-y-3 p-4">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <StatTile label="Recommended" value={`Route ${best.id}`} tone="cyan" />
                <StatTile label="Disruption Prob." value={`${best.disruptionProbability}%`} tone="ok" />
                <StatTile label="Added Distance" value={`+${Math.max(0, best.distanceKm - fastest.distanceKm)} km`} />
                <StatTile
                  label="Added Time"
                  value={`+${Math.max(0, best.hours - fastest.hours).toFixed(1)} hrs`}
                />
              </div>
              <p className="flex gap-2 rounded-lg border border-cyan/25 bg-cyan/8 p-3 text-xs leading-relaxed text-foreground/90">
                <RouteIcon className="mt-0.5 h-4 w-4 shrink-0 text-cyan" />
                {recommendationReason(best, fastest, cargo, priority)}
              </p>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="label-xs leading-tight">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  );
}

export function Select({
  label,
  value,
  onChange,
  options,
  render,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  render?: (value: string) => string;
}) {
  return (
    <label className="block">
      <span className="label-xs">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-input bg-surface-2/60 px-3 py-2 text-sm outline-none focus:border-cyan/50"
      >
        {options.map((o) => (
          <option key={o} value={o} className="bg-surface text-foreground">
            {render ? render(o) : o}
          </option>
        ))}
      </select>
    </label>
  );
}

