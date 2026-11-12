import { findBestMatches } from "@/lib/services/match.service";
import { submitEmergencyRequest } from "@/lib/services/emergency-request.service";
import type { Donor } from "@/lib/types/donor";
import type { EmergencyRequest } from "@/lib/types/emergency-request";

export async function processEmergencyCase(
  emergencyInput: Partial<EmergencyRequest>,
  donors: Donor[]
) {
  const request = await submitEmergencyRequest(emergencyInput);
  const matches = await findBestMatches(request, donors);

  return {
    request,
    workflow: [
      "triage",
      "eligibility-check",
      "match-ranking",
      "safety-review",
      "dispatch-plan",
    ],
    matches: matches.slice(0, 5),
  };
}
