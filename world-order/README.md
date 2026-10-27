# WORLD ORDER 🌐

A text-driven geopolitical strategy simulation spanning 1930–2026. Choose a country, read a strategic briefing, make decisions, and watch national indicators evolve.

## Current prototype

- Country selection: United States, Soviet Union, China, United Kingdom
- Starting scenarios: 1939, 1945, 1991, 2020
- National profile dashboard: population estimate, economic development, happiness, political stability, government type, economic structure, military, diplomacy, technology
- Decision outcomes that update national indices
- Campaign journal and browser local-storage save/load
- Contextual strategic assessment about bargaining and conflict
- Responsive desktop/mobile layout

## Run locally

Requirements: Node.js 20+ recommended.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Build for production

```bash
npm run build
npm run preview
```

## Important data note

This is an early playable prototype. Some population estimates, country indicators, and scenario descriptions are illustrative. Before treating the game as a historical simulator, replace these with year-specific sourced data and validate government types and economic descriptions against historical references. The current scenarios are handcrafted examples rather than a complete world-event engine.

## Planned next steps

1. Add historically grounded country profiles for more start years.
2. Build the annual simulation engine and AI country reactions.
3. Add a crisis state machine with negotiation, deterrence, preventive-war, and preemptive-war options.
4. Add treaties, alliances, rival relationships, and commitment mechanisms.
5. Add automated tests and deployment.
