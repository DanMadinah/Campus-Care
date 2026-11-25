# Campus Care

Live site: [campus-care-three-blond.vercel.app](https://campus-care-three-blond.vercel.app)

## Why I built this

Anyone who has lived in a university hostel knows how frustrating maintenance can be. A ceiling light starts flickering right before exams, a bathroom tap keeps leaking for days, or the corridor Wi-Fi drops every night. Most of the time, complaints end up buried in a paper logbook at the warden's office or lost in a busy WhatsApp group, and students have no idea if anyone even saw their report.

I built **Campus Care** for the love of students and campus life. The goal was to make a simple, clear place where students can report room or block problems in seconds, follow every step until it is fixed, and give hostel wardens and technicians an organized way to get the work done faster.

## How it works

### 1. Email Login (Separate Access)
- **Students** sign in with their name and email address to report issues and track repairs.
- **Wardens** sign in with their email and staff access code (`warden123` for demo testing).
- **Technicians** sign in with their email and staff access code (`tech123` for demo testing).

### 2. Student Portal
- **Report any problem**: Pick from common hostel issues (Lights & Electrical, Plumbing & Taps, Fan & AC, Internet & Wi-Fi, Furniture & Doors) or choose **Other** to type any issue not on the list (like a roof leak, broken washing machine, or pest issue).
- **Real details that help staff**: Add your block, room number, preferred technician visit time, phone/WhatsApp number, and an optional photo of the problem.
- **Track progress**: Every report gets a reference code (like `CC-105`) with a copy button, a 4-step progress bar (`Submitted -> Assigned -> In Progress -> Resolved`), and a full update history.
- **Shared block issues**: Click **Same issue** on an existing report so maintenance knows how many students are affected without flooding the system with duplicates.
- **Rate or reopen**: Once a job is marked Resolved, students can rate the repair (1 to 5 stars), leave feedback, or reopen the ticket if the problem comes back.

### 3. Warden / Admin View
- See live counts of open, urgent, in-progress, and resolved complaints.
- Check which hostel blocks (`Block A` to `Block D`) and issue categories have the most reports.
- Assign incoming tickets to the right technician and download the full maintenance log as a CSV file.

### 4. Technician View
- View assigned jobs with room numbers, student contact info, preferred visit times, and attached photos.
- Update ticket status to **In Progress** or **Resolved** and write repair notes that show up right away for the student.

### 5. Extra Touches
- **Notifications bell**: Alerts users whenever a ticket is submitted, assigned, or updated, with a click-to-jump shortcut.
- **Light and Dark mode**: Switch themes anytime from the top bar.
- **Search and filters**: Filter by block, category, status, or search by room, student name, or ticket ID.

## Tech stack

- React 18 & TypeScript
- Vite & Tailwind CSS
- Lucide Icons
- Vitest & GitHub Actions CI
- Browser `localStorage` for saving tickets locally (ready to connect to a backend database later)

## Folder structure

```text
campus-care/
├── .github/workflows/ci.yml        # Runs typecheck, unit tests, and build
├── src/
│   ├── components/
│   │   ├── LoginScreen.tsx         # Email login for Students, Wardens, and Technicians
│   │   ├── ReportModal.tsx         # Issue form with custom "Other" input and photo preview
│   │   ├── TicketCard.tsx          # Progress bar, history, rating, reopen, and staff actions
│   │   ├── AdminAnalytics.tsx      # Block and category breakdown charts
│   │   └── MaintenanceBackdrop.tsx # Animated hostel maintenance background
│   ├── data/store.ts               # Ticket logic, counts, ratings, and CSV export
│   ├── types/index.ts              # TypeScript types
│   └── App.tsx                     # Main app, notifications bell, and filters
├── tests/store.test.ts             # Unit tests for the maintenance workflow
├── vercel.json                     # Vercel deployment config
└── LICENSE
```

## Running locally

```bash
npm install
npm test
npm run dev
```

## Author

Built with care for students by **Muhammad Abdullahi Bukar**.

## License

MIT (see [LICENSE](LICENSE))
