import { BloodGroup, LiveEvent } from "../types";

// In-memory ring buffer for live system events
const MAX_EVENTS = 25;

const INITIAL_EVENTS: LiveEvent[] = [
  {
    id: "evt_init_1",
    type: "match_confirmed",
    title: "O- Donor Match Confirmed",
    description: "Emergency unit locked and dispatched to AIIMS Trauma Centre",
    bloodGroup: "O-",
    locationLabel: "Safdarjung Enclave, Delhi",
    timestamp: new Date(Date.now() - 25 * 1000).toISOString(),
  },
  {
    id: "evt_init_2",
    type: "stock_updated",
    title: "A+ Bank Reserve Replenished",
    description: "8 units added at Red Cross Central Blood Bank",
    bloodGroup: "A+",
    locationLabel: "Connaught Place, Delhi",
    timestamp: new Date(Date.now() - 75 * 1000).toISOString(),
  },
  {
    id: "evt_init_3",
    type: "request_created",
    title: "Critical B+ Request Raised",
    description: "Max Super Speciality Hospital raised 3-unit emergency request",
    bloodGroup: "B+",
    locationLabel: "Saket, Delhi",
    timestamp: new Date(Date.now() - 150 * 1000).toISOString(),
  },
  {
    id: "evt_init_4",
    type: "match_found",
    title: "Universal Match Surfaced",
    description: "O- volunteer donor matched within 2.1 km radius",
    bloodGroup: "O-",
    locationLabel: "Rohini, Delhi",
    timestamp: new Date(Date.now() - 240 * 1000).toISOString(),
  },
  {
    id: "evt_init_5",
    type: "donor_registered",
    title: "New Volunteer Donor Joined",
    description: "Verified AB+ donor joined active regional network",
    bloodGroup: "AB+",
    locationLabel: "Gurugram Sector 29",
    timestamp: new Date(Date.now() - 360 * 1000).toISOString(),
  },
];

let liveEvents: LiveEvent[] = [...INITIAL_EVENTS];

/**
 * Record a new system matching/inventory event.
 */
export function recordLiveEvent(event: Omit<LiveEvent, "id" | "timestamp">): LiveEvent {
  const newEvent: LiveEvent = {
    ...event,
    id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
  };

  liveEvents.unshift(newEvent);

  if (liveEvents.length > MAX_EVENTS) {
    liveEvents = liveEvents.slice(0, MAX_EVENTS);
  }

  return newEvent;
}

/**
 * Retrieve recent events for real-time live feed.
 */
export function getRecentLiveEvents(limit: number = 10): LiveEvent[] {
  return liveEvents.slice(0, limit);
}
