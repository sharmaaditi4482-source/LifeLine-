"use client";

import { useState } from "react";
import { BloodGroup } from "@/lib/types";

const COMPATIBILITY_MAP: Record<BloodGroup, BloodGroup[]> = {
  "O-": ["O-"],
  "O+": ["O-", "O+"],
  "A-": ["O-", "A-"],
  "A+": ["O-", "O+", "A-", "A+"],
  "B-": ["O-", "B-"],
  "B+": ["O-", "O+", "B-", "B+"],
  "AB-": ["O-", "A-", "B-", "AB-"],
  "AB+": ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
};

const GROUPS: BloodGroup[] = ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"];

export default function SafetyMatrix() {
  const [hoveredRecipient, setHoveredRecipient] = useState<BloodGroup | null>(null);
  const [hoveredDonor, setHoveredDonor] = useState<BloodGroup | null>(null);

  return (
    <div className="w-full card border-ink-10 bg-white p-5 md:p-6 shadow-sm overflow-hidden select-none">
      <div className="mb-4">
        <h4 className="font-display text-sm font-semibold text-ink">
          ABO/Rh Compatibility Engine
        </h4>
        <p className="mt-1 text-xs text-ink-60 leading-relaxed">
          Hover over groups to inspect safe transfusion pathways. Unsafe matches are automatically blocked at the circuit layer.
        </p>
      </div>

      {/* Grid Matrix */}
      <div className="overflow-x-auto">
        <div className="min-w-[400px]">
          {/* Header Row: Donor Group */}
          <div className="grid grid-cols-[60px_repeat(8,1fr)] items-center border-b border-ink-10 pb-2 text-center">
            <div className="text-left font-mono text-[9px] uppercase tracking-wider text-ink-40">Recipient</div>
            {GROUPS.map((g) => (
              <div 
                key={g} 
                className={`font-mono text-[10px] font-semibold transition-colors ${
                  hoveredDonor === g ? "text-blood" : "text-ink-60"
                }`}
              >
                {g}
              </div>
            ))}
          </div>

          {/* Matrix Rows */}
          <div className="space-y-1.5 pt-2">
            {GROUPS.map((recipient) => {
              const compatibleDonors = COMPATIBILITY_MAP[recipient];

              return (
                <div
                  key={recipient}
                  className={`grid grid-cols-[60px_repeat(8,1fr)] items-center py-1.5 rounded-lg text-center transition-all ${
                    hoveredRecipient === recipient 
                      ? "bg-blood-50" 
                      : "hover:bg-ink-5"
                  }`}
                  onMouseEnter={() => setHoveredRecipient(recipient)}
                  onMouseLeave={() => setHoveredRecipient(null)}
                >
                  {/* Left row header: Recipient */}
                  <div className="text-left font-mono text-[10px] font-bold text-ink pl-1">
                    {recipient}
                  </div>

                  {/* Donor Columns cells */}
                  {GROUPS.map((donor) => {
                    const isCompatible = compatibleDonors.includes(donor);
                    const isHovered = hoveredRecipient === recipient || hoveredDonor === donor;

                    return (
                      <div
                        key={donor}
                        className="flex items-center justify-center h-5 transition-all"
                        onMouseEnter={() => setHoveredDonor(donor)}
                        onMouseLeave={() => setHoveredDonor(null)}
                      >
                        {isCompatible ? (
                          <div 
                            className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold transition-all ${
                              isHovered 
                                ? "bg-blood text-white scale-110" 
                                : "bg-blood-10 text-blood"
                            }`}
                          >
                            ✓
                          </div>
                        ) : (
                          <div className="w-1.5 h-1.5 rounded-full bg-ink-10 opacity-30" />
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Indicators */}
      <div className="mt-5 border-t border-ink-10 pt-4 flex flex-wrap gap-4 justify-between items-center text-[10px] font-mono text-ink-40">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-blood-10 text-blood flex items-center justify-center text-[7px] font-bold">✓</div>
          <span>Safe Transfusion Match</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-ink-10 opacity-30" />
          <span>Incompatible / Safe Blocked</span>
        </div>
      </div>
    </div>
  );
}
