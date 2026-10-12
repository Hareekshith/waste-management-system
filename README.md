# WasteCare — Waste Management System (WMS) 2.0

> **Migrated to Next.js 15 with a modernized, beginner-friendly UI and zero-configuration persistent backend.**

In today's world, effective waste management is of paramount importance. The increasing volume of waste poses significant challenges to the environment and public health. Proper waste management not only mitigates these challenges but also promotes resource reuse and recycling. The **WasteCare Waste Management System** is a digital platform designed to streamline the process of reporting waste-related issues to municipal authorities, tracking resolution progress in real time, and educating communities on smart recycling segregation.

---

## 🌟 Key Improvements & Highlights

### 1. Modern, Responsive Interface
- **Eco-Friendly Modern Design System**: Built with Next.js 15, React 19, Tailwind CSS, and Lucide Icons.
- **Mobile-First Responsive Layout**: Smooth drawer navigation, touch-friendly touch targets, and accessible form controls.
- **Color-Coded Status Badges**: Visual feedback for `Pending` ⏳, `In Progress` 🚜, `Completed` ✅, and `Rejected` ⚠️.

### 2. Beginner-Friendly Features
- **Interactive 60-Second Guided Tour**: Interactive 4-step modal explaining how the software works for first-time citizens.
- **Instant Demo Accounts (1-Click Switcher)**:
  - **Citizen Demo**: Log in as *Janak Bist* to test filing reports and managing personal history.
  - **Admin Demo**: Log in as *Municipal Operator* to test the municipal dispatcher dashboard.
- **Auto-Fill Sample Data**: 1-click test fill button on the report form so evaluators don't need to manually type dummy text.
- **1-Click GPS Geolocation**: Automatic device coordinate detection for exact waste pinning.
- **Visual Waste Category Selector**: Intuitive cards for Household, Organic, Plastic, E-Waste, Medical, and Scrap Metals.
- **Instant Complaint Tracker (No Login Required)**: Quick search bar on the homepage — simply type Complaint ID (e.g. `#102`) or email to check real-time progress.
- **Interactive "Can I Recycle This?" Tool**: Search any household item (plastic bottles, batteries, apple cores, pizza boxes) for color-coded bin classification and disposal rules.

### 3. Full Next.js Backend Migration
- **Self-Contained Persistent Database**: Built with Node's native SQLite (`node:sqlite`). Zero setup required — no XAMPP, Apache, MySQL, or PHPMyAdmin installation necessary.
- **Pre-Seeded Real Data**: Pre-loaded with all original dummy complaints, users, and admin credentials from `wms.sql`.
- **RESTful API Route Handlers**:
  - `GET /api/stats` — Real-time analytics, resolution rates, and waste category breakdown.
  - `GET /api/complaints` & `POST /api/complaints` — Filterable citizen incident filing and feed.
  - `GET /api/complaints/:id`, `PUT /api/complaints/:id`, `DELETE /api/complaints/:id` — Full CRUD with municipal notes.
  - `POST /api/auth/login`, `POST /api/auth/register`, `POST /api/auth/logout`, `GET /api/auth/me` — Authentication.
  - `POST /api/contact` — 24/7 municipal dispatch inquiry form.
- **Municipal Admin Dashboard**: Real-time status update modal, deletion confirmation, and 1-click CSV spreadsheet export.
- **Legacy Code Preserved**: Original PHP codebase archived under `legacy_php/`.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.17+ or v20+ / v22+ / v26+
- **npm**: v9+

### 1. Clone & Install
```bash
git clone https://github.com/imlakshay08/waste-management-system.git
cd Waste_MGMT
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your web browser.

### 3. Production Build
```bash
npm run build
npm start
```

---

## 👥 Demo Credentials

For testing and evaluation:

| Role | Username / Email | Password | Access Details |
|------|------------------|----------|----------------|
| **Citizen Reporter** | `bistajanak303@gmail.com` | `password123` | Click "Demo Citizen" in header or login |
| **Student Citizen** | `janak.bista@sagarmatha.edu.np` | `password123` | Standard Citizen Login |
| **Municipal Admin** | `admin` or `admin@wms.gov` | `admintest` or `admin` | Official Staff Tab on `/login?admin=true` |

> 🔒 **Security Notice**: The Admin Portal (`/admin`) is strictly restricted to verified municipal administrator accounts. It is hidden from regular citizen navigation bars and returns a 403 Forbidden screen if accessed by unauthorized users.

---

## 🗺️ Application Sitemap

- `/` — **Homepage**: Overview, quick complaint tracker bar, live municipal impact counters, 3-step beginner guide, and waste segregation breakdown.
- `/report` — **Report Waste**: 3-step interactive incident wizard with category picker, 1-click GPS detection, and photo evidence.
- `/track` — **Track Status**: Public real-time progress timeline (Pending ⏳ -> In Progress 🚜 -> Completed ✅).
- `/history` — **My Complaints**: Citizen personal history dashboard with edit and delete capabilities.
- `/guide` — **Recycling Hub**: 4-bin color guide, searchable "Can I Recycle This?" encyclopedia, and DIY home composting steps.
- `/contact` — **Municipal Helpdesk**: 24/7 emergency hotlines, collection truck schedules, and inquiry form.
- `/login`, `/signup`, `/forgot-password` — **Authentication**: Secure citizen login and separated municipal staff login portal.
- `/admin` — **Admin Portal (Restricted / Staff Only)**: Municipal operations dashboard with KPI metrics, status changer modal, municipal notes, and CSV export.

---

## 📁 Project Architecture

```
Waste_MGMT/
├── data/
│   └── wms.sqlite               # Auto-initialized SQLite database (seeded from wms.sql)
├── legacy_php/                  # Preserved legacy PHP/MySQL codebase
├── public/
│   ├── assets/img/              # Static icons, diagrams, and illustrations
│   └── uploads/                 # Complaint image evidence
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/            # Login, register, logout, me, reset routes
│   │   │   ├── complaints/      # Full complaints CRUD & search
│   │   │   ├── contact/         # Contact inquiries
│   │   │   └── stats/           # Real-time analytics & KPIs
│   │   ├── admin/page.tsx       # Municipal Operations Dashboard
│   │   ├── contact/page.tsx     # Citizen & municipal contact helpdesk
│   │   ├── forgot-password/     # Password reset
│   │   ├── guide/page.tsx       # Interactive Recycling & Segregation Guide
│   │   ├── history/page.tsx     # Citizen personal complaint history
│   │   ├── login/page.tsx       # Unified login with 1-click Demo accounts
│   │   ├── report/page.tsx      # 3-step reporting wizard
│   │   ├── signup/page.tsx      # Citizen registration
│   │   ├── track/page.tsx       # Live status tracker with timeline stepper
│   │   ├── globals.css          # Tailwind CSS directives
│   │   ├── layout.tsx           # Global Root layout with Navbar and Footer
│   │   └── page.tsx             # Homepage
│   ├── components/
│   │   ├── BeginnerTourModal.tsx # Interactive 4-step beginner walkthrough
│   │   ├── Footer.tsx           # Global footer with hotlines & credits
│   │   ├── Navbar.tsx           # Responsive header with Demo switcher
│   │   ├── StatusBadge.tsx      # Color-coded status badges
│   │   └── WasteTypeSelector.tsx # Visual multi-select category cards
│   └── lib/
│       ├── db.ts                # SQLite data layer & automated seeding
│       └── types.ts             # TypeScript definitions
├── next.config.ts               # Next.js configuration
├── package.json                 # Project dependencies & scripts
├── tailwind.config.ts           # Tailwind CSS configuration
└── tsconfig.json                # TypeScript configuration
```

---

## 💖 Credits & Acknowledgments

- **Original Creator & Concept**: [@janakbist](https://github.com/janakbist/)
- **Co-Creator**: [@imlakshay08](https://github.com/imlakshay08/)
- **Next.js Full-Stack Migration**: Modernized with Next.js 15, TypeScript, Tailwind CSS, and zero-setup SQLite.

---

## 📄 License & Community Guidelines

- [Contributing Guidelines](CONTRIBUTING.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Learning Resources](LEARN.md)
