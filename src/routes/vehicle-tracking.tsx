import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, PanelHeader, StatTile } from "@/components/kit";
import { NerMap } from "@/components/NerMap";
import { Field } from "@/components/dashboard";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FLEET_STATS, VEHICLES, riskBgClass, riskLevelFromScore, type Vehicle } from "@/lib/ner-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/vehicle-tracking")({
  head: () => ({
    meta: [
      { title: "Vehicle Tracking — NER Smart Logistics" },
      {
        name: "description",
        content:
          "Live NER fleet tracking with driver, cargo, destination, ETA, corridor risk and status for every vehicle.",
      },
      { property: "og:title", content: "Vehicle Tracking — NER Smart Logistics" },
      { property: "og:description", content: "Live fleet positions and risk exposure across North East India." },
    ],
  }),
  component: VehicleTrackingPage,
});

const STATUS_STYLES: Record<Vehicle["status"], string> = {
  Emergency: "bg-danger/15 text-danger border-danger/30",
  "In Transit": "bg-ok/15 text-ok border-ok/30",
  Delayed: "bg-warn/15 text-warn border-warn/30",
  Delivered: "bg-cyan/15 text-cyan border-cyan/30",
  Idle: "bg-muted text-muted-foreground border-border",
};

function VehicleTrackingPage() {
  const [selected, setSelected] = useState<Vehicle | null>(null);
  const [filter, setFilter] = useState<"All" | Vehicle["status"]>("All");
  const rows = VEHICLES.filter((v) => filter === "All" || v.status === filter);

  return (
    <div className="space-y-4">
      <PageHeader title="Vehicle Tracking" subtitle="Live fleet telemetry across the NER logistics network" />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <StatTile label="Total Fleet" value={String(FLEET_STATS.total)} tone="cyan" />
        <StatTile label="Moving" value={String(FLEET_STATS.moving)} tone="ok" />
        <StatTile label="Idle" value={String(FLEET_STATS.idle)} />
        <StatTile label="Delayed" value={String(FLEET_STATS.delayed)} tone="warn" />
        <StatTile label="Emergency" value={String(FLEET_STATS.emergency)} tone="danger" />
      </div>

      <Panel className="overflow-hidden">
        <PanelHeader title="Live Fleet Map" subtitle="Vehicle positions over risk-coded corridors" />
        <div className="h-[24rem] w-full">
          <NerMap layers={{ vehicles: true, warehouses: true, incidents: true }} />
        </div>
      </Panel>

      <Panel>
        <PanelHeader
          title="Fleet Register"
          right={
            <div className="flex flex-wrap gap-1.5">
              {(["All", "Emergency", "In Transit", "Delayed", "Delivered"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={cn(
                    "rounded-lg border px-2 py-1 text-[11px]",
                    filter === s
                      ? "border-cyan/40 bg-cyan/12 text-cyan"
                      : "border-border bg-background/40 text-muted-foreground",
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[52rem] text-sm">
            <thead>
              <tr className="border-b border-border/70 text-left">
                {["Vehicle", "Driver", "Cargo", "Route", "ETA", "Risk", "Status"].map((h) => (
                  <th key={h} className="label-xs px-4 py-2.5 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((v) => {
                const level = riskLevelFromScore(v.risk);
                return (
                  <tr
                    key={v.id}
                    onClick={() => setSelected(v)}
                    className="cursor-pointer border-b border-border/40 hover:bg-surface-2/50"
                  >
                    <td className="px-4 py-2.5 font-mono text-xs font-semibold text-cyan">{v.id}</td>
                    <td className="px-4 py-2.5 text-xs">{v.driver}</td>
                    <td className="px-4 py-2.5 text-xs">{v.cargo}</td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground">
                      {v.origin} → {v.destination}
                    </td>
                    <td className="px-4 py-2.5 text-xs">{v.eta}</td>
                    <td className="px-4 py-2.5">
                      <span
                        className={cn(
                          "rounded-md border px-1.5 py-0.5 text-[10px] font-semibold",
                          riskBgClass(level),
                        )}
                      >
                        {v.risk}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={cn(
                          "rounded-md border px-2 py-0.5 text-[10px] font-semibold",
                          STATUS_STYLES[v.status],
                        )}
                      >
                        {v.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base">
              Vehicle {selected?.id} · {selected?.cargo}
            </DialogTitle>
          </DialogHeader>
          {selected ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <Field label="Driver" value={selected.driver} />
                <Field label="Status" value={selected.status} />
                <Field label="Origin" value={selected.origin} />
                <Field label="Destination" value={selected.destination} />
                <Field label="ETA" value={selected.eta} />
                <Field label="Distance Left" value={`${selected.remainingKm} km`} />
                <Field label="Corridor Risk" value={`${selected.risk}/100`} />
                <Field label="Cargo Priority" value={`${selected.priority}/100`} />
              </div>
              <p className="rounded-lg border border-cyan/25 bg-cyan/8 p-3 text-xs leading-relaxed">
                {selected.risk >= 65
                  ? `Corridor risk is high. A safer alternative is available that reduces disruption probability by ${Math.round(selected.risk * 0.6)} points; recommended because cargo priority is ${selected.priority}/100.`
                  : "Corridor risk is within tolerance. Continue on the current route; monitoring rainfall and incident feeds every 5 minutes."}
              </p>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
