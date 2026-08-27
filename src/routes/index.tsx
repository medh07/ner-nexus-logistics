import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Gauge,
  Truck,
  TriangleAlert,
  BriefcaseMedical,
  Clock,
  Maximize2,
  CloudRain,
  Layers,
} from "lucide-react";
import { KpiCard, Panel, PanelHeader } from "@/components/kit";
import { NerMap } from "@/components/NerMap";
import type { MapLayers } from "@/components/NerMapInner";
import {
  AlertsPanel,
  AiPredictionCard,
  CorridorDetailCard,
  CommoditiesPanel,
  AccessibilityByStatePanel,
  SmartInsightBanner,
  MobileAppPreview,
} from "@/components/dashboard";
import { CORRIDORS, DEMAND_7D, RISK_COLORS, type Corridor } from "@/lib/ner-data";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Command Center — NER Smart Logistics" },
      {
        name: "description",
        content:
          "Real-time logistics intelligence for North East India: accessibility scores, disruption risk, live fleet and AI route recommendations.",
      },
      { property: "og:title", content: "Command Center — NER Smart Logistics" },
      {
        property: "og:description",
        content:
          "Monitor NER road accessibility, predict disruptions and reroute emergency cargo from one command center.",
      },
    ],
  }),
  component: Dashboard,
});

const LAYER_KEYS: { key: keyof MapLayers; label: string }[] = [
  { key: "roadRisk", label: "Road Risk" },
  { key: "weather", label: "Weather" },
  { key: "traffic", label: "Traffic" },
  { key: "incidents", label: "Incidents" },
  { key: "bridges", label: "Bridges" },
  { key: "warehouses", label: "Warehouses" },
  { key: "vehicles", label: "Vehicles" },
];

function Dashboard() {
  const [layers, setLayers] = useState<MapLayers>({
    roadRisk: true,
    weather: false,
    traffic: false,
    incidents: true,
    bridges: false,
    warehouses: true,
    vehicles: true,
  });
  const [selected, setSelected] = useState<Corridor | null>(
    CORRIDORS.find((c) => c.id === "NH-37") ?? null,
  );
  const [expanded, setExpanded] = useState(false);

  function toggle(key: keyof MapLayers) {
    setLayers((l) => ({ ...l, [key]: !l[key] }));
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-bold tracking-[0.14em] text-cyan uppercase sm:text-2xl">
            Command Center
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Real-time Logistics Intelligence for North East Region
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-lg border border-border bg-surface/70 px-3 py-2">
            Sunday, 18 May 2025 · 10:24 IST
          </span>
          <span className="flex items-center gap-1.5 rounded-lg border border-border bg-surface/70 px-3 py-2">
            <CloudRain className="h-3.5 w-3.5 text-cyan" /> Guwahati 28°C · Heavy rain likely
          </span>
          <span className="flex items-center gap-1.5 rounded-lg border border-ok/30 bg-ok/10 px-3 py-2 text-ok">
            <span className="h-2 w-2 rounded-full bg-ok" /> All systems operational
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <KpiCard
          label="Network Accessibility"
          value="82%"
          status="Good"
          delta={{ value: "9.2% vs yesterday", up: true }}
          icon={<Gauge className="h-4 w-4" />}
          tone="cyan"
          spark={[68, 72, 70, 76, 74, 79, 82]}
        />
        <KpiCard
          label="Active Vehicles"
          value="124"
          status="Live"
          delta={{ value: "14 since yesterday", up: true }}
          icon={<Truck className="h-4 w-4" />}
          tone="purple"
          spark={[102, 108, 112, 106, 114, 118, 124]}
        />
        <KpiCard
          label="Active Disruptions"
          value="17"
          status="High Priority"
          delta={{ value: "4 new today", up: false }}
          icon={<TriangleAlert className="h-4 w-4" />}
          tone="danger"
          spark={[9, 12, 11, 14, 13, 15, 17]}
        />
        <KpiCard
          label="Emergency Shipments"
          value="18"
          status="In Transit"
          delta={{ value: "3 new today", up: true }}
          icon={<BriefcaseMedical className="h-4 w-4" />}
          tone="ok"
          spark={[12, 13, 15, 14, 16, 17, 18]}
        />
        <KpiCard
          label="ETA Compliance"
          value="91%"
          status="On Time"
          delta={{ value: "7.6% vs yesterday", up: true }}
          icon={<Clock className="h-4 w-4" />}
          tone="warn"
          spark={[80, 83, 81, 86, 88, 89, 91]}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <Panel className="overflow-hidden">
          <PanelHeader
            title="AI Accessibility Map"
            subtitle="Real-time road accessibility & risk levels"
            right={
              <>
                <Link
                  to="/accessibility-map"
                  className="hidden rounded-lg border border-border bg-background/50 px-2.5 py-1.5 text-[11px] text-muted-foreground sm:inline-flex"
                >
                  All States
                </Link>
                <button
                  onClick={() => setExpanded((e) => !e)}
                  className="rounded-lg border border-border bg-background/50 p-1.5 text-muted-foreground"
                  aria-label="Toggle map size"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                </button>
              </>
            }
          />
          <div className="flex flex-wrap items-center gap-3 border-b border-border/60 px-4 py-2 text-[11px]">
            <span className="label-xs">Risk Level:</span>
            {(["low", "moderate", "high", "blocked"] as const).map((l) => (
              <span key={l} className="flex items-center gap-1.5 capitalize text-muted-foreground">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: RISK_COLORS[l] }} />
                {l === "blocked" ? "Blocked" : l}
              </span>
            ))}
            <span className="ml-auto text-muted-foreground/80">Click any corridor for details</span>
          </div>

          <div className="relative">
            <div className={cn("w-full", expanded ? "h-[38rem]" : "h-[26rem] sm:h-[30rem]")}>
              <NerMap layers={layers} onSelectCorridor={setSelected} highlightCorridorIds={["NH-37"]} />
            </div>
            {selected ? (
              <div className="pointer-events-auto absolute bottom-3 left-3 z-[500] hidden sm:block">
                <CorridorDetailCard corridor={selected} onClose={() => setSelected(null)} />
              </div>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-2 border-t border-border/60 px-4 py-2.5">
            <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Layers className="h-3.5 w-3.5" /> Layers
            </span>
            {LAYER_KEYS.map((l) => (
              <button
                key={l.key}
                onClick={() => toggle(l.key)}
                className={cn(
                  "rounded-lg border px-2.5 py-1.5 text-[11px] font-medium transition-colors",
                  layers[l.key]
                    ? "border-cyan/40 bg-cyan/12 text-cyan"
                    : "border-border bg-background/40 text-muted-foreground hover:text-foreground",
                )}
              >
                {l.label}
              </button>
            ))}
          </div>
          {selected ? (
            <div className="border-t border-border/60 p-3 sm:hidden">
              <CorridorDetailCard corridor={selected} />
            </div>
          ) : null}
        </Panel>

        <div className="space-y-3">
          <AlertsPanel compact />
          <AiPredictionCard />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          <Panel className="lg:col-span-1">
            <PanelHeader
              title="Demand Forecasting"
              subtitle="Next 7 days (units)"
              right={
                <Link to="/demand-forecasting" className="text-[11px] font-semibold text-cyan">
                  View Report
                </Link>
              }
            />
            <div className="h-56 px-2 py-3">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={DEMAND_7D} margin={{ top: 4, right: 8, bottom: 0, left: -18 }}>
                  <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
                  <RTooltip
                    contentStyle={{
                      background: "#1b2333",
                      border: "1px solid #2f3a4f",
                      borderRadius: 10,
                      fontSize: 12,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Line type="monotone" dataKey="Assam" stroke="var(--color-chart-1)" strokeWidth={2} dot={{ r: 2 }} />
                  <Line type="monotone" dataKey="Manipur" stroke="var(--color-chart-2)" strokeWidth={2} dot={{ r: 2 }} />
                  <Line type="monotone" dataKey="Meghalaya" stroke="var(--color-chart-3)" strokeWidth={2} dot={{ r: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Panel>
          <CommoditiesPanel />
          <AccessibilityByStatePanel />
        </div>
        <MobileAppPreview />
      </div>

      <SmartInsightBanner />
    </div>
  );
}
