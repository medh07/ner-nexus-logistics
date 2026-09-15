# NER Logistics Command

Build a production-quality responsive web app called:

NER SMART LOGISTICS

AI-Powered Logistics & Accessibility Intelligence Platform for North East India

IMPORTANT:

I am attaching a reference UI screenshot. RECREATE ITS VISUAL STYLE, LAYOUT, SPACING, CARD STRUCTURE, NAVIGATION AND INFORMATION DENSITY AS CLOSELY AS POSSIBLE. Treat the screenshot as the visual source of truth.

The design must combine:

- futuristic AI command center

- professional Government/enterprise dashboard

- dark navy/black background

- cyan/blue/purple accents

- green/yellow/orange/red status colors

- rounded cards

- subtle glow/borders

- premium typography

- map-centric layout

- clean, dense but readable information

Do NOT make it look like a generic SaaS dashboard or Google Maps clone.

==================================================

CORE PRODUCT

==================================================

This platform helps MDoNER/government authorities, logistics operators, drivers and field officers:

1. Monitor NER road accessibility

2. Track vehicles

3. Track cargo/shipments

4. Detect disruptions

5. Predict disruption risk

6. Recommend safer alternate routes

7. Collect field incident reports

8. Monitor logistics hubs

9. Forecast demand

10. Analyze network performance

11. Simulate corridor/road failures

12. Provide an AI logistics assistant

13. Support offline-style field reporting

14. Support multilingual operation

Core workflow:

DETECT → PREDICT → SCORE → REROUTE → ALERT → SIMULATE

==================================================

TECH STACK

==================================================

Use:

- React + TypeScript + Vite

- Tailwind CSS

- shadcn/ui

- Lucide icons

- Recharts

- Leaflet / React Leaflet

- Component-based architecture

Use realistic mock/synthetic data so the app works without API keys.

Do not leave TODOs, blank pages or dead buttons.

==================================================

GLOBAL LAYOUT

==================================================

Create:

- fixed left sidebar

- top header

- large main content area

- responsive mobile layout

Sidebar:

DASHBOARD

OPERATIONS

  Route Intelligence

  Accessibility Map

  Vehicle Tracking

  Cargo & Shipments

  Field Reports

  Incident & Alerts

ANALYTICS

  Demand Forecasting

  Risk & Prediction

  Network Performance

  Reports & Analytics

ADMIN

  Users & Roles

  Hubs & Infrastructure

  Settings

Bottom of sidebar:

🟢 All Systems Operational

Top header:

NER Smart Logistics

AI-Powered Accessibility Intelligence

Search:

"Search routes, places, vehicles, hubs..."

Language selector

Notifications

Admin profile

==================================================

MAIN DASHBOARD — MOST IMPORTANT SCREEN

==================================================

Recreate the reference screenshot's dashboard layout.

Header:

COMMAND CENTER

Real-time Logistics Intelligence for North East Region

Show date, Guwahati weather and system status.

KPI cards:

NETWORK ACCESSIBILITY

82% | Good | +9.2%

ACTIVE VEHICLES

124 | Live

ACTIVE DISRUPTIONS

17 | 4 new today

EMERGENCY SHIPMENTS

18 | 3 new

ETA COMPLIANCE

91% | +7.6%

==================================================

AI ACCESSIBILITY MAP

==================================================

Make this the largest/central visual element.

Use Leaflet and show North East India:

Assam

Arunachal Pradesh

Meghalaya

Manipur

Mizoram

Nagaland

Tripura

Sikkim

Show:

- road segments

- vehicle markers

- logistics hubs

- incident markers

- emergency locations

Road colors:

🟢 Low Risk

🟡 Moderate

🟠 High

🔴 Blocked

Map layer controls:

Road Risk

Weather

Traffic

Incidents

Bridges

Warehouses

Clicking a route opens details such as:

NH-37

Risk Score: 72/100

Rainfall Risk: High

Landslide Risk: High

Flood Risk: Medium

Status: High Risk

==================================================

ACCESSIBILITY SCORE

==================================================

Implement a dynamic 0–100 Accessibility Score based on:

road condition

rainfall

flood risk

landslide risk

traffic

bridge status

field reports

historical incidents

Example states:

Assam 78

Meghalaya 65

Nagaland 58

Manipur 60

Mizoram 54

Tripura 72

Arunachal Pradesh 48

Sikkim 84

==================================================

ACTIVE ALERTS

==================================================

Right-side dashboard panel:

ACTIVE ALERTS

🔴 Landslide Reported

NH-13, Meghalaya

High

🟡 Heavy Rainfall

Dhemaji, Assam

Moderate

🟡 Road Maintenance

Imphal–Ukhrul Road

🟢 Route Cleared

Aizawl–Lunglei Road

Make alerts clickable and open detail modals.

==================================================

AI PREDICTION

==================================================

Create a visually impressive prediction card:

AI PREDICTION

Next 6 Hours

72%

Disruption Probability

Corridor: NH-37

Reason:

Heavy rainfall + landslide risk

Button:

View Full Analysis

==================================================

AI ASSISTANT

==================================================

Create an interactive AI Assistant.

Suggested prompts:

- Best route from Guwahati to Imphal

- Check NH-27 risk

- Nearest warehouse in Nagaland

- Demand forecast for Assam

Example response:

"Route B is recommended. It is 48 km longer but reduces disruption probability from 72% to 21%. Because the cargo is medical, reliability is prioritized over shortest distance."

Use simulated AI responses.

==================================================

LOWER DASHBOARD ANALYTICS

==================================================

Create:

1. DEMAND FORECASTING

7-day line chart using Recharts.

2. TOP COMMODITIES MOVED

Agricultural Produce

Cement

FMCG

Petroleum

Steel/Iron

3. ACCESSIBILITY BY STATE

Progress bars for all 8 NER states.

4. SMART INSIGHT banner:

⭐ SMART INSIGHT

"Consider Route via Silchar–Aizawl–Imphal.

21% safer with only 1.3 hrs additional travel time."

Button:

View Recommended Routes

==================================================

MOBILE APP PREVIEW

==================================================

Include a realistic phone mockup:

Vehicle NE-027

Medical Supplies

Guwahati → Imphal

In Transit

ETA 08:42 PM

142 km remaining

Risk: HIGH

Recommended:

Reroute via Silchar–Aizawl

Button:

Accept Reroute

==================================================

OTHER PAGES

==================================================

ROUTE INTELLIGENCE

- origin/destination

- cargo type

- cargo priority

- compare multiple routes

- distance

- ETA

- risk

- disruption probability

- recommended route

- reason for recommendation

Example:

Route A:

470 km | 8h20 | Risk 72%

Route B:

520 km | 9h05 | Risk 21% | RECOMMENDED

For emergency cargo prioritize safety/reliability over shortest distance.

--------------------------------------------

VEHICLE TRACKING

- fleet statistics

- live map

- vehicle markers

- vehicle table

- driver

- cargo

- destination

- ETA

- risk

- status

- vehicle detail modal

--------------------------------------------

CARGO & SHIPMENTS

Statuses:

Emergency

In Transit

Delayed

Delivered

Include shipment ID, cargo, origin, destination, vehicle, priority, ETA and status.

--------------------------------------------

FIELD REPORTS

Create mobile-friendly reporting:

🚧 Road Blocked

🌊 Flood

⛰️ Landslide

🌉 Bridge Damaged

🚗 Accident

⚠️ Other

Capture:

GPS

photo

description

timestamp

voice-report UI

After submission show:

AI ANALYSIS

Possible Landslide Detected

Confidence 87%

Risk HIGH

Update the affected road on the map.

--------------------------------------------

INCIDENT & ALERTS

- active/resolved incidents

- severity

- location

- route affected

- estimated impact

- reporter

- timestamp

- filters

--------------------------------------------

RISK & PREDICTION

Show disruption probability for:

1 hour

6 hours

12 hours

24 hours

Show risk factors:

rainfall

landslide

flood

traffic

road condition

historical incidents

Clearly label these as prototype predictions.

--------------------------------------------

DEMAND FORECASTING

Show:

7-day forecast

30-day forecast

state demand

commodity demand

warehouse demand

emergency supply demand

--------------------------------------------

NETWORK PERFORMANCE

Show:

network accessibility

average ETA

delays

route reliability

disruption duration

vehicles affected

emergency shipments protected

--------------------------------------------

HUBS & INFRASTRUCTURE

Map and cards for:

Guwahati

Silchar

Shillong

Imphal

Aizawl

Kohima

Itanagar

Agartala

Show:

capacity

utilization

incoming/outgoing shipments

nearby roads

accessibility score

KILLER FEATURE — WHAT-IF SIMULATOR

Create:

NETWORK DISRUPTION SIMULATOR

Example:

SIMULATE NH-37 CLOSURE

Then calculate/display:

Affected Vehicles: 18

Affected Districts: 5

Emergency Deliveries: 7

Additional Distance: +1,240 km

Expected Delay: +11.6 hours

Recommended Corridor: Silchar → Aizawl → Imphal

Visually highlight affected routes on the map.

==================================================

AI / ROUTE LOGIC

==================================================

Implement functional prototype logic.

Risk Score =

rainfall

+ landslide risk

+ flood risk

+ road condition

+ traffic

+ bridge risk

+ incident reports

Route Cost =

distance

+ ETA

+ risk penalty

+ cargo priority penalty

Cargo priority:

Medical Supplies = 100

Water = 100

Food = 90

FMCG = 50

Construction = 30

Commercial = 30

Emergency cargo should prioritize safer routes.

Always explain WHY a route was recommended.

DATA SOURCES UI

Create a Data Sources page/card showing:

IMD — Weather

Bhuvan/ISRO — GIS

OpenStreetMap — Roads

State Transport Departments

Field Reports

GPS

Use:

🟢 Connected

🟡 Integration Required

Do NOT falsely claim live government API integration.

==================================================

DEMO DATA

==================================================

Use realistic NER locations and routes:

Guwahati

Shillong

Imphal

Aizawl

Kohima

Itanagar

Agartala

Silchar

Dibrugarh

Routes:

NH-27

NH-37

NH-13

Guwahati–Imphal

Silchar–Aizawl

Imphal–Ukhrul

Aizawl–Lunglei

==================================================

DESIGN RULES

==================================================

The reference screenshot is the visual benchmark.

Maintain:

- dark navy background

- cyan/blue primary accent

- purple secondary accent

- green/yellow/orange/red status system

- rounded cards

- subtle borders

- subtle glow

- professional typography

- dense information hierarchy

- map-centric command-center feeling

Avoid:

- white SaaS dashboard

- excessive gradients

- excessive animations

- excessive glassmorphism

- random statistics

- generic logistics templates

- unnecessary blockchain

- fake claims of production AI accuracy

==================================================

PRIMARY DEMO FLOW

==================================================

The entire app must support this presentation scenario:

1. Vehicle NE-027 carries emergency medical supplies.

2. Route: Guwahati → Imphal.

3. Current risk = 72/100.

4. AI predicts 72% disruption probability.

5. Heavy rainfall alert appears.

6. Field officer reports landslide.

7. Route becomes HIGH RISK/BLOCKED.

8. System recalculates routes.

9. Route B becomes recommended.

10. Route B = 21% disruption probability.

11. Route is +48 km / +1.3 hours.

12. System chooses it because medical cargo prioritizes reliability.

13. Dashboard updates affected vehicles/shipments.

14. Open What-If Simulator.

15. Simulate NH-37 closure.

16. Show affected districts, vehicles, emergency shipments and delay.

17. AI Assistant explains the decision.

The application should feel like:

PALANTIR-STYLE COMMAND CENTER

+

GOOGLE MAPS-STYLE GIS

+

GOVERNMENT INFRASTRUCTURE DASHBOARD

+

AI LOGISTICS DECISION SUPPORT

Brand everything as:

NER SMART LOGISTICS

Final objective:

The evaluator should immediately understand:

"NER Smart Logistics detects disruptions, predicts accessibility risk, recommends resilient routes and gives authorities a real-time operational picture of the North Eastern logistics network."
I have also attached an image for your reference of ui. I want exactly this type of ui design.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://ner-nexus-logistics.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/951945e5-e659-474c-9507-7c24aa16f0a8).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
