import { describe, it, expect } from 'vitest';
import {
  createInitialTickets,
  createTicket,
  assignTechnician,
  updateTicketStatus,
  upvoteTicket,
  computeMetrics,
  ticketsToCsv,
} from '../src/data/store';

describe('Campus Care Maintenance Store', () => {
  it('creates a new ticket with sequential ID and initial timeline entry', () => {
    const initial = createInitialTickets();
    const updated = createTicket(initial, {
      title: 'Broken door lock',
      description: 'Room door latch will not close properly.',
      category: 'Furniture & Doors',
      block: 'Block A',
      room: 'a-301',
      priority: 'High',
      reportedBy: 'Muhammad Bukar',
      studentId: 'STU-2026-014',
    });

    expect(updated.length).toBe(initial.length + 1);
    expect(updated[0].id).toBe('CC-105');
    expect(updated[0].room).toBe('A-301');
    expect(updated[0].status).toBe('Submitted');
    expect(updated[0].timeline).toHaveLength(1);
  });

  it('assigns a technician and progresses status from Submitted to Assigned', () => {
    const initial = createInitialTickets();
    const submitted = initial.find((t) => t.status === 'Submitted')!;
    const assigned = assignTechnician(initial, submitted.id, 'Siti Nur');
    const target = assigned.find((t) => t.id === submitted.id)!;

    expect(target.assignedTo).toBe('Siti Nur');
    expect(target.status).toBe('Assigned');
    expect(target.timeline.length).toBe(submitted.timeline.length + 1);
  });

  it('updates ticket status to Resolved, records repair note, and exports CSV', () => {
    const initial = createInitialTickets();
    const open = initial.find((t) => t.status === 'In Progress')!;
    const resolved = updateTicketStatus(initial, open.id, 'Resolved', 'Replaced LED tube.', 'Encik Hafiz');
    const target = resolved.find((t) => t.id === open.id)!;

    expect(target.status).toBe('Resolved');
    expect(target.resolvedAt).toBeTruthy();

    const upvoted = upvoteTicket(resolved, open.id);
    expect(upvoted.find((t) => t.id === open.id)!.upvotes).toBe(open.upvotes + 1);

    const metrics = computeMetrics(upvoted);
    expect(metrics.total).toBe(initial.length);
    expect(metrics.resolved).toBeGreaterThanOrEqual(2);

    const csv = ticketsToCsv(upvoted);
    expect(csv).toContain('ID,Title,Category,Block,Room');
    expect(csv).toContain(open.id);
  });
});
