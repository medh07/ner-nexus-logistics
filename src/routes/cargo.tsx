import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, PanelHeader, StatTile } from "@/components/kit";
import { SHIPMENTS, type Shipment } from "@/lib/ner-data";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field } from "@/components/dashboard";

export const Route = createFileRoute("/cargo")({
  head: () => ({
    meta: [
      { title: "Cargo & Shipments — NER Smart Logistics" },
      {
        name: "description",
        content:
          "Track emergency, in-transit, delayed and delivered shipments across the North East India logistics network.",
      },
      { property: "og:title", content: "Cargo & Shipments — NER Smart Logistics" },
      { property: "og:description", content: "Shipment register with priority, ETA and status for NER cargo." },
    ],
  }),
  component: CargoPage,
});

const STATUS_STYLES: Record<Shipment["status"], string> = {
  Emergency: "bg-danger/15 text-danger border-danger/30",
  "In Transit": "bg-ok/15 text-ok border-ok/30",
  Delayed: "bg-warn/15 text-warn border-warn/30",
  Delivered: "bg-cyan/15 text-cyan border-cyan/30",
};

function CargoPage() {
  const [filter, setFilter] = useState<"All" | Shipment["status"]>("All");
  const [selected, setSelected] = useState<Shipment | null>(null);
  const rows = SHIPMENTS.filter((s) => filter === "All" || s.status === filter);
  const count = (s: Shipment["status"]) => SHIPMENTS.filter((x) => x.status === s).length;

  return (
    <div className="space-y-4">
      <PageHeader title="Cargo & Shipments" subtitle="Consignment-level visibility with priority-aware handling" />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Emergency" value={String(count("Emergency"))} tone="danger" hint="Life-critical cargo" />
        <StatTile label="In Transit" value={String(count("In Transit"))} tone="ok" />
        <StatTile label="Delayed" value={String(count("Delayed"))} tone="warn" />
        <StatTile label="Delivered" value={String(count("Delivered"))} tone="cyan" />
      </div>

      <Panel>
        <PanelHeader
          title="Shipment Register"
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
          <table className="w-full min-w-[56rem] text-sm">
            <thead>
              <tr className="border-b border-border/70 text-left">
                {["Shipment", "Cargo", "Origin", "Destination", "Vehicle", "Priority", "ETA", "Status"].map((h) => (
                  <th key={h} className="label-xs px-4 py-2.5">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((s) => (
                <tr
                  key={s.id}
                  onClick={() => setSelected(s)}
                  className="cursor-pointer border-b border-border/40 hover:bg-surface-2/50"
                >
                  <td className="px-4 py-2.5 font-mono text-xs text-cyan">{s.id}</td>
                  <td className="px-4 py-2.5 text-xs">{s.cargo}</td>
                  <td className="px-4 py-2.5 text-xs text-muted-foreground">{s.origin}</td>
                  <td className="px-4 py-2.5 text-xs text-muted-foreground">{s.destination}</td>
                  <td className="px-4 py-2.5 font-mono text-xs">{s.vehicle}</td>
                  <td className="px-4 py-2.5 text-xs">{s.priority}</td>
                  <td className="px-4 py-2.5 text-xs">{s.eta}</td>
                  <td className="px-4 py-2.5">
                    <span
                      className={cn(
                        "rounded-md border px-2 py-0.5 text-[10px] font-semibold",
                        STATUS_STYLES[s.status],
                      )}
                    >
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base">
              {selected?.id} · {selected?.cargo}
            </DialogTitle>
          </DialogHeader>
          {selected ? (
            <div className="grid grid-cols-2 gap-2">
              <Field label="Origin" value={selected.origin} />
              <Field label="Destination" value={selected.destination} />
              <Field label="Vehicle" value={selected.vehicle} />
              <Field label="Priority" value={selected.priority} />
              <Field label="Weight" value={`${selected.weightTons} T`} />
              <Field label="ETA" value={selected.eta} />
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
