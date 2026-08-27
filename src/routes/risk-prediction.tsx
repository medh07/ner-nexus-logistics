import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RTooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from "recharts";
import { PageHeader, Panel, PanelHeader, PrototypeNote, ScoreBar, StatTile } from "@/components/kit";
import { Select } from "./route-intelligence";
import {
  CORRIDORS,
  FACTOR_WEIGHTS,
  HORIZON_RISK,
  computeRiskScore,
  riskLevelFromScore,
  RISK_LABEL,
  riskBgClass,
} from "@/lib/ner-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/risk-prediction")({
  head: () => ({
    meta: [
      { title: "Risk & Prediction — NER Smart Logistics" },
      {
        name: "description",
        content:
          "Prototype disruption probability across 1, 6, 12 and 24 hour horizons with weighted rainfall, landslide, flood and traffic factors.",
      },
      { property: "og:title", content: "Risk & Prediction — NER Smart Logistics" },
      { property: "og:description", content: "Corridor disruption forecasting for the North Eastern Region." },
    ],
  }),
  component: RiskPage,
});

function RiskPage() {
  const [corridorId, setCorridorId] = useState("NH-37");
  const corridor = CORRIDORS.find((c) => c.id === corridorId)!;
  const score = computeRiskScore(corridor.factors);
  const level = riskLevelFromScore(score);

  const factorRows = (Object.keys(FACTOR_WEIGHTS) as (keyof typeof FACTOR_WEIGHTS)[]).map((k) => ({
    factor: k,
    value: corridor.factors[k],
    weight: Math.round(FACTOR_WEIGHTS[k] * 100),
    contribution: Math.round(corridor.factors[k] * FACTOR_WEIGHTS[k]),
  }));

  const labels: Record<string, string> = {
    rainfall: "Rainfall",
    landslide: "Landslide",
    flood: "Flood",
    traffic: "Traffic",
    roadCondition: "Road Condition",
    bridge: "Bridge Status",
    incidents: "Historical Incidents",
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Risk & Prediction"
        subtitle="Weighted corridor risk model and short-horizon disruption probability"
        right={
          <div className="w-56">
            <Select
              label="Corridor"
              value={corridorId}
              onChange={setCorridorId}
              options={CORRIDORS.map((c) => c.id)}
            />
          </div>
        }
      />

      <PrototypeNote>
        These are prototype predictions computed from synthetic weather, terrain and incident inputs. They are
        not validated forecasts and must not be used for operational decisions.
      </PrototypeNote>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-4">
        <StatTile label="Corridor" value={corridor.name} tone="cyan" hint={corridor.label} />
        <StatTile label="Risk Score" value={`${score}/100`} tone={score >= 65 ? "danger" : "warn"} />
        <StatTile label="Accessibility" value={`${100 - score}/100`} tone="ok" />
        <StatTile label="Level" value={RISK_LABEL[level]} tone={score >= 65 ? "danger" : "warn"} />
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <Panel>
          <PanelHeader title="Disruption Probability by Horizon" subtitle="Prototype prediction" />
          <div className="h-64 px-2 py-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={HORIZON_RISK} margin={{ top: 4, right: 12, bottom: 0, left: -18 }}>
                <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                <XAxis dataKey="horizon" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} unit="%" />
                <RTooltip
                  contentStyle={{ background: "#1b2333", border: "1px solid #2f3a4f", borderRadius: 10, fontSize: 12 }}
                />
                <Bar dataKey="probability" fill="var(--color-chart-1)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="Risk Factor Profile" subtitle="Weighted model inputs" />
          <div className="h-64 px-2 py-3">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={factorRows.map((f) => ({ subject: labels[f.factor], value: f.value }))}>
                <PolarGrid stroke="rgba(148,163,184,0.18)" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "#94a3b8" }} />
                <Radar dataKey="value" stroke="var(--color-chart-2)" fill="var(--color-chart-2)" fillOpacity={0.35} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <Panel>
        <PanelHeader title="Factor Contribution" subtitle="Risk score = Σ (factor × weight)" />
        <ul className="space-y-3 px-4 py-3">
          {factorRows.map((f) => (
            <li key={f.factor} className="flex flex-wrap items-center gap-3">
              <span className="w-40 shrink-0 text-xs">{labels[f.factor]}</span>
              <ScoreBar score={f.value} className="min-w-40 flex-1" />
              <span className="w-14 text-right text-[11px] text-muted-foreground">{f.value}%</span>
              <span className="w-20 text-right text-[11px] text-muted-foreground">w {f.weight}%</span>
              <span
                className={cn(
                  "w-16 shrink-0 rounded-md border px-1.5 py-0.5 text-center text-[10px] font-semibold",
                  riskBgClass(riskLevelFromScore(f.value)),
                )}
              >
                +{f.contribution}
              </span>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
