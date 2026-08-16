# 🩸 LifeLine — Real-Time Blood Bank Demand Matching

> **Omni_BioTech_15** | OMNIKON Hackathon | Team **Diva** — Aditi Sharma (Solo)

LifeLine is a real-time matching platform that connects **blood donors**, **blood banks**, and **hospitals** on one shared system — replacing manual phone-tree coordination with a live, queryable graph and a weighted matching algorithm.

---

## 🚨 The Problem

In emergencies, the blood a patient needs is often already available somewhere in the system — with a donor, in a blood bank's stock, or in a nearby hospital's reserve — but it can't be found in time.

Donor availability, hospital demand, and blood-bank inventory currently live in **disconnected systems**: paper registers, phone calls, and WhatsApp groups.

**Who's affected:**
- 🏥 Patients & families needing urgent transfusions (trauma, surgery, thalassemia, high-risk delivery)
- 🩸 Blood banks facing wastage of near-expiry units due to poor visibility
- 🚑 Hospitals resorting to manual phone-tree coordination under time pressure
- 🙋 Donors contacted repeatedly and generically instead of for genuine, nearby needs

**Why existing solutions fall short:**
Platforms like eRaktKosh and Blood Warriors are directory-style — they list donors or banks but don't actively rank or match supply to a specific request in real time, costing critical minutes during emergencies.

---

## 💡 The Solution

LifeLine replaces static directories with a **live, scored/ranked matching engine**:

- **Supply layer** — donor availability + blood-bank inventory
- **Demand layer** — hospital requests tagged with urgency
- **Matching Engine** — ranks eligible donors/stock by compatibility, proximity, urgency, and expiry, surfacing the best match instantly

### What makes it different
- ✅ Hard **ABO/Rh compatibility filter** — unsafe matches are never surfaced
- ✅ **Expiry-aware ranking** — near-expiry stock prioritized to cut wastage
- ✅ **Donor reliability scoring** — reliable donors ranked above repeat no-shows

---

## 🏗️ System Architecture

LifeLine is built around three layers — **Supply, Demand, and a standalone Matching Engine** — sitting on a shared relational database, with role-based dashboards for donors, hospitals, and blood banks.

**Data flow:**
```
Hospital raises a request
        ↓
API validates it
        ↓
Matching Engine scores & ranks eligible donors/inventory
        ↓
Top matches notified
        ↓
Outcome logged to improve future estimates
```

**Core layers:**
| Layer | Role |
|---|---|
| Presentation | Role-based dashboards |
| API / Orchestration | Auth, validation, routing |
| Matching Engine | Core differentiator — standalone scoring service |
| Data Layer | Relational DB |
| Notification Layer | Real-time alerts |

### Scoring Formula
```
Score = 0.35 × Urgency + 0.30 × Proximity + 0.20 × Expiry + 0.15 × Reliability
```
*(applied after a hard ABO/Rh safety filter)*

---

## ✨ Key Features

- **Live weighted matching engine** — ranks eligible donors/stock instantly by compatibility, urgency, proximity & expiry
- **Hard compatibility filter** — ABO/Rh safety check runs before ranking
- **Expiry-aware prioritization** — near-expiry stock ranked higher to cut wastage
- **Donor reliability scoring** — reliable donors prioritized over repeat no-shows
- **First-confirmed-locks** — first acceptance locks the unit; others auto-route to the next best match
- **Auto-escalation** — unmatched requests escalate to the nearest district blood-bank network
- **Role-based dashboards** — simple, separate views for donors, hospitals & banks
- **Real-time notifications** — instant alerts the moment a match is confirmed

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | Next.js (React) + Tailwind CSS | Dashboards for donors, hospitals & blood banks |
| Backend / API | Next.js API routes (Node.js) | Auth, request validation, orchestration |
| Matching Engine | Standalone TypeScript scoring service | Compatibility filter + weighted ranking |
| Database | PostgreSQL (via Supabase) | Relational integrity, built-in auth |
| Notifications | Twilio / Resend | Email & SMS alerts on match confirmation |
| Deployment | Vercel | Single-codebase, fast iteration hosting |

**Why this stack?**
- A single-codebase stack (Next.js + Supabase + Vercel) chosen specifically for fast iteration within a hackathon timeline.
- The matching engine is a self-contained scoring service, decoupled from the UI, so it can be built and tested independently.

---

## 🗓️ Implementation Plan

| Week | Focus | Deliverables |
|---|---|---|
| Week 1 | Foundation | Database schema, authentication, donor/hospital/bank registration flows |
| Week 2 | Core Engine | Matching engine + scoring logic, tested against 10+ manual scenarios |
| Week 3 | Interface | Live dashboards, request/match UI, real-time notifications |
| Week 4 | Validation | Seeded end-to-end testing, deployment, demo video |

**Feasibility note:**
- Scope is intentionally solo-achievable in 4 weeks — the matching engine, the core differentiator, is self-contained and testable independently of the UI.
- Key risks (concurrent claims, low-density areas, unreliable donors) are handled by first-confirmed-locks logic, auto-escalation to district-level networks, and reliability scoring respectively.

---

## 👤 Team

**Team Name:** Diva
**Member:** Aditi Sharma (Solo)
**Theme:** BioTech & HealthTech

---

<p align="center"><b>One mission. Build the impossible.</b></p>

