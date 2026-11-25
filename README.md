# Campus Care

A hostel maintenance tracker built with React, TypeScript, Tailwind CSS, and Vite.

Students can report faulty lights, leaking taps, broken fans, Wi-Fi issues, or furniture damage. Wardens can assign staff and check which blocks have the most open issues, and technicians can update repair progress with notes.

## Features

- **Student view**: Submit an issue with block, room, category, urgency, details, and an optional photo. Track status (`Submitted -> Assigned -> In Progress -> Resolved`), read repair notes, and click "Same issue" on shared block problems.
- **Warden / Admin view**: See open, urgent, in-progress, and resolved counts, view counts by block (`Block A` to `Block D`) and category, assign technicians, and download the log as CSV.
- **Technician view**: Update ticket status (`In Progress` or `Resolved`) and leave repair notes for the student.
- **Search & filters**: Filter by block, category, status, or search by room, ticket ID, or student name.

## Stack

- React 18, TypeScript, Vite, Tailwind CSS
- Lucide Icons
- Vitest + GitHub Actions
- Browser `localStorage` for saving tickets locally

## Folder structure

```text
campuscare/
├── .github/workflows/ci.yml    # Typecheck, tests, and build
├── src/
│   ├── components/
│   │   ├── ReportModal.tsx     # New issue form
│   │   ├── TicketCard.tsx      # Status bar, timeline, and role actions
│   │   └── AdminAnalytics.tsx  # Block and category breakdown
│   ├── data/store.ts           # Ticket logic, counts, and CSV export
│   ├── types/index.ts          # TypeScript types
│   └── App.tsx                 # Main page and filters
├── tests/store.test.ts         # Unit tests
├── vercel.json                 # Vercel build config
└── LICENSE
```

## Setup

Deploy on [vercel.com](https://vercel.com) by importing this repo, or run locally:

```bash
npm install
npm test
npm run dev
```

## Author

Muhammad Abdullahi Bukar

## License

MIT (see [LICENSE](LICENSE))
