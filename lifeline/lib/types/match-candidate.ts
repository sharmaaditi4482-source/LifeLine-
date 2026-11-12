export interface MatchCandidate {
  id: string;
  requestId: string;
  candidateType: "donor" | "bank";
  candidateId: string;
  score: number;
  confidence: number;
  reasons: string[];
  safetyFlags: string[];
}
