import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, User } from "lucide-react";
import { PageHeader, Panel, PanelHeader, StatTile } from "@/components/kit";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/users")({
  head: () => ({
    meta: [
      { title: "Users & Roles — NER Smart Logistics" },
      {
        name: "description",
        content:
          "Role-based access overview for control room operators, fleet managers, district officers and field reporters.",
      },
      { property: "og:title", content: "Users & Roles — NER Smart Logistics" },
      { property: "og:description", content: "Access control overview for the NER logistics platform." },
    ],
  }),
  component: UsersPage,
});

const ROLES = [
  {
    role: "Control Room Operator",
    scope: "Full network visibility, alert triage, corridor closure simulation",
    members: 6,
  },
  { role: "Fleet Manager", scope: "Vehicle tracking, shipment assignment, route approval", members: 11 },
  { role: "District Officer", scope: "District accessibility, incident verification, relief coordination", members: 18 },
  { role: "Field Reporter", scope: "Mobile field reports, photo upload, offline sync", members: 142 },
  { role: "Analyst (Read-only)", scope: "Dashboards, forecasts and report exports", members: 9 },
];

const USERS = [
  { name: "R. Baruah", role: "Control Room Operator", state: "Assam", hub: "Guwahati", status: "Online" },
  { name: "L. Sangma", role: "District Officer", state: "Meghalaya", hub: "Shillong", status: "Online" },
  { name: "T. Konyak", role: "Fleet Manager", state: "Nagaland", hub: "Dimapur", status: "Offline" },
  { name: "S. Devi", role: "Control Room Operator", state: "Manipur", hub: "Imphal", status: "Online" },
  { name: "H. Lalrinawma", role: "Field Reporter", state: "Mizoram", hub: "Aizawl", status: "Online" },
  { name: "P. Debbarma", role: "Analyst (Read-only)", state: "Tripura", hub: "Agartala", status: "Offline" },
  { name: "K. Bhutia", role: "District Officer", state: "Sikkim", hub: "Gangtok", status: "Online" },
  { name: "A. Khimun", role: "Fleet Manager", state: "Arunachal Pradesh", hub: "Itanagar", status: "Online" },
];

function UsersPage() {
  return (
    <div className="space-y-4">
      <PageHeader title="Users & Roles" subtitle="Role-based access across states, hubs and field teams" />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Total Users" value={String(ROLES.reduce((a, r) => a + r.members, 0))} tone="cyan" />
        <StatTile label="Roles Defined" value={String(ROLES.length)} tone="purple" />
        <StatTile label="Online Now" value={String(USERS.filter((u) => u.status === "Online").length)} tone="ok" />
        <StatTile label="States Covered" value="8" />
      </div>

      <Panel>
        <PanelHeader title="Role Permissions" subtitle="Least-privilege scopes" />
        <ul className="divide-y divide-border/60">
          {ROLES.map((r) => (
            <li key={r.role} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
              <span className="flex items-center gap-2 text-xs font-semibold">
                <ShieldCheck className="h-3.5 w-3.5 text-cyan" />
                {r.role}
              </span>
              <span className="min-w-0 flex-1 text-[11px] text-muted-foreground">{r.scope}</span>
              <span className="text-[11px] text-muted-foreground">{r.members} members</span>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel>
        <PanelHeader title="Directory" subtitle="Sample of active accounts" />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[40rem] text-sm">
            <thead>
              <tr className="border-b border-border/70 text-left">
                {["User", "Role", "State", "Hub", "Status"].map((h) => (
                  <th key={h} className="label-xs px-4 py-2.5">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {USERS.map((u) => (
                <tr key={u.name} className="border-b border-border/40 hover:bg-surface-2/50">
                  <td className="px-4 py-2.5">
                    <span className="flex items-center gap-2 text-xs font-medium">
                      <User className="h-3.5 w-3.5 text-purple" />
                      {u.name}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-xs text-muted-foreground">{u.role}</td>
                  <td className="px-4 py-2.5 text-xs text-muted-foreground">{u.state}</td>
                  <td className="px-4 py-2.5 text-xs text-muted-foreground">{u.hub}</td>
                  <td className="px-4 py-2.5">
                    <span
                      className={cn(
                        "rounded-md border px-1.5 py-0.5 text-[10px] font-semibold",
                        u.status === "Online"
                          ? "border-ok/30 bg-ok/12 text-ok"
                          : "border-border text-muted-foreground",
                      )}
                    >
                      {u.status}
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
