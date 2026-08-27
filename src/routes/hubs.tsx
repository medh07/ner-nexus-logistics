import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Warehouse, TriangleAlert, RotateCcw, Play } from "lucide-react";
import { PageHeader, Panel, PanelHeader, PrototypeNote, ScoreBar, StatTile } from "@/components/kit";
import { Select } from "./route-intelligence";
import { Button } from "@/components/ui/button";
import { CORRIDORS, HUBS, corridorRisk, simulateClosure, type SimulationResult } from "@/lib/ner-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/hubs")({
  head: () => ({
    meta: [
      { title: "Hubs & What-If Simulator — NER Smart Logistics" },
      {
        name: "description",
        content:
          "Warehouse and hub capacity across North East India plus a what-if simulator that models the network impact of closing any corridor.",
      },
      { property: "og:title", content: "Hubs & What-If Simulator — NER Smart Logistics" },
      { property: "og:description", content: "Model road closures and hub capacity across the NER network." },
    ],
  }),
  component: HubsPage,
});

function HubsPage() {
  const [corridorId, setCorridorId] = useState("NH-37");
  const [result, setResult] = useState<SimulationResult | null>(null);

  const corridor = CORRIDORS.find((c) => c.id === corridorId)!;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Hubs & Infrastructure"
        subtitle="Hub capacity, cold-chain readiness and corridor closure simulation"
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Active Hubs" value={String(HUBS.length)} tone="cyan" />
        <StatTile
          label="Total Capacity"
          value={`${HUBS.reduce((a, h) => a + h.capacityTons, 0).toLocaleString()} T`}
          tone="purple"
        />
        <StatTile
          label="Avg Utilization"
          value={`${Math.round(HUBS.reduce((a, h) => a + h.utilization, 0) / HUBS.length)}%`}
          tone="warn"
        />
        <StatTile label="Cold-Chain Hubs" value={String(HUBS.filter((h) => h.coldChain).length)} tone="ok" />
      </div>

      {/* What-if simulator */}
      <Panel className="border-purple/25">
        <PanelHeader
          title="What-If Simulator"
          subtitle="Model the network impact of closing a corridor"
          right={
            <span className="rounded-md border border-purple/30 bg-purple/12 px-2 py-0.5 text-[10px] font-semibold text-purple">
              SCENARIO ENGINE
            </span>
          }
        />
        <div className="space-y-4 p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_auto_auto] md:items-end">
            <Select
              label="Corridor to close"
              value={corridorId}
              onChange={(v) => {
                setCorridorId(v);
                setResult(null);
              }}
              options={CORRIDORS.map((c) => c.id)}
              render={(id) => CORRIDORS.find((c) => c.id === id)?.label ?? id}
            />
            <Button onClick={() => setResult(simulateClosure(corridorId))} className="gap-2">
              <Play className="h-4 w-4" /> Run simulation
            </Button>
            <Button variant="outline" onClick={() => setResult(null)} className="gap-2">
              <RotateCcw className="h-4 w-4" /> Reset
            </Button>
          </div>

          <div className="rounded-xl border border-border/70 bg-surface-2/50 p-3 text-xs text-muted-foreground">
            Selected: <span className="text-foreground">{corridor.label}</span> · {corridor.distanceKm} km · current
            risk score {corridorRisk(corridor)}/100
          </div>

          {result ? (
            <div className="space-y-4">
              <div className="flex items-start gap-2 rounded-xl border border-danger/30 bg-danger/10 p-3">
                <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
                <p className="text-xs text-foreground">
                  Closing <span className="font-semibold">{result.corridor}</span> drops network accessibility by{" "}
                  <span className="font-semibold text-danger">{result.accessibilityDrop} points</span> and forces{" "}
                  {result.affectedVehicles} vehicles onto longer detours.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
                <StatTile label="Vehicles Affected" value={String(result.affectedVehicles)} tone="danger" />
                <StatTile label="Districts Impacted" value={String(result.affectedDistricts)} tone="warn" />
                <StatTile label="Emergency Deliveries" value={String(result.emergencyDeliveries)} tone="danger" />
                <StatTile label="Extra Distance" value={`${result.additionalDistanceKm.toLocaleString()} km`} />
                <StatTile label="Expected Delay" value={`${result.expectedDelayHours} hrs`} tone="warn" />
                <StatTile label="Accessibility Drop" value={`-${result.accessibilityDrop}`} tone="danger" />
              </div>

              <div className="rounded-xl border border-cyan/25 bg-cyan/8 p-3">
                <p className="label-xs mb-1 text-cyan">Recommended Fallback Corridor</p>
                <p className="text-sm font-medium">{result.recommendedCorridor}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Reroute emergency and medical cargo first; defer low-priority bulk freight until the corridor
                  reopens.
                </p>
              </div>

              <PrototypeNote>
                Simulation outputs are illustrative, generated from the synthetic prototype dataset.
              </PrototypeNote>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              Choose a corridor and run the simulation to see affected vehicles, districts, detour distance and the
              recommended fallback route.
            </p>
          )}
        </div>
      </Panel>

      <Panel>
        <PanelHeader title="Hub Register" subtitle={`${HUBS.length} logistics hubs and warehouses`} />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[46rem] text-sm">
            <thead>
              <tr className="border-b border-border/70 text-left">
                {["Hub", "State", "Type", "Capacity", "Utilization", "Cold Chain"].map((h) => (
                  <th key={h} className="label-xs px-4 py-2.5">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {HUBS.map((h) => (
                <tr key={h.id} className="border-b border-border/40 hover:bg-surface-2/50">
                  <td className="px-4 py-2.5">
                    <span className="flex items-center gap-2 text-xs font-medium">
                      <Warehouse className="h-3.5 w-3.5 text-cyan" />
                      {h.name}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-xs text-muted-foreground">{h.state}</td>
                  <td className="px-4 py-2.5 text-xs">{h.type}</td>
                  <td className="px-4 py-2.5 text-xs">{h.capacityTons.toLocaleString()} T</td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <ScoreBar score={h.utilization} className="w-28" />
                      <span className="text-[11px] text-muted-foreground">{h.utilization}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <span
                      className={cn(
                        "rounded-md border px-1.5 py-0.5 text-[10px] font-semibold",
                        h.coldChain ? "border-ok/30 bg-ok/12 text-ok" : "border-border text-muted-foreground",
                      )}
                    >
                      {h.coldChain ? "Available" : "None"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
