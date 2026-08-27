import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Construction,
  Waves,
  Mountain,
  Landmark,
  Car,
  CircleAlert,
  MapPin,
  Camera,
  Mic,
  WifiOff,
  Brain,
  Send,
} from "lucide-react";
import { PageHeader, Panel, PanelHeader, PrototypeNote, StatTile } from "@/components/kit";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/field-reports")({
  head: () => ({
    meta: [
      { title: "Field Reports — NER Smart Logistics" },
      {
        name: "description",
        content:
          "Offline-first field reporting for road blocks, floods, landslides, bridge damage and accidents with AI triage.",
      },
      { property: "og:title", content: "Field Reports — NER Smart Logistics" },
      { property: "og:description", content: "Field officer incident capture with AI classification and map update." },
    ],
  }),
  component: FieldReportsPage,
});

const TYPES = [
  { id: "blocked", label: "Road Blocked", icon: Construction },
  { id: "flood", label: "Flood", icon: Waves },
  { id: "landslide", label: "Landslide", icon: Mountain },
  { id: "bridge", label: "Bridge Damaged", icon: Landmark },
  { id: "accident", label: "Accident", icon: Car },
  { id: "other", label: "Other", icon: CircleAlert },
];

const RECENT = [
  { id: "FR-3391", type: "Landslide", location: "NH-13, Jowai", officer: "R. Lyngdoh", time: "10:20 AM", confidence: 87 },
  { id: "FR-3390", type: "Flood", location: "Dhemaji, Assam", officer: "P. Bora", time: "09:48 AM", confidence: 81 },
  { id: "FR-3388", type: "Road Blocked", location: "Ukhrul KM-24", officer: "L. Shimray", time: "08:05 AM", confidence: 74 },
  { id: "FR-3385", type: "Bridge Damaged", location: "Kopili Bridge", officer: "PWD Team 4", time: "07:30 AM", confidence: 92 },
];

function FieldReportsPage() {
  const [type, setType] = useState("landslide");
  const [desc, setDesc] = useState("");
  const [photo, setPhoto] = useState(false);
  const [recording, setRecording] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const selectedType = TYPES.find((t) => t.id === type)!;

  function submit() {
    setSubmitted(true);
    toast.success("Report queued & synced", {
      description: `${selectedType.label} at 25.45°N, 92.20°E — map updated`,
    });
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="Field Reports"
        subtitle="Officer & driver incident capture — queues locally when connectivity drops"
        right={
          <span className="flex items-center gap-1.5 rounded-lg border border-warn/30 bg-warn/10 px-3 py-2 text-[11px] text-warn">
            <WifiOff className="h-3.5 w-3.5" /> Offline queue: 2 pending
          </span>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Reports Today" value="7" tone="cyan" />
        <StatTile label="AI Verified" value="5" tone="ok" />
        <StatTile label="Pending Review" value="2" tone="warn" />
        <StatTile label="Avg Confidence" value="84%" tone="purple" />
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <Panel>
          <PanelHeader title="New Field Report" subtitle="Mobile-optimised capture form" />
          <div className="space-y-4 p-4">
            <div>
              <p className="label-xs">Incident Type</p>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {TYPES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setType(t.id)}
                    className={cn(
                      "flex items-center gap-2 rounded-lg border px-3 py-2.5 text-xs font-medium",
                      type === t.id
                        ? "border-cyan/45 bg-cyan/12 text-cyan"
                        : "border-border bg-background/40 text-muted-foreground",
                    )}
                  >
                    <t.icon className="h-4 w-4" />
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="flex items-center gap-2 rounded-lg border border-border bg-background/40 px-3 py-2.5 text-xs">
                <MapPin className="h-4 w-4 text-cyan" />
                <span>GPS locked · 25.4501°N, 92.2003°E (±6 m)</span>
              </div>
              <button
                onClick={() => setPhoto((p) => !p)}
                className={cn(
                  "flex items-center gap-2 rounded-lg border px-3 py-2.5 text-xs",
                  photo ? "border-ok/35 bg-ok/12 text-ok" : "border-border bg-background/40 text-muted-foreground",
                )}
              >
                <Camera className="h-4 w-4" />
                {photo ? "Photo attached (IMG_2043.jpg)" : "Attach photo evidence"}
              </button>
            </div>

            <label className="block">
              <span className="label-xs">Description</span>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                rows={4}
                placeholder="Slope failure blocking both lanes near KM-18, debris ~4 m wide, no injuries reported."
                className="mt-1 w-full rounded-lg border border-input bg-surface-2/60 px-3 py-2 text-sm outline-none focus:border-cyan/50"
              />
            </label>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setRecording((r) => !r)}
                className={cn(
                  "flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold",
                  recording
                    ? "border-danger/40 bg-danger/12 text-danger"
                    : "border-border bg-background/40 text-muted-foreground",
                )}
              >
                <Mic className="h-4 w-4" />
                {recording ? "Recording voice report… 0:12" : "Record voice report"}
              </button>
              <span className="text-[11px] text-muted-foreground">
                Timestamp: 18 May 2025, 10:20 AM IST
              </span>
              <button
                onClick={submit}
                className="ml-auto flex items-center gap-2 rounded-lg border border-cyan/45 bg-cyan/15 px-4 py-2 text-xs font-semibold text-cyan"
              >
                <Send className="h-3.5 w-3.5" /> Submit Report
              </button>
            </div>

            {submitted ? (
              <div className="space-y-3 rounded-xl border border-purple/30 bg-purple/8 p-4">
                <p className="flex items-center gap-2 text-sm font-semibold text-purple">
                  <Brain className="h-4 w-4" /> AI Analysis
                </p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <StatTile label="Detected" value="Landslide" tone="purple" />
                  <StatTile label="Confidence" value="87%" tone="cyan" />
                  <StatTile label="Risk" value="HIGH" tone="danger" />
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Photo texture and description match slope-failure patterns. NH-13 (Shillong – Jowai)
                  accessibility recalculated from 42 to 12/100 and the corridor is now rendered as
                  <span className="text-danger"> Blocked</span> on the map. 3 vehicles rerouted; Meghalaya state
                  score reduced by 4 points.
                </p>
                <PrototypeNote>
                  Prototype classification over synthetic inputs — not a production-validated AI model.
                </PrototypeNote>
              </div>
            ) : null}
          </div>
        </Panel>

        <Panel className="h-fit">
          <PanelHeader title="Recent Reports" subtitle="Last 24 hours" />
          <ul className="divide-y divide-border/60">
            {RECENT.map((r) => (
              <li key={r.id} className="px-4 py-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold">{r.type}</p>
                  <span className="rounded-md border border-purple/30 bg-purple/12 px-1.5 py-0.5 text-[10px] text-purple">
                    {r.confidence}%
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">{r.location}</p>
                <p className="text-[10px] text-muted-foreground/80">
                  {r.officer} · {r.time} · {r.id}
                </p>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
