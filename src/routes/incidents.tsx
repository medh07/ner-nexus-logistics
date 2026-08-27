import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, PanelHeader, StatTile } from "@/components/kit";
import { AlertsPanel, Field } from "@/components/dashboard";
import { INCIDENTS, type Incident } from "@/lib/ner-data";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/incidents")({
  head: () => ({
    meta: [
      { title: "Incidents & Alerts — NER Smart Logistics" },
      {
        name: "description",
        content:
          "Active and resolved incidents across NER corridors with severity, affected routes, estimated impact and reporter details.",
      },
      { property: "og:title", content: "Incidents & Alerts — NER Smart Logistics" },
      { property: "og:description", content: "Incident workspace for North East India logistics disruptions." },
    ],
  }),
  component: IncidentsPage,
});

const SEV: Record<string, string> = {
  High: "bg-danger/15 text-danger border-danger/30",
  Moderate: "bg-warn/15 text-warn border-warn/30",
  Low: "bg-ok/15 text-ok border-ok/30",
};

function IncidentsPage() {
  const [status, setStatus] = useState<"All" | "Active" | "Resolved">("Active");
  const [severity, setSeverity] = useState<"All" | "High" | "Moderate" | "Low">("All");
  const [selected, setSelected] = useState<Incident | null>(null);

  const rows = INCIDENTS.filter(
    (i) => (status === "All" || i.status === status) && (severity === "All" || i.severity === severity),
  );

  return (
    <div className="space-y-4">
      <PageHeader title="Incident & Alerts" subtitle="Disruption intake, triage and resolution tracking" />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Active" value={String(INCIDENTS.filter((i) => i.status === "Active").length)} tone="danger" />
        <StatTile label="High Severity" value={String(INCIDENTS.filter((i) => i.severity === "High").length)} tone="warn" />
        <StatTile label="Resolved (48h)" value={String(INCIDENTS.filter((i) => i.status === "Resolved").length)} tone="ok" />
        <StatTile label="Avg Resolution" value="6.4 hrs" tone="cyan" />
      </div>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <Panel>
          <PanelHeader
            title="Incident Register"
            right={
              <div className="flex flex-wrap gap-1.5">
                {(["All", "Active", "Resolved"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    className={cn(
                      "rounded-lg border px-2 py-1 text-[11px]",
                      status === s ? "border-cyan/40 bg-cyan/12 text-cyan" : "border-border text-muted-foreground",
                    )}
                  >
                    {s}
                  </button>
                ))}
                {(["All", "High", "Moderate", "Low"] as const).map((s) => (
                  <button
                    key={`sev-${s}`}
                    onClick={() => setSeverity(s)}
                    className={cn(
                      "rounded-lg border px-2 py-1 text-[11px]",
                      severity === s ? "border-purple/40 bg-purple/12 text-purple" : "border-border text-muted-foreground",
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
                  {["ID", "Type", "Severity", "Location", "Route", "Impact", "Reporter", "Status"].map((h) => (
                    <th key={h} className="label-xs px-4 py-2.5">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((i) => (
                  <tr
                    key={i.id}
                    onClick={() => setSelected(i)}
                    className="cursor-pointer border-b border-border/40 hover:bg-surface-2/50"
                  >
                    <td className="px-4 py-2.5 font-mono text-xs text-cyan">{i.id}</td>
                    <td className="px-4 py-2.5 text-xs">{i.type}</td>
                    <td className="px-4 py-2.5">
                      <span className={cn("rounded-md border px-1.5 py-0.5 text-[10px] font-semibold", SEV[i.severity])}>
                        {i.severity}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground">{i.location}</td>
                    <td className="px-4 py-2.5 text-xs">{i.route}</td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground">{i.impact}</td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground">{i.reporter}</td>
                    <td className="px-4 py-2.5 text-xs">
                      <span className={i.status === "Active" ? "text-danger" : "text-ok"}>{i.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <AlertsPanel />
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base">
              {selected?.id} · {selected?.type}
            </DialogTitle>
          </DialogHeader>
          {selected ? (
            <div className="grid grid-cols-2 gap-2">
              <Field label="Severity" value={selected.severity} />
              <Field label="Status" value={selected.status} />
              <Field label="Location" value={selected.location} />
              <Field label="Route Affected" value={selected.route} />
              <Field label="Estimated Impact" value={selected.impact} />
              <Field label="Reported By" value={selected.reporter} />
              <Field label="Timestamp" value={selected.time} />
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
