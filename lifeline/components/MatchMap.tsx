"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MatchResult } from "@/lib/types";

/* ── Custom SVG markers (clean vector dots) ── */

function createMarkerIcon(color: string, filled: boolean, size = 14): L.DivIcon {
  const svg = filled
    ? `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 1}" fill="${color}" stroke="${color}" stroke-width="1.5"/>
      </svg>`
    : `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 2}" fill="white" stroke="${color}" stroke-width="2"/>
      </svg>`;

  return L.divIcon({
    html: svg,
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}

const hospitalIcon = createMarkerIcon("#1C1917", true, 16);
const bestMatchIcon = createMarkerIcon("#A8201A", true, 14);
const otherMatchIcon = createMarkerIcon("#A8201A", false, 14);

/* ── Types ── */

interface MatchWithLocation extends MatchResult {
  location?: { lat: number; lng: number; label: string };
}

interface MatchMapProps {
  hospitalLocation: { lat: number; lng: number; label: string };
  matches: MatchWithLocation[];
}

export default function MatchMap({ hospitalLocation, matches }: MatchMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Clean up existing map instance if already initialized to prevent 'Map container is already initialized' error
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: [hospitalLocation.lat, hospitalLocation.lng],
      zoom: 11,
      scrollWheelZoom: false,
    });
    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // Hospital Marker
    L.marker([hospitalLocation.lat, hospitalLocation.lng], { icon: hospitalIcon })
      .addTo(map)
      .bindPopup(
        `<div style="font-family:sans-serif;font-size:12px;">
          <strong style="color:#1C1917;">Hospital</strong><br/>
          <span style="color:#78716C;font-family:monospace;font-size:11px;">${hospitalLocation.label}</span>
        </div>`
      );

    // Match Markers
    const allPoints: [number, number][] = [
      [hospitalLocation.lat, hospitalLocation.lng],
    ];

    matches.forEach((m, i) => {
      if (m.location) {
        allPoints.push([m.location.lat, m.location.lng]);
        const scorePercent = Math.round(m.score * 100);
        L.marker([m.location.lat, m.location.lng], {
          icon: i === 0 ? bestMatchIcon : otherMatchIcon,
        })
          .addTo(map)
          .bindPopup(
            `<div style="font-family:sans-serif;font-size:12px;">
              <strong style="color:#1C1917;">${m.sourceName}</strong>
              <span style="color:#A8201A;font-size:10px;font-weight:600;margin-left:4px;">${i === 0 ? "★ BEST" : ""}</span><br/>
              <span style="color:#78716C;font-family:monospace;font-size:11px;">
                ${m.bloodGroup} · ${m.distanceKm} km · score <strong>${scorePercent}/100</strong>
              </span>
            </div>`
          );
      }
    });

    // Auto-fit all coordinates in viewport
    if (allPoints.length > 1) {
      const bounds = L.latLngBounds(allPoints.map(([lat, lng]) => L.latLng(lat, lng)));
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [hospitalLocation, matches]);

  return (
    <div
      ref={mapContainerRef}
      className="w-full overflow-hidden rounded-2xl border border-ink-10 relative z-0"
      style={{ height: "300px" }}
    />
  );
}
