# Mortgage Freedom Planner

A Next.js rebuild of the Mortgage Freedom AI app — mortgage overpayment calculator, wealth
dashboard, and property wealth roadmap. Runs entirely client-side: no server, no API keys, no
external services required for any feature.

## Local development

```
npm install
npm run dev
```

Visit http://localhost:3000

## What changed from the previous version

- Rebuilt in **Next.js 14 (App Router) + TypeScript + Tailwind**, replacing the single hand-rolled HTML file
- **Real interactive charts** (Recharts) instead of hand-drawn SVG paths
- All previous calculation features carried over exactly: Setup, Calculator, Wealth Dashboard
  (editable goals + suggestions), Compare, Property Wealth Builder, Equity Release Simulator,
  Rental Calculator, Education Hub, Notifications, Export Report, multi-currency support
- Still a PWA — installable, works offline via `public/sw.js`
- The AI Coach chat feature has been removed for this release (it required a paid Anthropic API
  key and a server to hold it safely). It may return in a future update — see below.

## Deploying to mortgagefree.risten.co.uk

1. Push this project to a new GitHub repo under the RistenGlobal organisation (matching how
   Wealth Builder Pro was set up)
2. Import the repo into Vercel — no environment variables needed
3. Deploy
4. In Vercel → Project → Settings → Domains, add `mortgagefree.risten.co.uk`
5. Vercel will give you a CNAME record — add it in your DNS provider for risten.co.uk
   (same process as `wealthbuilder.risten.co.uk`)
6. HTTPS is automatic once DNS resolves

## Publishing to Google Play

Once live on `mortgagefree.risten.co.uk`, the path is the same as before:
[PWABuilder.com](https://www.pwabuilder.com) or Bubblewrap → signed `.aab` → Google Play Console,
including the Digital Asset Links file (`/.well-known/assetlinks.json`) to link the domain to the
Android package. Add that file under `public/.well-known/assetlinks.json` in this project once you
have your package name and signing certificate fingerprint.

## A note on `npm audit`

`npm audit` will show a long list of advisories against `next`. These are mostly broad version
ranges bundled by the advisory database, not all applicable to this exact version. This project
pins **Next.js 14.2.35**, which is the version explicitly confirmed as the patched release for the
14.x line in Next.js's own security bulletins (Dec 2025 – Jan 2026, covering the React Server
Components RCE and related issues). Jumping to Next 16 would fix the audit noise entirely but is a
breaking major-version change — worth doing deliberately later rather than as a silent side effect
of this rebuild.

## Adding the AI Coach back later

The feature was removed cleanly rather than patched over, so re-adding it means building it fresh
when you're ready — it needs: a chat screen, an API route (or server) that holds an Anthropic API
key server-side, and a tab added back to `components/AppShell.tsx`. Worth doing as its own small
project rather than half-wiring it in.

## Project structure

```
app/
  layout.tsx          Root layout, PWA metadata
  page.tsx             Renders AppShell
  globals.css
components/
  AppShell.tsx          Header, tab routing, bottom nav
  screens/              One component per screen
  ui/                   Card, fields, icons, shared primitives
lib/
  finance.ts             Mortgage math + currency formatting
  goalSuggestions.ts      Wealth-building suggestion engine
  useAppState.ts          State + localStorage persistence
  types.ts
public/
  manifest.json, icon-*.png, sw.js
```
