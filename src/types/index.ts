export type UserRole = 'STUDENT' | 'WARDEN' | 'TECHNICIAN';

export type PresetCategory =
  | 'Lights & Electrical'
  | 'Plumbing & Taps'
  | 'Fan & AC'
  | 'Internet & Wi-Fi'
  | 'Furniture & Doors'
  | 'Other';

export type Priority = 'Low' | 'Medium' | 'High' | 'Urgent';

export type TicketStatus = 'Submitted' | 'Assigned' | 'In Progress' | 'Resolved';

export type HostelBlock = 'Block A' | 'Block B' | 'Block C' | 'Block D';

export interface TimelineEntry {
  at: string;
  actor: string;
  note: string;
}

export interface MaintenanceTicket {
  id: string;
  title: string;
  description: string;
  category: string;
  block: HostelBlock;
  room: string;
  priority: Priority;
  status: TicketStatus;
  reportedBy: string;
  reporterEmail: string;
  studentId: string;
  phone: string;
  preferredTime: string;
  assignedTo: string | null;
  upvotes: number;
  photoDataUrl?: string;
  rating?: number;
  feedback?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  timeline: TimelineEntry[];
}

export interface Technician {
  id: string;
  name: string;
  specialty: string;
}
