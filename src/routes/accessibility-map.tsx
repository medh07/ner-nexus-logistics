import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Layers } from "lucide-react";
import { PageHeader, Panel, PanelHeader, ScoreBar } from "@/components/kit";
import { NerMap } from "@/components/NerMap";
import type { MapLayers } from "@/components/NerMapInner";
import { CorridorDetailCard } from "@/components/dashboard";
import {
  CORRIDORS,
  STATE_SCORES,
  RISK_COLORS,
  RISK_LABEL,
  corridorRisk,
  riskLevelFromScore,
  riskBgClass,
  type Corridor,
} from "@/lib/ner-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/accessibility-map")({
  head: () => ({
    meta: [
      { title: "Accessibility Map — NER Smart Logistics" },
      {
        name: "description",
        content:
          "GIS view of North East India road accessibility with risk-coded corridors, hubs, incidents and weather layers.",
      },
      { property: "og:title", content: "Accessibility Map — NER Smart Logistics" },
      {
        property: "og:description",
        content: "Risk-coded corridor map for the North Eastern Region logistics network.",
      },
    ],
  }),
  component: AccessibilityMapPage,
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

function AccessibilityMapPage() {
  const [layers, setLayers] = useState<MapLayers>({
    roadRisk: true,
    weather: true,
    traffic: false,
    incidents: true,
    bridges: true,
    warehouses: true,
    vehicles: true,
  });
  const [selected, setSelected] = useState<Corridor | null>(null);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Accessibility Map"
        subtitle="Composite 0–100 accessibility scoring across NER corridors and states"
      />

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <Panel className="overflow-hidden">
          <PanelHeader
            title="Corridor Risk Map"
            subtitle="Road condition · rainfall · flood · landslide · traffic · bridges · field reports"
            right={
              <div className="flex flex-wrap items-center gap-2 text-[11px]">
                {(["low", "moderate", "high", "blocked"] as const).map((l) => (
                  <span key={l} className="flex items-center gap-1 text-muted-foreground">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: RISK_COLORS[l] }} />
                    {RISK_LABEL[l]}
                  </span>
                ))}
              </div>
            }
          />
          <div className="relative h-[30rem] w-full sm:h-[34rem]">
            <NerMap layers={layers} onSelectCorridor={setSelected} />
            {selected ? (
              <div className="absolute bottom-3 left-3 z-[500] hidden sm:block">
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
                onClick={() => setLayers((s) => ({ ...s, [l.key]: !s[l.key] }))}
                className={cn(
                  "rounded-lg border px-2.5 py-1.5 text-[11px]",
                  layers[l.key]
                    ? "border-cyan/40 bg-cyan/12 text-cyan"
                    : "border-border bg-background/40 text-muted-foreground",
                )}
              >
                {l.label}
              </button>
            ))}
          </div>
        </Panel>

        <div className="space-y-3">
          <Panel>
            <PanelHeader title="State Accessibility" subtitle="Composite score /100" />
            <ul className="space-y-2.5 px-4 py-3">
              {STATE_SCORES.map((s) => (
                <li key={s.state}>
                  <div className="flex items-center justify-between text-xs">
                    <span>{s.state}</span>
                    <span className="text-muted-foreground">{s.score}/100</span>
                  </div>
                  <ScoreBar score={s.score} className="mt-1.5" />
                </li>
              ))}
            </ul>
          </Panel>

          <Panel>
            <PanelHeader title="Corridor Index" subtitle="Tap to inspect" />
            <ul className="max-h-72 divide-y divide-border/60 overflow-y-auto">
              {CORRIDORS.map((c) => {
                const score = corridorRisk(c);
                const level = riskLevelFromScore(score);
                return (
                  <li key={c.id}>
                    <button
                      onClick={() => setSelected(c)}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-left hover:bg-surface-2/50"
                    >
                      <span className="min-w-0 flex-1 truncate text-xs">{c.label}</span>
                      <span
                        className={cn(
                          "shrink-0 rounded-md border px-1.5 py-0.5 text-[10px] font-semibold",
                          riskBgClass(level),
                        )}
                      >
                        {score}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </Panel>
        </div>
      </div>

      {selected ? (
        <div className="sm:hidden">
          <CorridorDetailCard corridor={selected} />
        </div>
      ) : null}
    </div>
  );
}
