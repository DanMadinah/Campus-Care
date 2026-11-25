# Campus Care

Live site: [campus-care-three-blond.vercel.app](https://campus-care-three-blond.vercel.app)

## Why I built this

Anyone who has lived in a university hostel knows how frustrating maintenance can be. A ceiling light starts flickering right before exams, a bathroom tap keeps leaking for days, or the corridor Wi-Fi drops every night. Most of the time, complaints end up buried in a paper logbook at the warden's office or lost in a busy WhatsApp group, and students have no idea if anyone even saw their report.

I built **Campus Care** for the love of students and campus life. The goal was to make a simple, clear place where students can report room or block problems in seconds, follow every step until it is fixed, and give hostel wardens and technicians an organized way to get the work done faster.

## Demo Mode vs Cloud Mode (Important)

By default, the deployed site runs in **Demo Mode (Prototype)** so anyone can test all three roles immediately without setting up a database:
- **Demo storage:** Tickets are saved in your browser's `localStorage` (not synced across different devices unless Firebase is configured).
- **Demo login:** Client-side prototype login. Students enter their name, email, and matric number. Staff roles use demo codes:
  - Warden demo code: `warden123`
  - Technician demo code: `tech123`
- **Cloud sync is NOT active by default** just because the code supports it. To enable real multi-device sync and Firebase Authentication, configure the environment variables below.

## Enabling Optional Firebase Auth & Real-Time Cloud Sync

1. Create a Firebase project, enable **Email/Password Authentication**, and create a **Realtime Database**.
2. Apply the backend role rules from [docs/FIREBASE_RULES.json](docs/FIREBASE_RULES.json) in your Firebase Realtime Database Rules tab, and set staff roles under `/campuscare/roles/<uid>` (`"WARDEN"` or `"TECHNICIAN"`).
3. Copy `.env.example` to `.env` (or add these in Vercel **Settings -> Environment Variables**):
   ```env
   VITE_FIREBASE_DB_URL=https://your-project-default-rtdb.firebasedatabase.app
   VITE_FIREBASE_API_KEY=your-firebase-web-api-key
   ```
4. When configured:
   - Login uses real **Firebase Email/Password Authentication** and checks backend-assigned roles.
   - Each ticket is written individually to `/campuscare/tickets/<id>.json` (avoiding full-list overwrites).
   - Live updates stream across devices via Firebase Server-Sent Events (`EventSource`).

## Features

### Student Portal
- **Privacy first**: **My Reports** shows only complaints submitted under the signed-in student's email. **Shared Block Issues** uses a separate anonymised card (`SharedIssueCard.tsx`) that hides other students' names, matric numbers, room numbers, phone numbers, photos, and private history while allowing students to confirm shared block issues ("Same issue").
- **Report any problem**: Choose from Lights & Electrical, Plumbing & Taps, Fan & AC, Internet & Wi-Fi, Furniture & Doors, or select **Other** to type any custom issue.
- **Photo validation**: Accepts JPG, PNG, or WebP images up to 2 MB and compresses them before saving.
- **Track, rate, or reopen**: 4-step progress bar (`Submitted -> Assigned -> In Progress -> Resolved`), reference ID copy button, 1 to 5 star repair rating, and a Reopen option if the fix did not hold.

### Warden / Admin View
- Live counts of open, urgent, in-progress, and resolved tickets, plus breakdowns by hostel block (`Block A` to `Block D`) and category.
- Assign technicians, reset sample records (Warden-only), and export CSV logs with RFC-4180 escaping and spreadsheet formula-injection protection.

### Technician View
- View assigned jobs with room details, contact info, preferred visit time, and photos.
- Update job status (`In Progress` / `Resolved`) and post repair notes that notify students.

## Tech stack

- React 18 & TypeScript
- Vite & Tailwind CSS
- Lucide Icons
- Vitest & GitHub Actions CI
- Optional Firebase Authentication + Realtime Database (REST + SSE)

## Folder structure

```text
campus-care/
├── .github/workflows/ci.yml        # Typecheck, Vitest unit tests, and Vite build
├── docs/FIREBASE_RULES.json        # Example backend role-enforcement rules for Firebase
├── src/
│   ├── components/
│   │   ├── LoginScreen.tsx         # Demo login or real Firebase Email/Password Auth
│   │   ├── ReportModal.tsx         # Issue form, custom "Other" input, photo validation
│   │   ├── TicketCard.tsx          # Full ticket card for owner, warden, and technician
│   │   ├── SharedIssueCard.tsx     # Dedicated anonymised card for shared block issues
│   │   ├── AdminAnalytics.tsx      # Block and category breakdown
│   │   └── MaintenanceBackdrop.tsx # Animated maintenance background
│   ├── data/
│   │   ├── firebaseAuth.ts         # Firebase Auth REST client + backend role lookup
│   │   └── store.ts                # Per-ticket cloud sync, SSE listener, safe CSV export
│   ├── types/index.ts              # TypeScript interfaces
│   └── App.tsx                     # Main app, privacy tabs, notifications, Light/Dark mode
├── tests/store.test.ts             # Unit tests (lifecycle + CSV formula-injection tests)
├── .env.example                    # Optional Firebase env template
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
