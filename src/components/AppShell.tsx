import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Route as RouteIcon,
  Map,
  Truck,
  Package,
  ClipboardList,
  TriangleAlert,
  LineChart,
  Brain,
  Activity,
  FileBarChart,
  Users,
  Warehouse,
  Settings,
  Search,
  Bell,
  Globe,
  CircleCheck,
  RefreshCw,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LANGUAGES } from "@/lib/ner-data";
import { AiAssistant } from "./AiAssistant";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NAV = [
  { section: null, items: [{ to: "/", label: "Dashboard", icon: LayoutDashboard }] },
  {
    section: "Operations",
    items: [
      { to: "/route-intelligence", label: "Route Intelligence", icon: RouteIcon },
      { to: "/accessibility-map", label: "Accessibility Map", icon: Map },
      { to: "/vehicle-tracking", label: "Vehicle Tracking", icon: Truck },
      { to: "/cargo", label: "Cargo & Shipments", icon: Package },
      { to: "/field-reports", label: "Field Reports", icon: ClipboardList, badge: 7 },
      { to: "/incidents", label: "Incident & Alerts", icon: TriangleAlert },
    ],
  },
  {
    section: "Analytics",
    items: [
      { to: "/demand-forecasting", label: "Demand Forecasting", icon: LineChart },
      { to: "/risk-prediction", label: "Risk & Prediction", icon: Brain },
      { to: "/network-performance", label: "Network Performance", icon: Activity },
      { to: "/reports", label: "Reports & Analytics", icon: FileBarChart },
    ],
  },
  {
    section: "Admin",
    items: [
      { to: "/users", label: "Users & Roles", icon: Users },
      { to: "/hubs", label: "Hubs & Infrastructure", icon: Warehouse },
      { to: "/settings", label: "Settings", icon: Settings },
    ],
  },
] as const;

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-sidebar-border px-4 py-4">
        <div className="grid h-10 w-10 place-items-center rounded-xl border border-cyan/40 bg-cyan/10">
          <ShieldCheck className="h-5 w-5 text-cyan" />
        </div>
        <div className="min-w-0">
          <p className="truncate font-display text-sm font-bold tracking-wide">NER Smart Logistics</p>
          <p className="truncate text-[10px] text-muted-foreground">
            AI-Powered Accessibility Intelligence
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-4 overflow-y-auto px-3 py-4">
        {NAV.map((group, gi) => (
          <div key={gi}>
            {group.section ? <p className="label-xs px-2 pb-2">{group.section}</p> : null}
            <ul className="space-y-1">
              {group.items.map((item) => {
                const active = pathname === item.to;
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      onClick={onNavigate}
                      className={cn(
                        "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors",
                        active
                          ? "border border-cyan/35 bg-cyan/12 font-semibold text-cyan"
                          : "text-sidebar-foreground/85 hover:bg-sidebar-accent",
                      )}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                      {"badge" in item && item.badge ? (
                        <span className="ml-auto grid h-5 min-w-5 place-items-center rounded-full bg-danger/20 px-1 text-[10px] font-bold text-danger">
                          {item.badge}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="space-y-3 border-t border-sidebar-border p-3">
        <div className="flex items-center gap-2 rounded-lg border border-ok/25 bg-ok/10 px-3 py-2.5">
          <CircleCheck className="h-4 w-4 text-ok" />
          <div>
            <p className="text-xs font-semibold text-ok">All Systems Operational</p>
            <p className="text-[10px] text-muted-foreground">System Status</p>
          </div>
        </div>
        <div className="flex items-center justify-between rounded-lg border border-border bg-background/40 px-3 py-2">
          <div>
            <p className="label-xs">Last Updated</p>
            <p className="text-[11px] text-muted-foreground">18 May 2025, 10:24 AM</p>
          </div>
          <RefreshCw className="h-4 w-4 text-cyan" />
        </div>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lang, setLang] = useState(LANGUAGES[0]);

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-sidebar-border bg-sidebar lg:block">
        <SidebarContent />
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-72 border-r border-sidebar-border bg-sidebar">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-3 rounded-md p-1 text-muted-foreground hover:text-foreground"
              aria-label="Close navigation"
            >
              <X className="h-4 w-4" />
            </button>
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      ) : null}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
          <div className="flex items-center gap-3 px-3 py-2.5 sm:px-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-md border border-border p-2 text-muted-foreground lg:hidden"
              aria-label="Open navigation"
            >
              <Menu className="h-4 w-4" />
            </button>

            <div className="hidden min-w-0 md:block">
              <p className="font-display text-sm font-bold tracking-wide">NER Smart Logistics</p>
              <p className="text-[10px] text-muted-foreground">AI-Powered Accessibility Intelligence</p>
            </div>

            <div className="relative mx-auto w-full max-w-md">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search routes, places, vehicles, hubs..."
                className="w-full rounded-lg border border-input bg-surface-2/60 py-2 pr-3 pl-9 text-sm outline-none placeholder:text-muted-foreground focus:border-cyan/50"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger className="hidden items-center gap-2 rounded-lg border border-border bg-surface-2/60 px-3 py-2 text-xs sm:flex">
                <Globe className="h-4 w-4 text-cyan" />
                {lang}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {LANGUAGES.map((l) => (
                  <DropdownMenuItem key={l} onClick={() => setLang(l)}>
                    {l}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger
                className="relative rounded-lg border border-border bg-surface-2/60 p-2"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1.5 -right-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-danger px-1 text-[10px] font-bold text-background">
                  12
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72">
                <DropdownMenuItem className="flex-col items-start">
                  <span className="text-xs font-semibold text-danger">Landslide reported · NH-13</span>
                  <span className="text-[11px] text-muted-foreground">10:20 AM · Near Jowai</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex-col items-start">
                  <span className="text-xs font-semibold text-warn">Heavy rainfall · Dhemaji</span>
                  <span className="text-[11px] text-muted-foreground">09:50 AM · IMD nowcast</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex-col items-start">
                  <span className="text-xs font-semibold text-cyan">Reroute suggested · NE-027</span>
                  <span className="text-[11px] text-muted-foreground">09:32 AM · Medical supplies</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex items-center gap-2 rounded-lg border border-border bg-surface-2/60 px-2 py-1.5">
              <div className="grid h-7 w-7 place-items-center rounded-full bg-cyan/15 text-xs font-bold text-cyan">
                AU
              </div>
              <div className="hidden leading-tight sm:block">
                <p className="text-xs font-semibold">Admin User</p>
                <p className="text-[10px] text-muted-foreground">MDoNER</p>
              </div>
            </div>
          </div>
        </header>

        <main className="px-3 py-4 pb-24 sm:px-4 lg:px-5">{children}</main>

        <footer className="border-t border-border px-4 py-4 text-[11px] text-muted-foreground">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span>
              Ministry of Development of North Eastern Region · Government of India (prototype)
            </span>
            <span className="flex flex-wrap items-center gap-3">
              <span>Data Sources: IMD · Bhuvan (ISRO) · MoRTH · State Transport Depts · Field Reports</span>
              <span className="rounded-md border border-ok/25 bg-ok/10 px-2 py-0.5 text-ok">
                Secure &amp; Encrypted
              </span>
            </span>
          </div>
        </footer>
      </div>

      <AiAssistant />
    </div>
  );
}
