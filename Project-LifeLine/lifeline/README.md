# 🩸 LifeLine — Real-Time Blood Bank Demand Matching

> **Submission Deadline:** 1 September 2026 · Hackathon Final Round

LifeLine is a real-time matching platform connecting blood donors, blood banks, and hospitals on a single shared system — replacing manual phone-tree coordination with a live, queryable graph and a weighted matching algorithm.

---

## 🚀 Quick Start

```bash
cd lifeline
npm install
npm run dev
```

Visit `http://localhost:3000`

---

## 🏗️ Architecture

LifeLine is built around **three decoupled layers**:

```
┌──────────────────────────────────────────────────────┐
│                   PRESENTATION LAYER                  │
│   Hospital Dashboard · Donor Portal · Bank Inventory  │
└────────────────────┬─────────────────────────────────┘
                     │ Next.js API Routes
┌────────────────────▼─────────────────────────────────┐
│                  ORCHESTRATION LAYER                  │
│       /api/match  ·  /api/donors  ·  /api/banks       │
│       /api/match/confirm  (first-confirmed-lock)      │
└────────────────────┬─────────────────────────────────┘
                     │
┌────────────────────▼─────────────────────────────────┐
│                   MATCHING ENGINE                     │
│   lib/matchingEngine.ts  — standalone scoring service │
│   Decoupled from UI, independently testable           │
└────────────────────┬─────────────────────────────────┘
                     │
┌────────────────────▼─────────────────────────────────┐
│                    DATA LAYER                         │
│   lib/store.ts — In-memory store (swap → Supabase)    │
└──────────────────────────────────────────────────────┘
```

### Data Flow

```
Hospital raises request
   → POST /api/match validates fields
   → Matching Engine applies ABO/Rh hard filter
   → Weighted scoring ranks all safe candidates
   → Enriched results returned with GPS coordinates
   → Hospital confirms top match
   → PATCH /api/match/confirm applies first-confirmed-lock
   → All other candidates auto-released
```

---

## 🔬 Matching Engine

The core differentiator. Located at [`lib/matchingEngine.ts`](./lib/matchingEngine.ts).

### Stage 1 — Hard Safety Filter (never bypassed)

```
ABO/Rh compatibility check → incompatible donors/stock never surfaced
```

### Stage 2 — Weighted Scoring Formula

```
Score = 0.35 × Urgency + 0.30 × Proximity + 0.20 × Expiry + 0.15 × Reliability
```

| Factor | Weight | Rationale |
|--------|--------|-----------|
| Urgency | 35% | Critical cases take highest priority |
| Proximity | 30% | Haversine distance; closer = faster delivery |
| Expiry | 20% | Near-expiry stock ranked higher to reduce wastage |
| Reliability | 15% | Historical donor show-up rate prevents no-shows |

### Key Behaviours

- **First-confirmed-locks** — first acceptance locks the unit; others auto-route to next best match
- **Auto-escalation** — zero matches triggers district-level network alert (`escalated: true`)
- **Expiry-aware** — stock ≤10 days from expiry gets priority surfacing
- **Donor reliability** — 0–1 score built from historical attendance rates

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Next.js 16 (React) + Tailwind CSS | Role-based dashboards |
| Backend / API | Next.js API Routes (Node.js) | Auth, request validation, orchestration |
| Matching Engine | Standalone TypeScript scoring service | Compatibility filter + weighted ranking |
| Maps | Leaflet + React-Leaflet | GPS match visualisation |
| Database | In-memory store → swap to Supabase | Relational integrity |
| Deployment | Vercel | Single-codebase, fast iteration |

---

## 📂 Project Structure

```
lifeline/
├── app/
│   ├── page.tsx              # Landing page / marketing
│   ├── hospital/page.tsx     # Hospital dashboard (raise request, confirm match)
│   ├── donor/page.tsx        # Donor registry + registration modal
│   ├── bank/page.tsx         # Blood bank inventory + expiry monitoring
│   ├── login/page.tsx        # Role-selector + OTP auth simulation
│   └── api/
│       ├── match/
│       │   ├── route.ts          # POST — run matching engine
│       │   └── confirm/route.ts  # PATCH — first-confirmed-lock
│       ├── donors/route.ts       # GET list + POST register
│       └── banks/route.ts        # GET inventory
├── components/
│   ├── MatchMap.tsx          # Leaflet map with hospital + match markers
│   ├── HeroNetworkVisual.tsx # Animated SVG network graph
│   ├── LiveFeed.tsx          # Real-time activity ticker
│   ├── SafetyMatrix.tsx      # ABO/Rh compatibility matrix
│   └── BloodAnimation.tsx    # Blood drop animation
└── lib/
    ├── matchingEngine.ts     # Core scoring service
    ├── store.ts              # In-memory data store with seed data
    └── types.ts              # TypeScript type definitions
```

---

## 🧪 Demo Flow (End-to-End)

1. **Home** → Explore the live matching ticker and network visual
2. **Login** → Select role (Hospital / Donor / Blood Bank) → OTP simulation
3. **Hospital Dashboard** → Submit blood request → Watch ranked matches appear with scores
4. **Confirm** → Click Confirm on top match → server-side first-confirmed-lock activates
5. **Donor Portal** → Browse available donors → Register as new donor
6. **Bank Inventory** → Monitor near-expiry stock → See engine-priority tags

---

## 🔄 Swapping to Supabase (Production Path)

Replace `lib/store.ts` with Supabase client calls — the `matchingEngine.ts` is completely decoupled and requires no changes. See `README-DEPLOY.md` for full deployment guide.

---

## 👥 Team

Blood LifeLine — Hackathon Final Round Submission, September 2026

