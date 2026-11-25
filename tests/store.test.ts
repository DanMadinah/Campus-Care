import { describe, it, expect } from 'vitest';
import {
  createInitialTickets,
  createTicket,
  assignTechnician,
  updateTicketStatus,
  rateTicket,
  reopenTicket,
  upvoteTicket,
  computeMetrics,
  ticketsToCsv,
} from '../src/data/store';

describe('Campus Care Maintenance Store', () => {
  it('creates a ticket including custom Other issue categories', () => {
    const initial = createInitialTickets();
    const updated = createTicket(initial, {
      title: 'Roof dripping during rain',
      description: 'Water leaking from ceiling corner near window.',
      category: 'Roof Leak',
      block: 'Block A',
      room: 'a-301',
      priority: 'Urgent',
      reportedBy: 'Muhammad Bukar',
      studentId: 'STU-2026-014',
      phone: '011-2345-6789',
    });

    expect(updated.length).toBe(initial.length + 1);
    expect(updated[0].id).toBe('CC-105');
    expect(updated[0].category).toBe('Roof Leak');
    expect(updated[0].room).toBe('A-301');
    expect(updated[0].status).toBe('Submitted');
  });

  it('assigns a technician and progresses status from Submitted to Assigned', () => {
    const initial = createInitialTickets();
    const submitted = initial.find((t) => t.status === 'Submitted')!;
    const assigned = assignTechnician(initial, submitted.id, 'Siti Nur');
    const target = assigned.find((t) => t.id === submitted.id)!;

    expect(target.assignedTo).toBe('Siti Nur');
    expect(target.status).toBe('Assigned');
  });

  it('resolves, rates, reopens, upvotes, and exports CSV cleanly', () => {
    const initial = createInitialTickets();
    const open = initial.find((t) => t.status === 'In Progress')!;
    const resolved = updateTicketStatus(initial, open.id, 'Resolved', 'Replaced LED tube.', 'Encik Hafiz');
    const rated = rateTicket(resolved, open.id, 5, 'Very fast repair');
    expect(rated.find((t) => t.id === open.id)!.rating).toBe(5);

    const reopened = reopenTicket(rated, open.id, 'Light flickered again');
    expect(reopened.find((t) => t.id === open.id)!.status).toBe('In Progress');

    const upvoted = upvoteTicket(reopened, open.id);
    expect(upvoted.find((t) => t.id === open.id)!.upvotes).toBe(open.upvotes + 1);

    const metrics = computeMetrics(upvoted);
    expect(metrics.total).toBe(initial.length);

    const csv = ticketsToCsv(upvoted);
    expect(csv).toContain('ID,Title,Category,Block,Room');
    expect(csv).toContain(open.id);
  });
});
