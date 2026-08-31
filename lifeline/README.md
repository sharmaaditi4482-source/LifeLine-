# 🩸 LifeLine — Real-Time Emergency Blood Demand Matching & Bio-Logistics Platform

<div align="center">

[![Deployment Status](https://img.shields.io/badge/Deployment-Live%20on%20Vercel-success?style=for-the-badge&logo=vercel&logoColor=white)](https://lifeline-aditi.vercel.app)
[![Tests Passing](https://img.shields.io/badge/Test%20Suite-39%2F39%20Passed%20(100%25)-brightgreen?style=for-the-badge&logo=vitest&logoColor=white)](https://lifeline-aditi.vercel.app)
[![Next.js 16](https://img.shields.io/badge/Next.js-16%20App%20Router-black?style=for-the-badge&logo=next.js&logoColor=white)](https://lifeline-aditi.vercel.app)
[![Supabase](https://img.shields.io/badge/Database-Supabase%20PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![TypeScript Strict](https://img.shields.io/badge/TypeScript-Strict%20Mode-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)

### 🌐 **Live Production Link:** [https://lifeline-aditi.vercel.app](https://lifeline-aditi.vercel.app)

*Replacing 45-minute critical phone trees with sub-second verified matches during medical emergencies.*

</div>

---

## ⚡ Quick Evaluation Guide for Judges (1-Click Credentials)

Evaluators can test all role-gated portals with pre-provisioned demo accounts or the built-in **1-Click Demo Login** buttons:

| Portal | Live Route | Demo Email | Demo Password | Key Features to Test |
|---|---|---|---|---|
| 🚨 **Emergency SOS (Zero-Auth)** | [`/emergency`](https://lifeline-aditi.vercel.app/emergency) | *No Login Required* | *Instant SOS* | **🎙️ Hands-Free Voice Dispatcher**, 1-Click Voice Prompts, **Live GPS Auto-Detect**, 50km radius match, live route map |
| 🏥 **Hospital Command Desk** | [`/hospital`](https://lifeline-aditi.vercel.app/hospital) | `trauma.desk@aiims.edu` | `emergency2026` | **Live GPS Auto-Detect**, Real-time stock audit, 48h shortage forecasting, donor dispatch |
| 🩸 **Donor Volunteer Portal** | [`/donor`](https://lifeline-aditi.vercel.app/donor) | `rahul.verma@lifeline.org` | `donorhero2026` | **Live GPS Auto-Detect & Distance Sorting**, 90-day cooldown countdown, lives saved tiers, availability toggle |
| 🏦 **Blood Bank Reserve Hub** | [`/bank`](https://lifeline-aditi.vercel.app/bank) | `inventory@redcross.org` | `bloodbank2026` | **Live GPS Auto-Pinning**, 1-click stock update modal, near-expiry monitor, hospital search |
| 📊 **Regional Analytics** | [`/analytics`](https://lifeline-aditi.vercel.app/analytics) | *Public Telemetry* | — | 7-day demand volume, ABO supply vs demand charts, live event bus |

---

## 🚨 The Problem & Real-World Impact

In emergency healthcare (trauma surgeries, post-partum hemorrhages, thalassemia crises), **every two seconds someone in India requires a blood transfusion**. 

While compatible blood often exists in a facility or volunteer within 5–10 km:
1. **Information Silos:** Hospital staff spend **45+ precious minutes** manually calling blood banks and donor groups.
2. **Biological Mismatch Risk:** Transfusing incompatible blood types triggers fatal acute hemolytic reactions.
3. **Medical Safety Violations:** Anemic or ineligible donors are contacted before their mandatory 90-day biological recovery period.
4. **Near-Expiry Wastage:** 35-day shelf-life blood units are discarded while nearby patients face stockouts.
5. **Concurrency Race Conditions:** Multiple emergency rooms simultaneously book the exact same blood bank unit.

---

## 💡 Solution & Technical Architecture

LifeLine resolves these bottlenecks with a deterministic **4-Vector Multi-Factor Scoring Engine**, a **Zero-Auth SOS Gateway**, and an **Atomic 409 Conflict Reservation Lock**.

```
                           ┌──────────────────────────────┐
                           │   Zero-Auth Emergency SOS    │
                           │     (/emergency gateway)     │
                           └──────────────┬───────────────┘
                                          │
                                          ▼
                      ┌───────────────────────────────────────┐
                      │    Next.js 16 API Matching Gateway    │
                      │           (POST /api/match)           │
                      └───────┬───────────────────────┬───────┘
                              │                       │
           ┌──────────────────┴──────────┐   ┌────────┴──────────────────┐
           ▼                             ▼   ▼                           ▼
  [ Hard ABO/Rh Gate ]           [ 90-Day Cooldown ]            [ Haversine Proximity ]
  Zero-tolerance biological       Enforces medical safety        Calculates great-circle
  matrix filter (64 combos)       interval (90-day cutoff)       distance (50 km radius)
           │                             │                               │
           └──────────────────┬──────────┴───────────────────────────────┘
                              │
                              ▼
           ┌───────────────────────────────────────┐
           │ 4-Vector Multi-Factor Scoring Formula │
           │   Score = 0.35U + 0.30P + 0.20E + 0.15R   │
           └──────────────────┬────────────────────┘
                              │
                              ▼
           ┌───────────────────────────────────────┐
           │  Atomic Lock Protocol (HTTP 409 Gate) │
           │   First confirmed match wins; safely  │
           │  prevents duplicate blood unit claims │
           └───────────────────────────────────────┘
```

---

## 🧠 Core Algorithm & Mathematical Scoring Model

The matching pipeline evaluates candidate units and volunteer donors using the weighted objective function:

$$\text{Final Score} = 0.35 \times U + 0.30 \times P + 0.20 \times E + 0.15 \times R$$

### Multi-Factor Weights Breakdown:
- **Urgency Vector ($U$, 35%):**
  $$\text{Critical} = 1.00 \quad\vert\quad \text{High} = 0.75 \quad\vert\quad \text{Medium} = 0.45$$
- **Proximity Vector ($P$, 30%):** Great-circle distance calculated via the **Haversine Formula** and normalized against a 50 km clinical radius:
  $$d = 2R \arcsin\left(\sqrt{\sin^2\left(\frac{\Delta\text{lat}}{2}\right) + \cos(\text{lat}_1)\cos(\text{lat}_2)\sin^2\left(\frac{\Delta\text{lon}}{2}\right)}\right)$$
  $$P = \max\left(0, 1 - \frac{\min(d, 50)}{50}\right)$$
- **Expiry Prevention ($E$, 20%):** Prioritizes blood bank reserves approaching their 35-day expiration limit to systematically eliminate bio-waste ($E \in [0.10, 1.00]$). Volunteer donors receive a neutral baseline ($E = 0.50$).
- **Reliability Index ($R$, 15%):** Historical turnout reliability ($0.0 - 1.0$). Certified hospital reserves receive $1.0$; verified volunteer donors receive a $+0.05$ trust boost.

---

## 🛡️ Biological Safety & Concurrency Control

### 1. Hard ABO/Rh Biological Matrix (64 Compatibility Rules)
Every match passes through an immutable biological safety matrix prior to scoring. Incompatible combinations (e.g., $B^-$ recipient with $A^+$ donor) are rejected with zero score. Universal donor $O^-$ and universal recipient $AB^+$ rules are strictly respected.

### 2. Mandatory 90-Day Medical Cooldown Verification
Donors with $\text{daysSinceDonation} < 90$ are flagged as medically ineligible. The platform displays real-time countdown badges (`Ineligible — X days remaining`) to protect donor hemoglobin recovery.

### 3. Atomic First-Confirmed-Lock Protocol (HTTP 409 Conflict Prevention)
When two hospitals attempt to reserve the same blood unit simultaneously:
- **Request 1:** Accepted $\rightarrow$ `HTTP 200 OK` (Status set to `confirmed`).
- **Request 2:** Rejected $\rightarrow$ `HTTP 409 Conflict` (Unit unavailable; candidate pool dynamically refreshed).

---

## 🧪 39/39 Automated Test Verification Suite

The repository includes an automated test harness covering biological compatibility, scoring math, and safety boundaries:

```bash
npx tsx scripts/verify.ts
```

| Test Category | Test Assertions | Expected | Result |
|---|---|---|:---:|
| **1. ABO/Rh Compatibility** | 9 test vectors ($O^-$ universal donor, $AB^+$ recipient, $A \leftrightarrow B$ clash) | 100% Matrix Match | ✅ PASS (9/9) |
| **2. Medical Cooldown** | 30d, 89d, 90d boundary condition & mathematical remaining days | Exact day precision | ✅ PASS (5/5) |
| **3. Donor Availability** | Active flag filtering, mixed-pool isolation | Zero inactive leakage | ✅ PASS (3/3) |
| **4. Low-Stock Thresholds** | Boundary checks at 0, 3, 4, 5, 10 units for `<5` critical triggers | Correct boolean flag | ✅ PASS (5/5) |
| **5. 4-Vector Scoring Math** | Same-location critical request ($0.885$), 13.1 km high-urgency request ($0.689$) | $\pm 0.001$ tolerance | ✅ PASS (2/2) |
| **6. Live Event Telemetry** | Polling intervals and event bus throughput ($\le 3000\text{ms}$) | Within timing budget | ✅ PASS (1/1) |
| **7. Donor Milestone Tiers** | Bronze (1 donation), Silver (4 donations), Gold (6 donations) | Tier & life calculation | ✅ PASS (3/3) |
| **8. Shortage Risk AI** | 1 unit (CRITICAL $<48\text{h}$), 4 units (MODERATE), 8 units (STABLE) | Correct category | ✅ PASS (3/3) |
| **9. Trust & Verification** | Completed donation increment, Verified Donor $+0.05$ reliability boost | Exact calculation | ✅ PASS (2/2) |
| **10. 7-Day Velocity Burn** | 7-day burn rate calculation & projected stockout horizon | Verified velocity math | ✅ PASS (6/6) |

**Overall Verification: 39 / 39 Tests Passing (100% Coverage)**

---

## ✨ Standout Platform Features

- **🚨 Zero-Auth SOS Gateway (`/emergency`):** One-tap emergency dispatch with automatic HTML5 Geolocation capture, interactive Leaflet route visualization, and estimated ambulance transit times.
- **🎙️ Hands-Free Voice Emergency Dispatcher (`/emergency`):** Built-in client-side Web Speech Recognition API (`en-IN` & Hindi accent aware) with an intelligent Natural Language Entity Extractor that parses spoken blood types (`"O positive"`, `"A-"`), unit quantities, and regional locations (`"Punjab"`, `"AIIMS"`, `"Delhi"`) into real-time geocoded coordinates, complete with 1-click fail-safe voice prompt simulation chips and instant dispatch fast-tracking.
- **🇮🇳 Bilingual Accessibility Toggle (हिंदी / English):** Complete multi-lingual support on all portals, enabling rapid adoption across diverse regional healthcare teams.
- **🎮 Interactive Algorithm Simulator:** Embedded sandbox allowing evaluators to tune Urgency, Distance, and Expiry sliders to inspect real-time mathematical score recalculations.
- **📋 Built-in Judge Evaluation Drawer:** Pre-configured 4-scenario testing tool (Mass Casualty, Rare Blood Type, Zero-Stock Outage, Verified Donor Boost) for instant end-to-end verification.
- **📊 Regional Bio-Analytics (`/analytics`):** Real-time Recharts visualizer tracking 7-day request burn rates, supply vs. demand gaps by blood group, and live event telemetry.
- **🔒 Role-Based Security:** Strict Supabase JWT authentication guarding hospital stock modifications and donor medical profiles.

---

## 🛠️ Tech Stack & Dependencies

- **Frontend & Framework:** Next.js 16 (App Router, Turbopack), React 19, TypeScript (Strict Mode)
- **Voice & NLP Engine:** Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`), Client-Side Natural Language Entity Extractor
- **Styling & UI:** Tailwind CSS, Custom Medical Glassmorphic Theme, Lucide Icons
- **Database & Auth:** Supabase (PostgreSQL), Role-Based JWT Policies
- **Mapping & Geolocation:** Leaflet, OpenStreetMap, HTML5 Geolocation API
- **Data Visualization:** Recharts
- **Testing & Verification:** tsx, Custom Deterministic Test Harness (39 Test Suites)
- **Hosting & CI/CD:** Vercel Global Edge Network

---

## 💻 Quick Local Development

```bash
# 1. Clone the repository
git clone https://github.com/sharmaaditi4482-source/LifeLine-.git
cd LifeLine-/lifeline

# 2. Install dependencies
npm install

# 3. Run the automated 39-test verification harness
npx tsx scripts/verify.ts

# 4. Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application locally.

---

<div align="center">

**LifeLine — Saving Lives in Seconds.**  
Built for Round 3 Prototype Evaluation.

</div>
