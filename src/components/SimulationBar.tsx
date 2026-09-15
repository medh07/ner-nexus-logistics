import { CloudRain, Loader2, Mountain, RotateCcw, TriangleAlert } from "lucide-react";
import { useSimulation } from "@/lib/simulation";
import { cn } from "@/lib/utils";

/** Global simulation control strip — available on every page. */
export function SimulationBar() {
  const sim = useSimulation();

  return (
    <div
      className={cn(
        "border-b px-3 py-2 sm:px-4",
        sim.active ? "border-warn/30 bg-warn/8" : "border-border bg-surface/40",
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="label-xs flex items-center gap-1.5">
          <TriangleAlert className={cn("h-3.5 w-3.5", sim.active ? "text-warn" : "text-muted-foreground")} />
          Simulate Environmental Event
        </span>

        <button
          onClick={() => sim.toggle("rain")}
          className={cn(
            "flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-medium transition-colors",
            sim.event === "rain"
              ? "border-warn/50 bg-warn/12 text-warn"
              : "border-border bg-background/40 text-muted-foreground hover:text-foreground",
          )}
        >
          <CloudRain className="h-3.5 w-3.5" /> Heavy Rainfall
        </button>
        <button
          onClick={() => sim.toggle("landslide")}
          className={cn(
            "flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-medium transition-colors",
            sim.event === "landslide"
              ? "border-danger/50 bg-danger/12 text-danger"
              : "border-border bg-background/40 text-muted-foreground hover:text-foreground",
          )}
        >
          <Mountain className="h-3.5 w-3.5" /> Landslide
        </button>

        {sim.active ? (
          <button
            onClick={sim.reset}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-background/40 px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <RotateCcw className="h-3 w-3" /> Reset Simulation
          </button>
        ) : null}

        {sim.analyzing ? (
          <span className="flex items-center gap-1.5 text-[11px] text-cyan">
            <Loader2 className="h-3 w-3 animate-spin" /> Analyzing environmental impact...
          </span>
        ) : sim.active ? (
          <span className="flex items-center gap-1.5 rounded-lg border border-warn/35 bg-warn/12 px-2.5 py-1.5 text-[11px] font-semibold text-warn">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-warn" />
            Simulation active · {sim.label} · displayed values are temporary
          </span>
        ) : (
          <span className="text-[11px] text-muted-foreground/80">
            Non-destructive — live data is never changed
          </span>
        )}
      </div>
    </div>
  );
}
