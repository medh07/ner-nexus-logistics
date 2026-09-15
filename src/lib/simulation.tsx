import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { ALERTS, ROUTE_OPTIONS, type Alert, type RouteOption } from "@/lib/ner-data";

/* ------------------------------------------------------------------ */
/* Global environmental simulation layer (front-end only)              */
/* Nothing in ner-data.ts is ever mutated — every consumer receives    */
/* temporary derived copies while a simulation is active.              */
/* ------------------------------------------------------------------ */

export type SimEvent = "off" | "rain" | "landslide";

export type SimConfig = {
  label: string;
  /** Corridor ids whose displayed risk is temporarily elevated. */
  corridorIds: string[];
  /** Risk multiplier applied to affected corridors. */
  corridorMultiplier: number;
  /** Per route-option id multipliers. */
  routeImpact: Record<string, number>;
  /** Extra map circles (rainfall clusters / slide zones). */
  zones: { id: string; lat: number; lng: number; radius: number; color: string; label: string }[];
  /** Simulated alerts injected into alert lists. */
  alerts: Alert[];
};

export const SIM_CONFIG: Record<Exclude<SimEvent, "off">, SimConfig> = {
  rain: {
    label: "Heavy Rainfall",
    corridorIds: ["NH-37", "NH-27", "GHY-SHL"],
    corridorMultiplier: 1.3,
    routeImpact: { A: 1.3, C: 1.2 },
    zones: [
      { id: "sim-r1", lat: 25.9, lng: 92.9, radius: 40, color: "#38bdf8", label: "Simulated rainfall cluster · 96mm/6h" },
      { id: "sim-r2", lat: 27.3, lng: 94.4, radius: 30, color: "#38bdf8", label: "Simulated rainfall cluster · 71mm/6h" },
    ],
    alerts: [
      {
        id: "SIM-R1",
        title: "Simulated: Extreme Rainfall on NH-37",
        location: "NH-37, Nagaon – Dimapur stretch",
        severity: "High",
        time: "Simulation · live",
        type: "Weather",
        detail:
          "Simulated 96mm/6h rainfall band over the Nagaon – Dimapur stretch. Displayed corridor risk and disruption probability are temporarily elevated by 30%. Reset the simulation to restore live values.",
        corridorId: "NH-37",
        lat: 25.9,
        lng: 92.9,
      },
      {
        id: "SIM-R2",
        title: "Simulated: Waterlogging Risk on NH-27",
        location: "NH-27, Dhemaji – Silapathar, Assam",
        severity: "Moderate",
        time: "Simulation · live",
        type: "Flood",
        detail:
          "Simulated flood nowcast for low-lying NH-27 stretches. Cargo on this corridor is flagged for rerouting while the simulation is active.",
        corridorId: "NH-27",
        lat: 27.48,
        lng: 94.58,
      },
    ],
  },
  landslide: {
    label: "Landslide Incident",
    corridorIds: ["NH-37", "NH-13"],
    corridorMultiplier: 1.4,
    routeImpact: { A: 1.4 },
    zones: [
      { id: "sim-l1", lat: 25.6, lng: 93.2, radius: 18, color: "#f43f5e", label: "Simulated slope failure zone" },
      { id: "sim-l2", lat: 25.45, lng: 92.2, radius: 14, color: "#f43f5e", label: "Simulated slope instability" },
    ],
    alerts: [
      {
        id: "SIM-L1",
        title: "Simulated: Landslide Blocking NH-37",
        location: "NH-37, Maibang hill section",
        severity: "High",
        time: "Simulation · live",
        type: "Landslide",
        detail:
          "Simulated slope failure blocking both lanes on the Maibang hill section. Displayed corridor risk is temporarily elevated by 40% and affected cargo is rerouted in the AI recommendation.",
        corridorId: "NH-37",
        lat: 25.6,
        lng: 93.2,
      },
      {
        id: "SIM-L2",
        title: "Simulated: Slope Instability on NH-13",
        location: "NH-13, Near Jowai, Meghalaya",
        severity: "Moderate",
        time: "Simulation · live",
        type: "Landslide",
        detail:
          "Simulated secondary debris risk on NH-13 following the primary slide. Convoys are advised to hold at Jowai checkpoint while the simulation is active.",
        corridorId: "NH-13",
        lat: 25.45,
        lng: 92.2,
      },
    ],
  },
};

type SimulationValue = {
  event: SimEvent;
  active: boolean;
  analyzing: boolean;
  config: SimConfig | null;
  label: string | null;
  setEvent: (e: SimEvent) => void;
  toggle: (e: Exclude<SimEvent, "off">) => void;
  reset: () => void;
  /** Corridor ids affected by the active simulation. */
  affectedCorridorIds: Set<string>;
  /** Displayed risk for a corridor score (temporary). */
  adjustCorridorScore: (corridorId: string, score: number) => number;
  /** Simulated alerts merged ahead of the real ones. */
  alerts: Alert[];
  simAlertIds: Set<string>;
  /** Route options with temporary simulated values. */
  routes: RouteOption[];
  affectedRouteIds: Set<string>;
};

const SimulationContext = createContext<SimulationValue | null>(null);

export function SimulationProvider({ children }: { children: ReactNode }) {
  const [event, setEvent] = useState<SimEvent>("off");
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    if (event === "off") {
      setAnalyzing(false);
      return;
    }
    setAnalyzing(true);
    const t = setTimeout(() => setAnalyzing(false), 900);
    return () => clearTimeout(t);
  }, [event]);

  const value = useMemo<SimulationValue>(() => {
    const config = event === "off" ? null : SIM_CONFIG[event];
    const affectedCorridorIds = new Set(config?.corridorIds ?? []);
    const affectedRouteIds = new Set(Object.keys(config?.routeImpact ?? {}));

    return {
      event,
      active: event !== "off",
      analyzing,
      config,
      label: config?.label ?? null,
      setEvent,
      toggle: (e) => setEvent((cur) => (cur === e ? "off" : e)),
      reset: () => setEvent("off"),
      affectedCorridorIds,
      adjustCorridorScore: (corridorId, score) =>
        config && affectedCorridorIds.has(corridorId)
          ? Math.min(100, Math.round(score * config.corridorMultiplier))
          : score,
      alerts: config ? [...config.alerts, ...ALERTS] : ALERTS,
      simAlertIds: new Set((config?.alerts ?? []).map((a) => a.id)),
      routes: config
        ? ROUTE_OPTIONS.map((r) => {
            const mult = config.routeImpact[r.id];
            if (!mult) return r;
            return {
              ...r,
              riskScore: Math.min(100, Math.round(r.riskScore * mult)),
              disruptionProbability: Math.min(95, Math.round(r.disruptionProbability * mult)),
            };
          })
        : ROUTE_OPTIONS,
      affectedRouteIds,
    };
  }, [event, analyzing]);

  return <SimulationContext.Provider value={value}>{children}</SimulationContext.Provider>;
}

export function useSimulation(): SimulationValue {
  const ctx = useContext(SimulationContext);
  if (!ctx) throw new Error("useSimulation must be used inside SimulationProvider");
  return ctx;
}
