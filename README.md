# Party Russian Roulette

Et digitalt drikke- og festspill bygget med React, TypeScript og Vite. Spillet simulerer russisk rulett, slik at en gruppe spillere på 2–10 personer kan ta turer på en delt telefon eller skjerm.

## Spillmoduser

- **Classic** — Fast antall kuler i kammeret. Den som får treff, taper runden.
- **Escalating** — Antall kuler øker for hvert "safe" og nullstilles ved treff.
- **Knockout** — Spillere elimineres ved treff til kun én står igjen.
- **Punishment** — Hvert treff trekker et tilfeldig straffekort fra kortstokken.

## Funksjoner

- 2–10 spillere med egne navn og farger
- Lyd og haptisk respons (kan slås av/på, lagres i `localStorage`)
- Wake lock holder skjermen våken under spill
- Konfetti og animasjoner ved utfall
- Statistikk per spiller (treff og overlevelser)
- Fungerer på mobil og desktop

## Kom i gang

Krever Node.js 18+.

```bash
npm install
npm run dev
```

Åpne deretter `http://localhost:5173` i nettleseren.

## Scripts

- `npm run dev` — Start utviklingsserver med hot reload
- `npm run build` — Type-sjekk og bygg produksjonsversjon til `dist/`
- `npm run preview` — Forhåndsvis produksjonsbygget lokalt

## Prosjektstruktur

```
src/
  App.tsx              # Router basert på skjermtilstand
  main.tsx             # Entry point
  types.ts             # Felles TypeScript-typer
  context/             # GameContext (useReducer-basert tilstand)
  screens/             # Start, Setup, Game, GameOver
  components/          # ChamberDisplay, Confetti
  hooks/               # useWakeLock
  lib/                 # audio og haptic-hjelpere
  data/                # punishments (straffekort)
```

All spillogikk ligger i `src/context/GameContext.tsx` som en `useReducer`. Trekk på avtrekkeren regnes ut som `Math.random() < bullets / chambers`.

## Teknologi

- React 18
- TypeScript 5
- Vite 5

## Lisens

Privat prosjekt. Ingen lisens spesifisert.
