import {
  HostelBlock,
  IssueCategory,
  MaintenanceTicket,
  Priority,
  Technician,
  TicketStatus,
} from '../types';

const STORAGE_KEY = 'campuscare_tickets_v1';

export const BLOCKS: HostelBlock[] = ['Block A', 'Block B', 'Block C', 'Block D'];

export const CATEGORIES: IssueCategory[] = [
  'Lights & Electrical',
  'Plumbing & Taps',
  'Fan & AC',
  'Internet & Wi-Fi',
  'Furniture & Doors',
  'Other',
];

export const PRIORITIES: Priority[] = ['Low', 'Medium', 'High', 'Urgent'];

export const STATUS_ORDER: TicketStatus[] = ['Submitted', 'Assigned', 'In Progress', 'Resolved'];

export const TECHNICIANS: Technician[] = [
  { id: 'tech-1', name: 'Encik Hafiz', specialty: 'Lights & Electrical' },
  { id: 'tech-2', name: 'Encik Kamal', specialty: 'Plumbing & Taps' },
  { id: 'tech-3', name: 'Encik Faizal', specialty: 'Fan & AC' },
  { id: 'tech-4', name: 'Siti Nur', specialty: 'Internet & Wi-Fi' },
  { id: 'tech-5', name: 'Encik Razak', specialty: 'Furniture & Doors' },
];

export function createInitialTickets(): MaintenanceTicket[] {
  return [
    {
      id: 'CC-104',
      title: 'Ceiling light flickering non-stop in study area',
      description: 'The fluorescent tube above the left study desk flickers and buzzes loudly at night.',
      category: 'Lights & Electrical',
      block: 'Block A',
      room: 'A-204',
      priority: 'High',
      status: 'In Progress',
      reportedBy: 'Muhammad Bukar',
      studentId: 'STU-2026-014',
      assignedTo: 'Encik Hafiz',
      upvotes: 2,
      createdAt: '2026-11-24T08:15:00Z',
      updatedAt: '2026-11-24T11:30:00Z',
      timeline: [
        { at: '2026-11-24T08:15:00Z', actor: 'Muhammad Bukar', note: 'Issue reported for Room A-204.' },
        { at: '2026-11-24T09:05:00Z', actor: 'Hostel Warden', note: 'Assigned to Encik Hafiz (Electrical).' },
        { at: '2026-11-24T11:30:00Z', actor: 'Encik Hafiz', note: 'Checked starter and ordered replacement 18W LED tube.' },
      ],
    },
    {
      id: 'CC-103',
      title: 'Bathroom sink tap leaking even when tightly closed',
      description: 'Water drips continuously from the cold-water tap in the shared shower room.',
      category: 'Plumbing & Taps',
      block: 'Block B',
      room: 'B-108',
      priority: 'Urgent',
      status: 'Assigned',
      reportedBy: 'Aiman Hakim',
      studentId: 'STU-2026-089',
      assignedTo: 'Encik Kamal',
      upvotes: 5,
      createdAt: '2026-11-24T13:20:00Z',
      updatedAt: '2026-11-24T14:00:00Z',
      timeline: [
        { at: '2026-11-24T13:20:00Z', actor: 'Aiman Hakim', note: 'Issue reported for Room B-108.' },
        { at: '2026-11-24T14:00:00Z', actor: 'Hostel Warden', note: 'Marked Urgent and assigned to Encik Kamal.' },
      ],
    },
    {
      id: 'CC-102',
      title: 'Wi-Fi keeps disconnecting on Level 3 corridor',
      description: 'Students in rooms C-301 to C-310 lose Wi-Fi signal every 10 minutes during evening classes.',
      category: 'Internet & Wi-Fi',
      block: 'Block C',
      room: 'C-305',
      priority: 'High',
      status: 'Submitted',
      reportedBy: 'Nurul Izzah',
      studentId: 'STU-2026-112',
      assignedTo: null,
      upvotes: 9,
      createdAt: '2026-11-25T07:40:00Z',
      updatedAt: '2026-11-25T07:40:00Z',
      timeline: [
        { at: '2026-11-25T07:40:00Z', actor: 'Nurul Izzah', note: 'Issue reported for Level 3 access point.' },
      ],
    },
    {
      id: 'CC-101',
      title: 'Ceiling fan stuck on slowest speed',
      description: 'Wall regulator clicks but fan speed does not increase above level 1.',
      category: 'Fan & AC',
      block: 'Block D',
      room: 'D-112',
      priority: 'Medium',
      status: 'Resolved',
      reportedBy: 'Daniel Lim',
      studentId: 'STU-2026-041',
      assignedTo: 'Encik Faizal',
      upvotes: 1,
      createdAt: '2026-11-22T10:00:00Z',
      updatedAt: '2026-11-23T15:10:00Z',
      resolvedAt: '2026-11-23T15:10:00Z',
      timeline: [
        { at: '2026-11-22T10:00:00Z', actor: 'Daniel Lim', note: 'Issue reported for Room D-112.' },
        { at: '2026-11-22T11:20:00Z', actor: 'Hostel Warden', note: 'Assigned to Encik Faizal.' },
        { at: '2026-11-23T15:10:00Z', actor: 'Encik Faizal', note: 'Replaced faulty capacitor and wall regulator. Tested all 5 speeds.' },
      ],
    },
  ];
}

export function loadTickets(): MaintenanceTicket[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed as MaintenanceTicket[];
    }
  } catch {
    // ignore storage errors
  }
  return createInitialTickets();
}

export function saveTickets(tickets: MaintenanceTicket[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
  } catch {
    // ignore storage errors
  }
}

export function nextTicketId(tickets: MaintenanceTicket[]): string {
  const maxNum = tickets.reduce((acc, t) => {
    const n = Number(t.id.replace(/\D/g, ''));
    return Number.isFinite(n) ? Math.max(acc, n) : acc;
  }, 100);
  return `CC-${maxNum + 1}`;
}

export function createTicket(
  tickets: MaintenanceTicket[],
  input: {
    title: string;
    description: string;
    category: IssueCategory;
    block: HostelBlock;
    room: string;
    priority: Priority;
    reportedBy: string;
    studentId: string;
    photoDataUrl?: string;
  }
): MaintenanceTicket[] {
  const now = new Date().toISOString();
  const ticket: MaintenanceTicket = {
    id: nextTicketId(tickets),
    title: input.title.trim(),
    description: input.description.trim(),
    category: input.category,
    block: input.block,
    room: input.room.trim().toUpperCase(),
    priority: input.priority,
    status: 'Submitted',
    reportedBy: input.reportedBy.trim() || 'Student',
    studentId: input.studentId.trim() || 'STU-000',
    assignedTo: null,
    upvotes: 1,
    photoDataUrl: input.photoDataUrl,
    createdAt: now,
    updatedAt: now,
    timeline: [
      { at: now, actor: input.reportedBy.trim() || 'Student', note: `Issue reported for Room ${input.room.trim().toUpperCase()}.` },
    ],
  };
  return [ticket, ...tickets];
}

export function assignTechnician(
  tickets: MaintenanceTicket[],
  ticketId: string,
  technicianName: string,
  actor = 'Hostel Warden'
): MaintenanceTicket[] {
  const now = new Date().toISOString();
  return tickets.map((t) => {
    if (t.id !== ticketId) return t;
    const nextStatus: TicketStatus = t.status === 'Submitted' ? 'Assigned' : t.status;
    return {
      ...t,
      assignedTo: technicianName,
      status: nextStatus,
      updatedAt: now,
      timeline: [...t.timeline, { at: now, actor, note: `Assigned to ${technicianName}.` }],
    };
  });
}

export function updateTicketStatus(
  tickets: MaintenanceTicket[],
  ticketId: string,
  status: TicketStatus,
  note: string,
  actor: string
): MaintenanceTicket[] {
  const now = new Date().toISOString();
  return tickets.map((t) => {
    if (t.id !== ticketId) return t;
    return {
      ...t,
      status,
      updatedAt: now,
      resolvedAt: status === 'Resolved' ? now : t.resolvedAt,
      timeline: [
        ...t.timeline,
        { at: now, actor, note: note.trim() || `Status updated to ${status}.` },
      ],
    };
  });
}

export function upvoteTicket(tickets: MaintenanceTicket[], ticketId: string): MaintenanceTicket[] {
  return tickets.map((t) => (t.id === ticketId ? { ...t, upvotes: t.upvotes + 1 } : t));
}

export function computeMetrics(tickets: MaintenanceTicket[]) {
  const open = tickets.filter((t) => t.status !== 'Resolved').length;
  const urgent = tickets.filter((t) => t.priority === 'Urgent' && t.status !== 'Resolved').length;
  const inProgress = tickets.filter((t) => t.status === 'In Progress').length;
  const resolved = tickets.filter((t) => t.status === 'Resolved').length;

  const byBlock = BLOCKS.map((block) => ({
    block,
    count: tickets.filter((t) => t.block === block).length,
    open: tickets.filter((t) => t.block === block && t.status !== 'Resolved').length,
  }));

  const byCategory = CATEGORIES.map((category) => ({
    category,
    count: tickets.filter((t) => t.category === category).length,
  })).sort((a, b) => b.count - a.count);

  return { total: tickets.length, open, urgent, inProgress, resolved, byBlock, byCategory };
}

export function ticketsToCsv(tickets: MaintenanceTicket[]): string {
  const header = 'ID,Title,Category,Block,Room,Priority,Status,Reported By,Assigned To,Confirmations,Created At';
  const rows = tickets.map((t) =>
    [
      t.id,
      `"${t.title.replace(/"/g, '""')}"`,
      t.category,
      t.block,
      t.room,
      t.priority,
      t.status,
      t.reportedBy,
      t.assignedTo ?? 'Unassigned',
      t.upvotes,
      t.createdAt,
    ].join(',')
  );
  return [header, ...rows].join('\n');
}
