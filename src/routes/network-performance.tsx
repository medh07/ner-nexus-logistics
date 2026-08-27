import { createFileRoute } from "@tanstack/react-router";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RTooltip,
  Legend,
} from "recharts";
import { PageHeader, Panel, PanelHeader, ScoreBar, StatTile } from "@/components/kit";
import { NETWORK_PERFORMANCE, NETWORK_TREND, CORRIDORS, corridorRisk } from "@/lib/ner-data";

export const Route = createFileRoute("/network-performance")({
  head: () => ({
    meta: [
      { title: "Network Performance — NER Smart Logistics" },
      {
        name: "description",
        content:
          "Network accessibility, average ETA, delay rate, route reliability and emergency shipment protection metrics for NER.",
      },
      { property: "og:title", content: "Network Performance — NER Smart Logistics" },
      { property: "og:description", content: "Operational KPIs for the North East India logistics network." },
    ],
  }),
  component: NetworkPage,
});

function NetworkPage() {
  const p = NETWORK_PERFORMANCE;
  return (
    <div className="space-y-4">
      <PageHeader title="Network Performance" subtitle="Corridor reliability and service-level performance" />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Network Accessibility" value={`${p.accessibility}%`} tone="cyan" />
        <StatTile label="Average ETA" value={`${Math.floor(p.avgEtaMinutes / 60)}h ${p.avgEtaMinutes % 60}m`} />
        <StatTile label="Delay Rate" value={`${p.delayRate}%`} tone="warn" />
        <StatTile label="Route Reliability" value={`${p.reliability}%`} tone="ok" />
        <StatTile label="Avg Disruption Duration" value={`${p.avgDisruptionHours} hrs`} tone="warn" />
        <StatTile label="Vehicles Affected (7d)" value={String(p.vehiclesAffected)} tone="danger" />
        <StatTile label="Emergency Protected" value={`${p.emergencyProtected}%`} tone="ok" />
        <StatTile label="Corridors Monitored" value={String(CORRIDORS.length)} tone="purple" />
      </div>

      <Panel>
        <PanelHeader title="6-Week Trend" subtitle="Accessibility, reliability and delay rate" />
        <div className="h-72 px-2 py-3">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={NETWORK_TREND} margin={{ top: 4, right: 16, bottom: 0, left: -16 }}>
              <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <RTooltip
                contentStyle={{ background: "#1b2333", border: "1px solid #2f3a4f", borderRadius: 10, fontSize: 12 }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="accessibility" stroke="var(--color-chart-1)" strokeWidth={2} />
              <Line type="monotone" dataKey="reliability" stroke="var(--color-chart-3)" strokeWidth={2} />
              <Line type="monotone" dataKey="delays" stroke="var(--color-chart-5)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <Panel>
        <PanelHeader title="Corridor Reliability Index" subtitle="100 − risk score" />
        <ul className="space-y-3 px-4 py-3">
          {CORRIDORS.map((c) => {
            const reliability = 100 - corridorRisk(c);
            return (
              <li key={c.id} className="flex flex-wrap items-center gap-3">
                <span className="w-52 shrink-0 truncate text-xs">{c.label}</span>
                <ScoreBar score={reliability} className="min-w-40 flex-1" />
                <span className="w-28 text-right text-[11px] text-muted-foreground">
                  {reliability}/100 · {c.distanceKm} km
                </span>
              </li>
            );
          })}
        </ul>
      </Panel>
    </div>
  );
}
