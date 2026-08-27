import { useEffect } from "react";
import { MapContainer, TileLayer, Polyline, CircleMarker, Tooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  CORRIDORS,
  HUBS,
  VEHICLES,
  ALERTS,
  RISK_COLORS,
  corridorRisk,
  riskLevelFromScore,
  type Corridor,
} from "@/lib/ner-data";

export type MapLayers = {
  roadRisk: boolean;
  weather: boolean;
  traffic: boolean;
  incidents: boolean;
  bridges: boolean;
  warehouses: boolean;
  vehicles: boolean;
};

export const DEFAULT_LAYERS: MapLayers = {
  roadRisk: true,
  weather: false,
  traffic: false,
  incidents: true,
  bridges: false,
  warehouses: true,
  vehicles: true,
};

function Resizer() {
  const map = useMap();
  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 200);
    const onResize = () => map.invalidateSize();
    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", onResize);
    };
  }, [map]);
  return null;
}

export type MapProps = {
  layers?: Partial<MapLayers>;
  onSelectCorridor?: (c: Corridor) => void;
  highlightCorridorIds?: string[];
  blockedCorridorIds?: string[];
  extraPaths?: { id: string; path: [number, number][]; color: string; dashed?: boolean }[];
  center?: [number, number];
  zoom?: number;
  showCorridors?: boolean;
};

export default function NerMapInner({
  layers,
  onSelectCorridor,
  highlightCorridorIds = [],
  blockedCorridorIds = [],
  extraPaths = [],
  center = [25.6, 92.9],
  zoom = 7,
  showCorridors = true,
}: MapProps) {
  const l = { ...DEFAULT_LAYERS, ...layers };

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom
      className="h-full w-full"
      zoomControl={true}
    >
      <Resizer />
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution="&copy; OpenStreetMap contributors &copy; CARTO"
      />

      {showCorridors &&
        l.roadRisk &&
        CORRIDORS.map((c) => {
          const blocked = blockedCorridorIds.includes(c.id);
          const score = blocked ? 95 : corridorRisk(c);
          const level = riskLevelFromScore(score);
          const highlighted = highlightCorridorIds.includes(c.id);
          return (
            <Polyline
              key={c.id}
              positions={c.path}
              pathOptions={{
                color: RISK_COLORS[level],
                weight: highlighted || blocked ? 7 : 4.5,
                opacity: highlighted || blocked ? 1 : 0.85,
                dashArray: blocked ? "10 8" : undefined,
              }}
              eventHandlers={{ click: () => onSelectCorridor?.(c) }}
            >
              <Tooltip sticky>
                <span className="text-xs font-semibold">{c.label}</span>
                <br />
                <span className="text-xs">
                  Risk {score}/100 · {c.distanceKm} km
                </span>
              </Tooltip>
            </Polyline>
          );
        })}

      {extraPaths.map((p) => (
        <Polyline
          key={p.id}
          positions={p.path}
          pathOptions={{ color: p.color, weight: 6, opacity: 0.95, dashArray: p.dashed ? "8 8" : undefined }}
        />
      ))}

      {l.warehouses &&
        HUBS.map((h) => (
          <CircleMarker
            key={h.id}
            center={[h.lat, h.lng]}
            radius={6}
            pathOptions={{ color: "#22d3ee", fillColor: "#0e7490", fillOpacity: 0.9, weight: 2 }}
          >
            <Tooltip>
              <span className="text-xs font-semibold">{h.name} Hub</span>
              <br />
              <span className="text-xs">
                {h.utilization}% utilized · Access {h.accessibility}/100
              </span>
            </Tooltip>
          </CircleMarker>
        ))}

      {l.vehicles &&
        VEHICLES.map((v) => (
          <CircleMarker
            key={v.id}
            center={[v.lat, v.lng]}
            radius={5}
            pathOptions={{
              color: v.status === "Emergency" ? "#f43f5e" : "#a78bfa",
              fillColor: v.status === "Emergency" ? "#f43f5e" : "#a78bfa",
              fillOpacity: 1,
              weight: 2,
            }}
          >
            <Tooltip>
              <span className="text-xs font-semibold">
                {v.id} · {v.cargo}
              </span>
              <br />
              <span className="text-xs">
                {v.origin} → {v.destination} · Risk {v.risk}
              </span>
            </Tooltip>
          </CircleMarker>
        ))}

      {l.incidents &&
        ALERTS.map((a) => (
          <CircleMarker
            key={a.id}
            center={[a.lat, a.lng]}
            radius={8}
            pathOptions={{
              color: a.severity === "High" ? "#f43f5e" : a.severity === "Moderate" ? "#facc15" : "#34d399",
              fillOpacity: 0.25,
              weight: 2,
            }}
          >
            <Tooltip>
              <span className="text-xs font-semibold">{a.title}</span>
              <br />
              <span className="text-xs">{a.location}</span>
            </Tooltip>
          </CircleMarker>
        ))}

      {l.weather &&
        [
          { id: "w1", lat: 27.48, lng: 94.58, r: 34 },
          { id: "w2", lat: 25.45, lng: 92.2, r: 26 },
          { id: "w3", lat: 24.9, lng: 93.7, r: 30 },
        ].map((w) => (
          <CircleMarker
            key={w.id}
            center={[w.lat, w.lng]}
            radius={w.r}
            pathOptions={{ color: "#38bdf8", fillColor: "#38bdf8", fillOpacity: 0.1, weight: 1 }}
          >
            <Tooltip>
              <span className="text-xs">Rainfall cluster · nowcast</span>
            </Tooltip>
          </CircleMarker>
        ))}

      {l.bridges &&
        [
          { id: "b1", lat: 25.9, lng: 92.9, name: "Kopili Bridge · 18T limit" },
          { id: "b2", lat: 26.35, lng: 92.6, name: "Kaliabor Bridge · OK" },
          { id: "b3", lat: 24.5, lng: 92.3, name: "Barak Bridge · Inspection due" },
        ].map((b) => (
          <CircleMarker
            key={b.id}
            center={[b.lat, b.lng]}
            radius={5}
            pathOptions={{ color: "#c084fc", fillColor: "#c084fc", fillOpacity: 1, weight: 2 }}
          >
            <Tooltip>
              <span className="text-xs">{b.name}</span>
            </Tooltip>
          </CircleMarker>
        ))}

      {l.traffic &&
        CORRIDORS.filter((c) => c.factors.traffic >= 45).map((c) => (
          <Polyline
            key={`t-${c.id}`}
            positions={c.path}
            pathOptions={{ color: "#f97316", weight: 12, opacity: 0.14 }}
          />
        ))}
    </MapContainer>
  );
}
