export type UserRole = 'Admin' | 'Auditor' | 'Viewer';

export interface AuditFormData {
  rating: string; // could also be number if parsed
  checks: {
    safety: boolean;
    cleanliness: boolean;
    [key: string]: boolean;
  };
  comment: string;
}

export interface AuditEntry extends AuditFormData {
  timestamp: string;
}
