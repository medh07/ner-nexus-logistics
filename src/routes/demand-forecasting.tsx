import { createFileRoute } from "@tanstack/react-router";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RTooltip,
  Legend,
} from "recharts";
import { PageHeader, Panel, PanelHeader, PrototypeNote, ScoreBar, StatTile } from "@/components/kit";
import { DEMAND_7D, DEMAND_30D, HUBS, COMMODITIES } from "@/lib/ner-data";

export const Route = createFileRoute("/demand-forecasting")({
  head: () => ({
    meta: [
      { title: "Demand Forecasting — NER Smart Logistics" },
      {
        name: "description",
        content:
          "7-day and 30-day logistics demand forecasts by state, commodity, warehouse and emergency supply category.",
      },
      { property: "og:title", content: "Demand Forecasting — NER Smart Logistics" },
      { property: "og:description", content: "State, commodity and warehouse demand projections for NER." },
    ],
  }),
  component: DemandPage,
});

const STATE_DEMAND = [
  { state: "Assam", demand: 137 },
  { state: "Manipur", demand: 84 },
  { state: "Meghalaya", demand: 101 },
  { state: "Tripura", demand: 76 },
  { state: "Nagaland", demand: 58 },
  { state: "Mizoram", demand: 44 },
  { state: "Arunachal", demand: 51 },
  { state: "Sikkim", demand: 33 },
];

const EMERGENCY_DEMAND = [
  { category: "Medical Supplies", units: 62 },
  { category: "Drinking Water", units: 48 },
  { category: "Food Relief", units: 55 },
  { category: "Shelter Material", units: 21 },
  { category: "Fuel Reserve", units: 34 },
];

const tooltipStyle = {
  background: "#1b2333",
  border: "1px solid #2f3a4f",
  borderRadius: 10,
  fontSize: 12,
};

function DemandPage() {
  return (
    <div className="space-y-4">
      <PageHeader title="Demand Forecasting" subtitle="Movement demand projections across the NER network" />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="7-Day Demand" value="4,318 T" tone="cyan" hint="+12.4% vs last week" />
        <StatTile label="30-Day Projection" value="18,940 T" tone="purple" />
        <StatTile label="Capacity Headroom" value="11%" tone="warn" hint="Guwahati constrained" />
        <StatTile label="Emergency Reserve" value="220 T" tone="ok" />
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <Panel>
          <PanelHeader title="7-Day Forecast by State" subtitle="Units of movement demand" />
          <div className="h-64 px-2 py-3">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={DEMAND_7D} margin={{ top: 4, right: 12, bottom: 0, left: -18 }}>
                <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <RTooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="Assam" stroke="var(--color-chart-1)" strokeWidth={2} />
                <Line type="monotone" dataKey="Manipur" stroke="var(--color-chart-2)" strokeWidth={2} />
                <Line type="monotone" dataKey="Meghalaya" stroke="var(--color-chart-3)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="30-Day Demand vs Capacity" subtitle="Network-wide" />
          <div className="h-64 px-2 py-3">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DEMAND_30D} margin={{ top: 4, right: 12, bottom: 0, left: -18 }}>
                <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} interval={4} />
                <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <RTooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="demand" stroke="var(--color-chart-1)" fill="var(--color-chart-1)" fillOpacity={0.22} />
                <Area type="monotone" dataKey="capacity" stroke="var(--color-chart-5)" fill="transparent" strokeDasharray="6 6" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="State Demand Distribution" />
          <div className="h-64 px-2 py-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={STATE_DEMAND} margin={{ top: 4, right: 12, bottom: 0, left: -18 }}>
                <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                <XAxis dataKey="state" tick={{ fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <RTooltip contentStyle={tooltipStyle} />
                <Bar dataKey="demand" fill="var(--color-chart-2)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="Emergency Supply Demand" subtitle="Next 7 days" />
          <div className="h-64 px-2 py-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={EMERGENCY_DEMAND} layout="vertical" margin={{ top: 4, right: 16, bottom: 0, left: 40 }}>
                <CartesianGrid stroke="rgba(148,163,184,0.12)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="category" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={90} />
                <RTooltip contentStyle={tooltipStyle} />
                <Bar dataKey="units" fill="var(--color-chart-3)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <Panel>
          <PanelHeader title="Warehouse Demand Pressure" subtitle="Utilization vs capacity" />
          <ul className="space-y-3 px-4 py-3">
            {HUBS.map((h) => (
              <li key={h.id} className="flex items-center gap-3">
                <span className="w-24 shrink-0 truncate text-xs">{h.name}</span>
                <ScoreBar score={h.utilization} className="flex-1" />
                <span className="w-24 text-right text-[11px] text-muted-foreground">
                  {h.utilization}% · {h.capacityTons.toLocaleString()} T
                </span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel>
          <PanelHeader title="Commodity Demand" subtitle="This month" />
          <ul className="divide-y divide-border/60">
            {COMMODITIES.map((c) => (
              <li key={c.name} className="flex items-center justify-between px-4 py-3 text-xs">
                <span>{c.name}</span>
                <span className="text-muted-foreground">{c.value}</span>
                <span className={c.up ? "text-ok" : "text-danger"}>
                  {c.up ? "+" : "-"}
                  {c.trend}%
                </span>
              </li>
            ))}
          </ul>
          <div className="p-4">
            <PrototypeNote>
              Forecasts are synthetic prototype projections generated from historical patterns in the demo
              dataset.
            </PrototypeNote>
          </div>
        </Panel>
      </div>
    </div>
  );
}
