/** NER Smart Logistics — synthetic prototype dataset + scoring logic. */

export type RiskLevel = "low" | "moderate" | "high" | "blocked";

export const RISK_COLORS: Record<RiskLevel, string> = {
  low: "#34d399",
  moderate: "#facc15",
  high: "#fb923c",
  blocked: "#f43f5e",
};

export const RISK_LABEL: Record<RiskLevel, string> = {
  low: "Low",
  moderate: "Moderate",
  high: "High",
  blocked: "Blocked",
};

export function riskLevelFromScore(score: number): RiskLevel {
  if (score >= 85) return "blocked";
  if (score >= 65) return "high";
  if (score >= 40) return "moderate";
  return "low";
}

export function riskTextClass(level: RiskLevel) {
  return {
    low: "text-ok",
    moderate: "text-warn",
    high: "text-high",
    blocked: "text-danger",
  }[level];
}

export function riskBgClass(level: RiskLevel) {
  return {
    low: "bg-ok/15 text-ok border-ok/30",
    moderate: "bg-warn/15 text-warn border-warn/30",
    high: "bg-high/15 text-high border-high/30",
    blocked: "bg-danger/15 text-danger border-danger/30",
  }[level];
}

/* ------------------------------------------------------------------ */
/* Cities & hubs                                                       */
/* ------------------------------------------------------------------ */

export type Hub = {
  id: string;
  name: string;
  state: string;
  lat: number;
  lng: number;
  capacityTons: number;
  utilization: number;
  incoming: number;
  outgoing: number;
  accessibility: number;
  nearbyRoads: string[];
};

export const HUBS: Hub[] = [
  {
    id: "HUB-GHY",
    name: "Guwahati",
    state: "Assam",
    lat: 26.1445,
    lng: 91.7362,
    capacityTons: 24000,
    utilization: 78,
    incoming: 42,
    outgoing: 51,
    accessibility: 81,
    nearbyRoads: ["NH-27", "NH-37"],
  },
  {
    id: "HUB-SCL",
    name: "Silchar",
    state: "Assam",
    lat: 24.8333,
    lng: 92.7789,
    capacityTons: 9500,
    utilization: 64,
    incoming: 18,
    outgoing: 21,
    accessibility: 69,
    nearbyRoads: ["NH-6", "NH-37"],
  },
  {
    id: "HUB-SHL",
    name: "Shillong",
    state: "Meghalaya",
    lat: 25.5788,
    lng: 91.8933,
    capacityTons: 7200,
    utilization: 71,
    incoming: 14,
    outgoing: 12,
    accessibility: 65,
    nearbyRoads: ["NH-6", "NH-13"],
  },
  {
    id: "HUB-IMF",
    name: "Imphal",
    state: "Manipur",
    lat: 24.817,
    lng: 93.9368,
    capacityTons: 8400,
    utilization: 83,
    incoming: 22,
    outgoing: 16,
    accessibility: 60,
    nearbyRoads: ["NH-2", "NH-37"],
  },
  {
    id: "HUB-AJL",
    name: "Aizawl",
    state: "Mizoram",
    lat: 23.7271,
    lng: 92.7176,
    capacityTons: 5600,
    utilization: 58,
    incoming: 11,
    outgoing: 9,
    accessibility: 54,
    nearbyRoads: ["NH-6", "NH-54"],
  },
  {
    id: "HUB-KOH",
    name: "Kohima",
    state: "Nagaland",
    lat: 25.6751,
    lng: 94.11,
    capacityTons: 4800,
    utilization: 62,
    incoming: 9,
    outgoing: 8,
    accessibility: 58,
    nearbyRoads: ["NH-29", "NH-2"],
  },
  {
    id: "HUB-ITA",
    name: "Itanagar",
    state: "Arunachal Pradesh",
    lat: 27.0844,
    lng: 93.6053,
    capacityTons: 5200,
    utilization: 55,
    incoming: 10,
    outgoing: 7,
    accessibility: 48,
    nearbyRoads: ["NH-415", "NH-27"],
  },
  {
    id: "HUB-IXA",
    name: "Agartala",
    state: "Tripura",
    lat: 23.8315,
    lng: 91.2868,
    capacityTons: 6900,
    utilization: 67,
    incoming: 16,
    outgoing: 14,
    accessibility: 72,
    nearbyRoads: ["NH-8", "NH-208"],
  },
  {
    id: "HUB-DIB",
    name: "Dibrugarh",
    state: "Assam",
    lat: 27.4728,
    lng: 94.912,
    capacityTons: 7800,
    utilization: 61,
    incoming: 13,
    outgoing: 15,
    accessibility: 76,
    nearbyRoads: ["NH-37", "NH-15"],
  },
];

export const STATE_SCORES = [
  { state: "Sikkim", score: 84 },
  { state: "Assam", score: 78 },
  { state: "Tripura", score: 72 },
  { state: "Meghalaya", score: 65 },
  { state: "Manipur", score: 60 },
  { state: "Nagaland", score: 58 },
  { state: "Mizoram", score: 54 },
  { state: "Arunachal Pradesh", score: 48 },
];

/* ------------------------------------------------------------------ */
/* Road corridors                                                      */
/* ------------------------------------------------------------------ */

export type RiskFactors = {
  rainfall: number;
  landslide: number;
  flood: number;
  traffic: number;
  roadCondition: number;
  bridge: number;
  incidents: number;
};

export type Corridor = {
  id: string;
  name: string;
  label: string;
  from: string;
  to: string;
  distanceKm: number;
  baseHours: number;
  path: [number, number][];
  factors: RiskFactors;
};

/** Weighted accessibility/risk model used across the prototype. */
export const FACTOR_WEIGHTS: Record<keyof RiskFactors, number> = {
  rainfall: 0.2,
  landslide: 0.22,
  flood: 0.15,
  traffic: 0.1,
  roadCondition: 0.15,
  bridge: 0.08,
  incidents: 0.1,
};

export function computeRiskScore(f: RiskFactors): number {
  const total = (Object.keys(FACTOR_WEIGHTS) as (keyof RiskFactors)[]).reduce(
    (sum, k) => sum + f[k] * FACTOR_WEIGHTS[k],
    0,
  );
  return Math.round(Math.min(100, Math.max(0, total)));
}

export function accessibilityScore(f: RiskFactors): number {
  return 100 - computeRiskScore(f);
}

export const CORRIDORS: Corridor[] = [
  {
    id: "NH-37",
    name: "NH-37",
    label: "NH-37 (Assam – Manipur)",
    from: "Guwahati",
    to: "Imphal",
    distanceKm: 470,
    baseHours: 8.3,
    path: [
      [26.1445, 91.7362],
      [26.02, 92.4],
      [25.9, 92.9],
      [25.6, 93.2],
      [25.1, 93.6],
      [24.817, 93.9368],
    ],
    factors: {
      rainfall: 80,
      landslide: 78,
      flood: 60,
      traffic: 55,
      roadCondition: 65,
      bridge: 50,
      incidents: 85,
    },
  },
  {
    id: "NH-27",
    name: "NH-27",
    label: "NH-27 (Guwahati – Dibrugarh)",
    from: "Guwahati",
    to: "Dibrugarh",
    distanceKm: 440,
    baseHours: 7.4,
    path: [
      [26.1445, 91.7362],
      [26.35, 92.6],
      [26.7, 93.5],
      [27.1, 94.3],
      [27.4728, 94.912],
    ],
    factors: {
      rainfall: 45,
      landslide: 20,
      flood: 40,
      traffic: 45,
      roadCondition: 25,
      bridge: 20,
      incidents: 25,
    },
  },
  {
    id: "NH-13",
    name: "NH-13",
    label: "NH-13 (Shillong – Jowai)",
    from: "Shillong",
    to: "Jowai",
    distanceKm: 64,
    baseHours: 1.8,
    path: [
      [25.5788, 91.8933],
      [25.5, 92.05],
      [25.45, 92.2],
    ],
    factors: {
      rainfall: 85,
      landslide: 90,
      flood: 40,
      traffic: 35,
      roadCondition: 60,
      bridge: 45,
      incidents: 90,
    },
  },
  {
    id: "GHY-SCL",
    name: "Guwahati–Silchar",
    label: "Guwahati – Silchar Corridor",
    from: "Guwahati",
    to: "Silchar",
    distanceKm: 310,
    baseHours: 6.2,
    path: [
      [26.1445, 91.7362],
      [25.7, 92.1],
      [25.2, 92.5],
      [24.8333, 92.7789],
    ],
    factors: {
      rainfall: 50,
      landslide: 35,
      flood: 45,
      traffic: 30,
      roadCondition: 35,
      bridge: 30,
      incidents: 30,
    },
  },
  {
    id: "SCL-AJL",
    name: "Silchar–Aizawl",
    label: "Silchar – Aizawl (NH-6)",
    from: "Silchar",
    to: "Aizawl",
    distanceKm: 180,
    baseHours: 4.1,
    path: [
      [24.8333, 92.7789],
      [24.3, 92.75],
      [23.9, 92.74],
      [23.7271, 92.7176],
    ],
    factors: {
      rainfall: 40,
      landslide: 45,
      flood: 20,
      traffic: 20,
      roadCondition: 40,
      bridge: 25,
      incidents: 20,
    },
  },
  {
    id: "AJL-IMF",
    name: "Aizawl–Imphal",
    label: "Aizawl – Imphal Link",
    from: "Aizawl",
    to: "Imphal",
    distanceKm: 380,
    baseHours: 7.5,
    path: [
      [23.7271, 92.7176],
      [24.1, 93.1],
      [24.5, 93.6],
      [24.817, 93.9368],
    ],
    factors: {
      rainfall: 35,
      landslide: 30,
      flood: 15,
      traffic: 25,
      roadCondition: 40,
      bridge: 25,
      incidents: 15,
    },
  },
  {
    id: "IMF-UKL",
    name: "Imphal–Ukhrul",
    label: "Imphal – Ukhrul Road",
    from: "Imphal",
    to: "Ukhrul",
    distanceKm: 84,
    baseHours: 2.6,
    path: [
      [24.817, 93.9368],
      [25.0, 94.2],
      [25.05, 94.36],
    ],
    factors: {
      rainfall: 45,
      landslide: 50,
      flood: 20,
      traffic: 30,
      roadCondition: 70,
      bridge: 40,
      incidents: 45,
    },
  },
  {
    id: "AJL-LGL",
    name: "Aizawl–Lunglei",
    label: "Aizawl – Lunglei Road",
    from: "Aizawl",
    to: "Lunglei",
    distanceKm: 165,
    baseHours: 4.5,
    path: [
      [23.7271, 92.7176],
      [23.3, 92.75],
      [22.89, 92.73],
    ],
    factors: {
      rainfall: 25,
      landslide: 20,
      flood: 10,
      traffic: 15,
      roadCondition: 30,
      bridge: 20,
      incidents: 10,
    },
  },
  {
    id: "GHY-SHL",
    name: "Guwahati–Shillong",
    label: "Guwahati – Shillong (NH-6)",
    from: "Guwahati",
    to: "Shillong",
    distanceKm: 100,
    baseHours: 2.9,
    path: [
      [26.1445, 91.7362],
      [25.9, 91.82],
      [25.5788, 91.8933],
    ],
    factors: {
      rainfall: 60,
      landslide: 55,
      flood: 25,
      traffic: 50,
      roadCondition: 35,
      bridge: 30,
      incidents: 35,
    },
  },
  {
    id: "DIM-KOH",
    name: "Dimapur–Kohima",
    label: "Dimapur – Kohima (NH-29)",
    from: "Dimapur",
    to: "Kohima",
    distanceKm: 74,
    baseHours: 2.4,
    path: [
      [25.9, 93.72],
      [25.78, 93.95],
      [25.6751, 94.11],
    ],
    factors: {
      rainfall: 55,
      landslide: 60,
      flood: 20,
      traffic: 45,
      roadCondition: 55,
      bridge: 35,
      incidents: 40,
    },
  },
  {
    id: "GHY-ITA",
    name: "Guwahati–Itanagar",
    label: "Guwahati – Itanagar (NH-415)",
    from: "Guwahati",
    to: "Itanagar",
    distanceKm: 320,
    baseHours: 6.4,
    path: [
      [26.1445, 91.7362],
      [26.5, 92.3],
      [26.8, 93.0],
      [27.0844, 93.6053],
    ],
    factors: {
      rainfall: 65,
      landslide: 70,
      flood: 45,
      traffic: 30,
      roadCondition: 60,
      bridge: 55,
      incidents: 50,
    },
  },
  {
    id: "IXA-SCL",
    name: "Agartala–Silchar",
    label: "Agartala – Silchar (NH-8)",
    from: "Agartala",
    to: "Silchar",
    distanceKm: 260,
    baseHours: 5.6,
    path: [
      [23.8315, 91.2868],
      [24.1, 91.8],
      [24.5, 92.3],
      [24.8333, 92.7789],
    ],
    factors: {
      rainfall: 40,
      landslide: 25,
      flood: 45,
      traffic: 25,
      roadCondition: 35,
      bridge: 30,
      incidents: 20,
    },
  },
];

export function corridorRisk(c: Corridor) {
  return computeRiskScore(c.factors);
}

/* ------------------------------------------------------------------ */
/* Vehicles                                                            */
/* ------------------------------------------------------------------ */

export type Vehicle = {
  id: string;
  driver: string;
  cargo: string;
  priority: number;
  origin: string;
  destination: string;
  eta: string;
  remainingKm: number;
  status: "In Transit" | "Delayed" | "Delivered" | "Emergency" | "Idle";
  risk: number;
  lat: number;
  lng: number;
};

export const CARGO_PRIORITY: Record<string, number> = {
  "Medical Supplies": 100,
  "Drinking Water": 100,
  "Food Grains": 90,
  "Relief Material": 95,
  "FMCG Goods": 50,
  "Construction Material": 30,
  "Commercial Goods": 30,
  Cement: 30,
  "Petroleum Products": 60,
};

export const VEHICLES: Vehicle[] = [
  {
    id: "NE-027",
    driver: "Bipul Das",
    cargo: "Medical Supplies",
    priority: 100,
    origin: "Guwahati",
    destination: "Imphal",
    eta: "08:42 PM",
    remainingKm: 142,
    status: "Emergency",
    risk: 72,
    lat: 25.35,
    lng: 93.35,
  },
  {
    id: "NE-014",
    driver: "Lalrinsanga",
    cargo: "Food Grains",
    priority: 90,
    origin: "Silchar",
    destination: "Aizawl",
    eta: "05:10 PM",
    remainingKm: 64,
    status: "In Transit",
    risk: 34,
    lat: 24.2,
    lng: 92.75,
  },
  {
    id: "NE-041",
    driver: "Tarun Nath",
    cargo: "Cement",
    priority: 30,
    origin: "Guwahati",
    destination: "Shillong",
    eta: "03:25 PM",
    remainingKm: 28,
    status: "Delayed",
    risk: 48,
    lat: 25.86,
    lng: 91.81,
  },
  {
    id: "NE-063",
    driver: "Imliakum Ao",
    cargo: "FMCG Goods",
    priority: 50,
    origin: "Dimapur",
    destination: "Kohima",
    eta: "01:55 PM",
    remainingKm: 19,
    status: "In Transit",
    risk: 52,
    lat: 25.79,
    lng: 93.95,
  },
  {
    id: "NE-078",
    driver: "Rakesh Debbarma",
    cargo: "Drinking Water",
    priority: 100,
    origin: "Agartala",
    destination: "Silchar",
    eta: "09:20 PM",
    remainingKm: 188,
    status: "Emergency",
    risk: 38,
    lat: 24.15,
    lng: 91.85,
  },
  {
    id: "NE-092",
    driver: "Nabam Tayeng",
    cargo: "Construction Material",
    priority: 30,
    origin: "Guwahati",
    destination: "Itanagar",
    eta: "10:05 PM",
    remainingKm: 216,
    status: "In Transit",
    risk: 61,
    lat: 26.6,
    lng: 92.55,
  },
  {
    id: "NE-108",
    driver: "Pranab Gogoi",
    cargo: "Petroleum Products",
    priority: 60,
    origin: "Dibrugarh",
    destination: "Guwahati",
    eta: "11:40 PM",
    remainingKm: 305,
    status: "In Transit",
    risk: 29,
    lat: 26.95,
    lng: 94.1,
  },
  {
    id: "NE-119",
    driver: "Sanjay Marak",
    cargo: "Relief Material",
    priority: 95,
    origin: "Shillong",
    destination: "Jowai",
    eta: "02:30 PM",
    remainingKm: 22,
    status: "Delayed",
    risk: 81,
    lat: 25.5,
    lng: 92.03,
  },
  {
    id: "NE-125",
    driver: "Th. Bijoy Singh",
    cargo: "Food Grains",
    priority: 90,
    origin: "Imphal",
    destination: "Ukhrul",
    eta: "04:15 PM",
    remainingKm: 41,
    status: "In Transit",
    risk: 55,
    lat: 24.95,
    lng: 94.15,
  },
  {
    id: "NE-133",
    driver: "K. Zoramthanga",
    cargo: "Commercial Goods",
    priority: 30,
    origin: "Aizawl",
    destination: "Lunglei",
    eta: "06:50 PM",
    remainingKm: 96,
    status: "Delivered",
    risk: 18,
    lat: 23.3,
    lng: 92.74,
  },
];

export const FLEET_STATS = {
  total: 124,
  moving: 96,
  idle: 12,
  delayed: 11,
  emergency: 18,
};

/* ------------------------------------------------------------------ */
/* Shipments                                                           */
/* ------------------------------------------------------------------ */

export type Shipment = {
  id: string;
  cargo: string;
  origin: string;
  destination: string;
  vehicle: string;
  priority: "Emergency" | "High" | "Standard";
  eta: string;
  status: "Emergency" | "In Transit" | "Delayed" | "Delivered";
  weightTons: number;
};

export const SHIPMENTS: Shipment[] = [
  { id: "SHP-4821", cargo: "Medical Supplies", origin: "Guwahati", destination: "Imphal", vehicle: "NE-027", priority: "Emergency", eta: "18 May, 08:42 PM", status: "Emergency", weightTons: 6.2 },
  { id: "SHP-4822", cargo: "Drinking Water", origin: "Agartala", destination: "Silchar", vehicle: "NE-078", priority: "Emergency", eta: "18 May, 09:20 PM", status: "Emergency", weightTons: 12.4 },
  { id: "SHP-4809", cargo: "Food Grains", origin: "Silchar", destination: "Aizawl", vehicle: "NE-014", priority: "High", eta: "18 May, 05:10 PM", status: "In Transit", weightTons: 18.0 },
  { id: "SHP-4795", cargo: "Cement", origin: "Guwahati", destination: "Shillong", vehicle: "NE-041", priority: "Standard", eta: "18 May, 03:25 PM", status: "Delayed", weightTons: 24.5 },
  { id: "SHP-4788", cargo: "FMCG Goods", origin: "Dimapur", destination: "Kohima", vehicle: "NE-063", priority: "Standard", eta: "18 May, 01:55 PM", status: "In Transit", weightTons: 9.1 },
  { id: "SHP-4771", cargo: "Relief Material", origin: "Shillong", destination: "Jowai", vehicle: "NE-119", priority: "Emergency", eta: "18 May, 02:30 PM", status: "Delayed", weightTons: 4.8 },
  { id: "SHP-4762", cargo: "Petroleum Products", origin: "Dibrugarh", destination: "Guwahati", vehicle: "NE-108", priority: "High", eta: "18 May, 11:40 PM", status: "In Transit", weightTons: 30.0 },
  { id: "SHP-4744", cargo: "Commercial Goods", origin: "Aizawl", destination: "Lunglei", vehicle: "NE-133", priority: "Standard", eta: "18 May, 06:50 PM", status: "Delivered", weightTons: 7.3 },
  { id: "SHP-4739", cargo: "Construction Material", origin: "Guwahati", destination: "Itanagar", vehicle: "NE-092", priority: "Standard", eta: "18 May, 10:05 PM", status: "In Transit", weightTons: 26.6 },
  { id: "SHP-4728", cargo: "Food Grains", origin: "Imphal", destination: "Ukhrul", vehicle: "NE-125", priority: "High", eta: "18 May, 04:15 PM", status: "In Transit", weightTons: 11.2 },
];

/* ------------------------------------------------------------------ */
/* Alerts & incidents                                                  */
/* ------------------------------------------------------------------ */

export type Alert = {
  id: string;
  title: string;
  location: string;
  severity: "High" | "Moderate" | "Low";
  time: string;
  type: string;
  detail: string;
  corridorId?: string;
  lat: number;
  lng: number;
};

export const ALERTS: Alert[] = [
  {
    id: "ALT-901",
    title: "Landslide Reported",
    location: "NH-13, Near Jowai, Meghalaya",
    severity: "High",
    time: "18 May, 10:20 AM",
    type: "Landslide",
    detail:
      "Field officer reported a slope failure blocking both lanes. Debris clearance estimated at 6-9 hours. 3 vehicles held at Jowai checkpoint.",
    corridorId: "NH-13",
    lat: 25.45,
    lng: 92.2,
  },
  {
    id: "ALT-902",
    title: "Heavy Rainfall",
    location: "Dhemaji, Assam",
    severity: "Moderate",
    time: "18 May, 09:50 AM",
    type: "Weather",
    detail:
      "IMD-style nowcast indicates 64mm rainfall in 6 hours. Flood risk elevated for low-lying stretches of NH-15.",
    corridorId: "NH-27",
    lat: 27.48,
    lng: 94.58,
  },
  {
    id: "ALT-903",
    title: "Road Maintenance",
    location: "Imphal – Ukhrul Road",
    severity: "Moderate",
    time: "18 May, 09:10 AM",
    type: "Maintenance",
    detail: "Single-lane traffic between KM 22 and KM 31 until 20 May. Expect 40-60 min delay.",
    corridorId: "IMF-UKL",
    lat: 25.0,
    lng: 94.2,
  },
  {
    id: "ALT-904",
    title: "Route Cleared",
    location: "Aizawl – Lunglei Road",
    severity: "Low",
    time: "18 May, 08:45 AM",
    type: "Clearance",
    detail: "Debris cleared, corridor restored to full capacity. Accessibility score recovered to 78/100.",
    corridorId: "AJL-LGL",
    lat: 23.3,
    lng: 92.75,
  },
  {
    id: "ALT-905",
    title: "Bridge Load Restriction",
    location: "Kopili Bridge, NH-37",
    severity: "High",
    time: "18 May, 07:30 AM",
    type: "Bridge",
    detail: "Load capped at 18T after inspection. Heavy vehicles diverted via Lanka bypass.",
    corridorId: "NH-37",
    lat: 25.9,
    lng: 92.9,
  },
];

export type Incident = {
  id: string;
  type: string;
  severity: "High" | "Moderate" | "Low";
  location: string;
  route: string;
  impact: string;
  reporter: string;
  time: string;
  status: "Active" | "Resolved";
};

export const INCIDENTS: Incident[] = [
  { id: "INC-2201", type: "Landslide", severity: "High", location: "Near Jowai, Meghalaya", route: "NH-13", impact: "6-9 hrs closure, 3 vehicles held", reporter: "Field Officer R. Lyngdoh", time: "18 May, 10:20 AM", status: "Active" },
  { id: "INC-2200", type: "Flood", severity: "High", location: "Dhemaji, Assam", route: "NH-15", impact: "2 districts affected, 4 vehicles rerouted", reporter: "District Control Room", time: "18 May, 09:55 AM", status: "Active" },
  { id: "INC-2198", type: "Accident", severity: "Moderate", location: "Nagaon Bypass, Assam", route: "NH-37", impact: "45 min delay", reporter: "Driver NE-041", time: "18 May, 08:15 AM", status: "Active" },
  { id: "INC-2195", type: "Bridge Damage", severity: "High", location: "Kopili Bridge", route: "NH-37", impact: "18T load restriction", reporter: "PWD Inspection", time: "18 May, 07:30 AM", status: "Active" },
  { id: "INC-2190", type: "Road Blocked", severity: "Moderate", location: "Ukhrul Road KM-24", route: "Imphal–Ukhrul", impact: "Single lane traffic", reporter: "Field Officer L. Shimray", time: "17 May, 06:40 PM", status: "Active" },
  { id: "INC-2184", type: "Landslide", severity: "Moderate", location: "Lunglei Ghat", route: "Aizawl–Lunglei", impact: "Cleared after 5 hrs", reporter: "Field Officer C. Ralte", time: "17 May, 11:05 AM", status: "Resolved" },
  { id: "INC-2179", type: "Flood", severity: "Low", location: "Karimganj", route: "NH-8", impact: "Minor waterlogging", reporter: "State Transport Dept", time: "16 May, 04:20 PM", status: "Resolved" },
];

/* ------------------------------------------------------------------ */
/* Analytics data                                                      */
/* ------------------------------------------------------------------ */

export const DEMAND_7D = [
  { day: "12 May", Assam: 118, Manipur: 62, Meghalaya: 74 },
  { day: "13 May", Assam: 126, Manipur: 58, Meghalaya: 81 },
  { day: "14 May", Assam: 112, Manipur: 71, Meghalaya: 69 },
  { day: "15 May", Assam: 134, Manipur: 66, Meghalaya: 88 },
  { day: "16 May", Assam: 129, Manipur: 78, Meghalaya: 76 },
  { day: "17 May", Assam: 141, Manipur: 73, Meghalaya: 94 },
  { day: "18 May", Assam: 137, Manipur: 84, Meghalaya: 101 },
];

export const DEMAND_30D = Array.from({ length: 30 }, (_, i) => ({
  day: `D-${30 - i}`,
  demand: Math.round(240 + 60 * Math.sin(i / 3) + i * 2.4),
  capacity: 340,
}));

export const COMMODITIES = [
  { name: "Agricultural Produce", value: "1,245 Tons", trend: 16, up: true },
  { name: "Cement", value: "876 Tons", trend: 8, up: true },
  { name: "FMCG Goods", value: "623 Tons", trend: 12, up: true },
  { name: "Petroleum Products", value: "512 KL", trend: 3, up: false },
  { name: "Steel & Iron", value: "498 Tons", trend: 5, up: true },
];

export const NETWORK_PERFORMANCE = {
  accessibility: 82,
  avgEtaMinutes: 412,
  delayRate: 14.2,
  reliability: 88.6,
  avgDisruptionHours: 6.4,
  vehiclesAffected: 31,
  emergencyProtected: 96.1,
};

export const NETWORK_TREND = [
  { week: "W-6", accessibility: 74, reliability: 81, delays: 22 },
  { week: "W-5", accessibility: 76, reliability: 83, delays: 20 },
  { week: "W-4", accessibility: 73, reliability: 80, delays: 24 },
  { week: "W-3", accessibility: 79, reliability: 85, delays: 18 },
  { week: "W-2", accessibility: 80, reliability: 86, delays: 16 },
  { week: "W-1", accessibility: 82, reliability: 89, delays: 14 },
];

export const HORIZON_RISK = [
  { horizon: "1 hour", probability: 34 },
  { horizon: "6 hours", probability: 72 },
  { horizon: "12 hours", probability: 66 },
  { horizon: "24 hours", probability: 51 },
];

export const DATA_SOURCES = [
  { name: "IMD", scope: "Weather & rainfall nowcast", status: "Integration Required" },
  { name: "Bhuvan / ISRO", scope: "GIS, terrain & landslide susceptibility", status: "Integration Required" },
  { name: "OpenStreetMap", scope: "Road network & base map", status: "Connected" },
  { name: "MoRTH / NHAI", scope: "Highway condition & bridge registry", status: "Integration Required" },
  { name: "State Transport Departments", scope: "Fleet & permit data", status: "Integration Required" },
  { name: "Field Reports", scope: "Officer & driver incident reports", status: "Connected" },
  { name: "GPS Telemetry", scope: "Live vehicle positions", status: "Connected" },
] as const;

/* ------------------------------------------------------------------ */
/* Route comparison engine                                             */
/* ------------------------------------------------------------------ */

export type RouteOption = {
  id: string;
  label: string;
  legs: string[];
  distanceKm: number;
  hours: number;
  riskScore: number;
  disruptionProbability: number;
  path: [number, number][];
};

export const ROUTE_OPTIONS: RouteOption[] = [
  {
    id: "A",
    label: "Route A — Direct via NH-37",
    legs: ["Guwahati", "Nagaon", "Dimapur", "Imphal"],
    distanceKm: 470,
    hours: 8.33,
    riskScore: 72,
    disruptionProbability: 72,
    path: [
      [26.1445, 91.7362],
      [26.02, 92.4],
      [25.9, 92.9],
      [25.6, 93.2],
      [25.1, 93.6],
      [24.817, 93.9368],
    ],
  },
  {
    id: "B",
    label: "Route B — Silchar – Aizawl – Imphal",
    legs: ["Guwahati", "Silchar", "Aizawl", "Imphal"],
    distanceKm: 518,
    hours: 9.63,
    riskScore: 28,
    disruptionProbability: 21,
    path: [
      [26.1445, 91.7362],
      [25.7, 92.1],
      [24.8333, 92.7789],
      [23.7271, 92.7176],
      [24.3, 93.3],
      [24.817, 93.9368],
    ],
  },
  {
    id: "C",
    label: "Route C — Via Shillong & Jowai",
    legs: ["Guwahati", "Shillong", "Jowai", "Silchar", "Imphal"],
    distanceKm: 545,
    hours: 10.4,
    riskScore: 64,
    disruptionProbability: 58,
    path: [
      [26.1445, 91.7362],
      [25.5788, 91.8933],
      [25.45, 92.2],
      [24.8333, 92.7789],
      [24.5, 93.4],
      [24.817, 93.9368],
    ],
  },
];

/** Cost = distance + time + risk penalty scaled by cargo priority. */
export function routeCost(route: RouteOption, cargoPriority: number) {
  const distanceCost = route.distanceKm * 0.6;
  const timeCost = route.hours * 22;
  const riskPenalty = route.riskScore * (1 + cargoPriority / 60);
  return Math.round(distanceCost + timeCost + riskPenalty);
}

export function rankRoutes(routes: RouteOption[], cargoPriority: number) {
  return [...routes].sort((a, b) => routeCost(a, cargoPriority) - routeCost(b, cargoPriority));
}

export function recommendationReason(best: RouteOption, base: RouteOption, cargo: string, priority: number) {
  if (best.id === base.id) {
    return `${best.label} is both the fastest and the most reliable option for ${cargo}. No safer alternative justifies the extra distance.`;
  }
  const extraKm = Math.round(best.distanceKm - base.distanceKm);
  const extraHrs = (best.hours - base.hours).toFixed(1);
  const safer = base.disruptionProbability - best.disruptionProbability;
  const priorityNote =
    priority >= 90
      ? `Because the cargo is ${cargo.toLowerCase()} (priority ${priority}/100), reliability is weighted above shortest distance.`
      : `Cargo priority is ${priority}/100, so the risk penalty still outweighs the added distance.`;
  return `${best.label} is recommended. It is ${extraKm} km longer and adds ${extraHrs} hrs, but reduces disruption probability from ${base.disruptionProbability}% to ${best.disruptionProbability}% (${safer} points safer). ${priorityNote}`;
}

/* ------------------------------------------------------------------ */
/* What-if simulator                                                   */
/* ------------------------------------------------------------------ */

export type SimulationResult = {
  corridor: string;
  affectedVehicles: number;
  affectedDistricts: number;
  emergencyDeliveries: number;
  additionalDistanceKm: number;
  expectedDelayHours: number;
  recommendedCorridor: string;
  accessibilityDrop: number;
};

const SIM_PROFILE: Record<string, SimulationResult> = {
  "NH-37": {
    corridor: "NH-37",
    affectedVehicles: 18,
    affectedDistricts: 5,
    emergencyDeliveries: 7,
    additionalDistanceKm: 1240,
    expectedDelayHours: 11.6,
    recommendedCorridor: "Silchar → Aizawl → Imphal",
    accessibilityDrop: 14,
  },
  "NH-27": {
    corridor: "NH-27",
    affectedVehicles: 26,
    affectedDistricts: 7,
    emergencyDeliveries: 4,
    additionalDistanceKm: 1810,
    expectedDelayHours: 15.2,
    recommendedCorridor: "Guwahati → Tezpur → Dibrugarh (NH-15)",
    accessibilityDrop: 19,
  },
  "NH-13": {
    corridor: "NH-13",
    affectedVehicles: 9,
    affectedDistricts: 3,
    emergencyDeliveries: 2,
    additionalDistanceKm: 420,
    expectedDelayHours: 5.4,
    recommendedCorridor: "Shillong → Nongstoin → Silchar",
    accessibilityDrop: 8,
  },
  "GHY-SCL": {
    corridor: "Guwahati–Silchar",
    affectedVehicles: 21,
    affectedDistricts: 6,
    emergencyDeliveries: 6,
    additionalDistanceKm: 1490,
    expectedDelayHours: 13.1,
    recommendedCorridor: "Guwahati → Shillong → Jowai → Silchar",
    accessibilityDrop: 16,
  },
  "SCL-AJL": {
    corridor: "Silchar–Aizawl",
    affectedVehicles: 12,
    affectedDistricts: 4,
    emergencyDeliveries: 3,
    additionalDistanceKm: 760,
    expectedDelayHours: 8.2,
    recommendedCorridor: "Silchar → Champhai → Aizawl",
    accessibilityDrop: 11,
  },
  "IMF-UKL": {
    corridor: "Imphal–Ukhrul",
    affectedVehicles: 6,
    affectedDistricts: 2,
    emergencyDeliveries: 1,
    additionalDistanceKm: 240,
    expectedDelayHours: 3.6,
    recommendedCorridor: "Imphal → Litan → Ukhrul (state road)",
    accessibilityDrop: 5,
  },
};

export function simulateClosure(corridorId: string): SimulationResult {
  const known = SIM_PROFILE[corridorId];
  if (known) return known;
  const c = CORRIDORS.find((x) => x.id === corridorId);
  const risk = c ? corridorRisk(c) : 50;
  return {
    corridor: c?.name ?? corridorId,
    affectedVehicles: Math.round(4 + risk / 6),
    affectedDistricts: Math.round(1 + risk / 25),
    emergencyDeliveries: Math.round(risk / 22),
    additionalDistanceKm: Math.round((c?.distanceKm ?? 200) * 2.6),
    expectedDelayHours: Number(((c?.baseHours ?? 4) * 1.4).toFixed(1)),
    recommendedCorridor: "Nearest resilient corridor via Silchar",
    accessibilityDrop: Math.round(risk / 7),
  };
}

/* ------------------------------------------------------------------ */
/* AI assistant (simulated)                                            */
/* ------------------------------------------------------------------ */

export const ASSISTANT_PROMPTS = [
  "Best route from Guwahati to Imphal",
  "Check NH-27 risk",
  "Nearest warehouse in Nagaland",
  "Demand forecast for Assam",
];

export function assistantReply(question: string): string {
  const q = question.toLowerCase();
  if (q.includes("guwahati") && q.includes("imphal")) {
    return "Route B is recommended. It is 48 km longer but reduces disruption probability from 72% to 21%. Because the cargo is medical, reliability is prioritized over shortest distance. Corridor: Guwahati → Silchar → Aizawl → Imphal, ETA 09:63 hrs.";
  }
  if (q.includes("nh-27")) {
    return "NH-27 (Guwahati – Dibrugarh) currently scores 33/100 risk — Moderate. Main drivers: rainfall 45%, flood 40%, traffic 45%. No closures reported in the last 24 hours; 26 vehicles would be affected if it closed.";
  }
  if (q.includes("nh-37")) {
    return "NH-37 (Assam – Manipur) is at 72/100 risk — High. Landslide susceptibility 78%, rainfall 80%, and an active 18T bridge restriction at Kopili. Recommend diverting emergency cargo to the Silchar–Aizawl corridor.";
  }
  if (q.includes("warehouse") || q.includes("hub")) {
    if (q.includes("nagaland"))
      return "Nearest hub in Nagaland is Kohima (HUB-KOH): 4,800 T capacity, 62% utilized, accessibility 58/100. Dimapur–Kohima (NH-29) is the feeding corridor at moderate risk (49/100).";
    return "Guwahati (HUB-GHY) is the largest hub: 24,000 T capacity, 78% utilized, accessibility 81/100, connected to NH-27 and NH-37.";
  }
  if (q.includes("demand")) {
    return "Assam 7-day demand is trending up 12.4% (137 units today vs 118 on 12 May). Agricultural produce and cement drive the increase. Warehouse pressure is highest at Guwahati (78% utilization).";
  }
  if (q.includes("simulat") || q.includes("closure")) {
    return "Simulating an NH-37 closure: 18 vehicles affected, 5 districts, 7 emergency deliveries, +1,240 km network distance and +11.6 hrs expected delay. Recommended corridor: Silchar → Aizawl → Imphal.";
  }
  if (q.includes("alert") || q.includes("incident")) {
    return "5 active alerts. Highest severity: landslide on NH-13 near Jowai (High) and an 18T bridge restriction on NH-37. 3 vehicles are held at Jowai checkpoint.";
  }
  return "I track accessibility, risk and routing across the NER network. Ask me about a corridor's risk, the best route between two cities, hub capacity, demand forecasts, or run a what-if closure simulation. All answers are prototype computations over synthetic data.";
}

export const LANGUAGES = ["English", "हिन्दी", "অসমীয়া", "বাংলা", "মৈতৈলোন্", "Mizo", "Nagamese"];
