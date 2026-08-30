import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, PanelHeader, PrototypeNote } from "@/components/kit";
import { Select } from "./route-intelligence";
import { Switch } from "@/components/ui/switch";
import { LANGUAGES, DATA_SOURCES } from "@/lib/ner-data";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — NER Smart Logistics" },
      {
        name: "description",
        content:
          "Configure language, alert thresholds, map layers, offline sync and notification preferences for the NER logistics command center.",
      },
      { property: "og:title", content: "Settings — NER Smart Logistics" },
      { property: "og:description", content: "Preferences for the NER Smart Logistics platform." },
    ],
  }),
  component: SettingsPage,
});

const TOGGLES = [
  { key: "alerts", label: "Critical corridor alerts", desc: "Push notification when a corridor turns red or blocked." },
  { key: "weather", label: "Weather overlay by default", desc: "Show rainfall clusters when the map loads." },
  { key: "offline", label: "Offline field sync", desc: "Queue field reports on low connectivity and sync later." },
  { key: "emergency", label: "Emergency cargo priority", desc: "Always weight reliability above distance for medical cargo." },
  { key: "digest", label: "Daily digest email", desc: "Morning summary of network accessibility and open incidents." },
];

function SettingsPage() {
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [threshold, setThreshold] = useState("65");
  const [on, setOn] = useState<Record<string, boolean>>({
    alerts: true,
    weather: true,
    offline: true,
    emergency: true,
    digest: false,
  });

  return (
    <div className="space-y-4">
      <PageHeader title="Settings" subtitle="Language, alerting and map preferences" />

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <Panel>
          <PanelHeader title="Regional & Alerting" />
          <div className="space-y-4 p-4">
            <Select label="Interface language" value={language} onChange={setLanguage} options={LANGUAGES} />
            <Select
              label="High-risk alert threshold (risk score)"
              value={threshold}
              onChange={setThreshold}
              options={["50", "55", "60", "65", "70", "75", "80"]}
            />
            <p className="text-xs text-muted-foreground">
              Corridors scoring at or above {threshold}/100 raise a critical alert and are excluded from
              recommended routes for emergency cargo.
            </p>
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="Notifications & Behaviour" />
          <ul className="divide-y divide-border/60">
            {TOGGLES.map((t) => (
              <li key={t.key} className="flex items-start justify-between gap-3 px-4 py-3">
                <div>
                  <p className="text-xs font-medium">{t.label}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{t.desc}</p>
                </div>
                <Switch
                  checked={on[t.key]}
                  onCheckedChange={(v) => setOn((prev) => ({ ...prev, [t.key]: v }))}
                />
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel>
        <PanelHeader title="Data Sources" subtitle="Simulated integrations" />
        <ul className="divide-y divide-border/60">
          {DATA_SOURCES.map((d) => (
            <li key={d.name} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-xs">
              <span className="font-medium">{d.name}</span>
              <span className="text-[11px] text-muted-foreground">{d.detail}</span>
              <span className="text-[11px] text-ok">{d.status}</span>
            </li>
          ))}
        </ul>
        <div className="p-4">
          <PrototypeNote>
            Settings are local to this prototype session and are not persisted to a backend.
          </PrototypeNote>
        </div>
      </Panel>
    </div>
  );
}
