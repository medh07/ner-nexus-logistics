import { createFileRoute } from "@tanstack/react-router";
import { Download, FileText, FileSpreadsheet, Database } from "lucide-react";
import { PageHeader, Panel, PanelHeader, PrototypeNote, StatTile } from "@/components/kit";
import { Button } from "@/components/ui/button";
import { DATA_SOURCES, NETWORK_PERFORMANCE } from "@/lib/ner-data";
import { toast } from "sonner";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports & Analytics — NER Smart Logistics" },
      {
        name: "description",
        content:
          "Downloadable operational reports, corridor risk summaries, emergency response logs and connected data source status.",
      },
      { property: "og:title", content: "Reports & Analytics — NER Smart Logistics" },
      { property: "og:description", content: "Export and review NER logistics analytics reports." },
    ],
  }),
  component: ReportsPage,
});

const REPORTS = [
  {
    name: "Weekly Corridor Risk Summary",
    desc: "Risk scores, closures and reliability across all monitored corridors.",
    period: "Last 7 days",
    format: "PDF",
    icon: FileText,
  },
  {
    name: "Fleet Utilization Report",
    desc: "Vehicle-level distance, idle time, delay minutes and cargo mix.",
    period: "Last 30 days",
    format: "XLSX",
    icon: FileSpreadsheet,
  },
  {
    name: "Emergency Response Log",
    desc: "Medical and relief shipments, protection rate and response times.",
    period: "Quarter to date",
    format: "PDF",
    icon: FileText,
  },
  {
    name: "Field Report Digest",
    desc: "Citizen and driver reports with AI severity classification.",
    period: "Last 14 days",
    format: "CSV",
    icon: FileSpreadsheet,
  },
  {
    name: "Demand Forecast Export",
    desc: "State and commodity level demand projections with capacity headroom.",
    period: "Next 30 days",
    format: "XLSX",
    icon: FileSpreadsheet,
  },
  {
    name: "Incident Master Register",
    desc: "All incidents with severity, impact and resolution timelines.",
    period: "Year to date",
    format: "CSV",
    icon: FileSpreadsheet,
  },
];

function ReportsPage() {
  return (
    <div className="space-y-4">
      <PageHeader title="Reports & Analytics" subtitle="Scheduled exports and data source health" />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Report Templates" value={String(REPORTS.length)} tone="cyan" />
        <StatTile label="Data Sources" value={String(DATA_SOURCES.length)} tone="purple" />
        <StatTile label="Network Accessibility" value={`${NETWORK_PERFORMANCE.accessibility}%`} tone="ok" />
        <StatTile label="Emergency Protected" value={`${NETWORK_PERFORMANCE.emergencyProtected}%`} tone="ok" />
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-3">
        {REPORTS.map((r) => (
          <Panel key={r.name} className="flex flex-col">
            <div className="flex-1 p-4">
              <div className="flex items-start gap-3">
                <span className="rounded-lg border border-cyan/25 bg-cyan/10 p-2">
                  <r.icon className="h-4 w-4 text-cyan" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold">{r.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{r.desc}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-border/60 px-4 py-2.5">
              <span className="text-[11px] text-muted-foreground">
                {r.period} · {r.format}
              </span>
              <Button
                size="sm"
                variant="outline"
                className="h-7 gap-1.5 text-[11px]"
                onClick={() => toast.info("Prototype export", { description: `${r.name} is not generated in this demo.` })}
              >
                <Download className="h-3.5 w-3.5" /> Export
              </Button>
            </div>
          </Panel>
        ))}
      </div>

      <Panel>
        <PanelHeader title="Connected Data Sources" subtitle="Simulated ingestion status" />
        <ul className="divide-y divide-border/60">
          {DATA_SOURCES.map((d) => (
            <li key={d.name} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
              <span className="flex items-center gap-2 text-xs font-medium">
                <Database className="h-3.5 w-3.5 text-purple" />
                {d.name}
              </span>
              <span className="text-[11px] text-muted-foreground">{d.scope}</span>
              <span className="text-[11px] text-ok">{d.status}</span>
            </li>
          ))}
        </ul>
        <div className="p-4">
          <PrototypeNote>
            Data sources are simulated for this prototype; no live government or weather feed is connected.
          </PrototypeNote>
        </div>
      </Panel>
    </div>
  );
}
