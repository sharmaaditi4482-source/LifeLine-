export interface AuditLog {
  id: string;
  actor: string;
  action: string;
  timestamp: string;
  resourceType: string;
  resourceId: string;
  note: string;
}
