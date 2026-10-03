# Terra Nova — AI Coding Agent Brief

**Project:** Terra Nova — Mars Colony Digital Ecosystem  
**Timebox:** 24-hour game jam  
**Stack:** Next.js (App Router), Tailwind CSS, Prisma, NextAuth.js, PostgreSQL/SQLite, Leaflet  
**Goal:** Build a functional, role-based web app that serves as the digital heart of the first Mars colony.

---

## 🎯 Mission

Generate code for a multi-role platform where citizens and professionals (police, medics, maintenance, drivers, merchants, admins, council) access role-specific views and actions. The MVP must demonstrate a complete flow: citizen reports an incident → professional sees it in real-time → takes action → resolves it.

---

## 🧱 Core Requirements

### Tech Stack

- **Frontend:** Next.js 14+ (App Router), Tailwind CSS, React-Leaflet
- **Backend:** Next.js API Routes / Server Actions
- **ORM:** Prisma
- **Auth:** NextAuth.js (Credentials or GitHub provider)
- **Database:** PostgreSQL (Neon/Supabase) or SQLite for local dev
- **Deployment:** Vercel-ready

### Key Features (MVP)

1. **Authentication & Roles**
   - User sign-up/login via NextAuth
   - Role assignment (Citizen, Security, Medic, Maintenance, Driver, Merchant, Admin, Council)
   - Role-based redirects after login
   - Protected routes and API endpoints

2. **Dashboard per Role**
   - Citizen: services overview, quick actions
   - Security: live incident feed, map, case management
   - Medic: medical emergencies queue
   - Maintenance: pending tasks list
   - Driver: ride requests
   - Merchant: incoming orders
   - Admin/Council: oversight dashboard

3. **Reporting System**
   - Citizens can create reports (Security, Medical, Maintenance, Cleanliness)
   - Reports include: title, description, priority, optional lat/lng
   - Status lifecycle: OPEN → ASSIGNED → EN_ROUTE → IN_PROGRESS → RESOLVED → CLOSED
   - Professionals can view, claim, and update reports in their domain

4. **Security Case Management**
   - Police can open a case from a security report
   - Fields: suspect name, arrest notes, fine amount, PV content
   - Case status tracking

5. **Map View**
   - Interactive map showing colony modules
   - Markers for reports, vehicles, services (filtered by role permissions)

6. **Mock Services**
   - Simulated payments, taxi orders, food orders (no real payment gateway)
   - Mock real-time updates via polling or SSE

---

## 📁 Project Structure

```
terra-nova/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/
│   │   ├── citizen/page.tsx
│   │   ├── operations/
│   │   │   ├── security/page.tsx
│   │   │   ├── medical/page.tsx
│   │   │   ├── maintenance/page.tsx
│   │   │   ├── transport/page.tsx
│   │   │   └── commerce/page.tsx
│   │   ├── administration/page.tsx
│   │   └── council/page.tsx
│   ├── map/page.tsx
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── reports/
│   │   ├── cases/
│   │   ├── orders/
│   │   └── messages/
│   └── layout.tsx
├── components/
│   ├── dashboard/
│   ├── map/
│   ├── reports/
│   ├── cases/
│   └── ui/
├── lib/
│   ├── auth.ts
│   ├── prisma.ts
│   └── permissions.ts
├── prisma/
│   └── schema.prisma
├── .env
└── package.json
```

---

## 🗃️ Prisma Schema

Generate the following schema in `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  CITIZEN
  SECURITY
  MEDIC
  MAINTENANCE
  DRIVER
  MERCHANT
  ADMIN_AGENT
  COUNCIL
}

enum ReportType {
  SECURITY
  MEDICAL
  MAINTENANCE
  CLEANLINESS
}

enum ReportStatus {
  OPEN
  ASSIGNED
  EN_ROUTE
  IN_PROGRESS
  RESOLVED
  CLOSED
}

model User {
  id          String       @id @default(cuid())
  name        String?
  email       String       @unique
  password    String?
  image       String?
  roles       UserRole[]
  reports     Report[]     @relation("ReportAuthor")
  assignments Assignment[] @relation("AssignedAgent")
  policeCases PoliceCase[] @relation("ArrestingOfficer")
  orders      Order[]
  messages    Message[]
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
}

model UserRole {
  id     String @id @default(cuid())
  userId String
  role   Role
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, role])
}

model Report {
  id          String       @id @default(cuid())
  type        ReportType
  title       String
  description String
  priority    Int          @default(1)
  status      ReportStatus @default(OPEN)
  latitude    Float?
  longitude   Float?
  authorId    String
  author      User         @relation("ReportAuthor", fields: [authorId], references: [id], onDelete: Cascade)
  assignments Assignment[]
  policeCase  PoliceCase?  @relation(fields: [policeCaseId], references: [id])
  policeCaseId String?     @unique
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
}

model Assignment {
  id        String   @id @default(cuid())
  reportId  String
  agentId   String
  status    String   @default("ASSIGNED")
  report    Report   @relation(fields: [reportId], references: [id], onDelete: Cascade)
  agent     User     @relation("AssignedAgent", fields: [agentId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model PoliceCase {
  id          String   @id @default(cuid())
  reportId    String   @unique
  officerId   String
  suspectName String?
  arrestNotes String?
  fineAmount  Float?
  pvContent   String?
  status      String   @default("OPEN")
  report      Report   @relation(fields: [reportId], references: [id], onDelete: Cascade)
  officer     User     @relation("ArrestingOfficer", fields: [officerId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Order {
  id         String   @id @default(cuid())
  type       String
  status     String   @default("PENDING")
  total      Float
  customerId String
  customer   User     @relation(fields: [customerId], references: [id], onDelete: Cascade)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

model Message {
  id        String   @id @default(cuid())
  content   String
  senderId  String
  sender    User     @relation(fields: [senderId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

## 🔐 Authentication & Authorization

### NextAuth Configuration (`lib/auth.ts`)

- Use Credentials provider for MVP (email/password)
- In JWT callback, load user roles from DB and attach to token
- In session callback, expose roles to client

### Permissions Helper (`lib/permissions.ts`)

Create utility functions:

- `hasRole(session, role)` — check if user has a specific role
- `hasAnyRole(session, roles)` — check if user has any of the listed roles
- `requireRole(session, role)` — throw error if role not present

### Route Protection

- Use middleware or HOC to protect role-specific routes
- Redirect unauthorized users to their default dashboard
- API routes must verify roles before processing

---

## 🎨 UI/UX Guidelines

### Design System

- **Theme:** Futuristic Mars colony interface
- **Colors:**
  - Background: `#0B0F19` (deep space blue)
  - Surface: `#1F2937` (metallic gray)
  - Accent: `#F4A261` (Mars orange), `#E63946` (alert red), `#38BDF8` (info cyan)
- **Typography:** `font-mono` for headings, `font-sans` for body
- **Components:** Reusable Button, Card, Input, Badge, Modal

### Role-Specific UI

- **Citizen:** Clean, service-oriented, quick actions
- **Security:** Dark, high-contrast, data-dense, map-centric
- **Medical:** Calm colors, priority-based list
- **Operations roles:** Status badges, action buttons, filters

---

## 📋 Development Tasks

### Phase 1: Foundation (Hours 0-4)

1. Initialize Next.js project with TypeScript and Tailwind
2. Set up Prisma, run migration, seed demo users (one per role)
3. Configure NextAuth with Credentials provider
4. Create login/register pages
5. Implement role-based redirect after login

### Phase 2: Core Features (Hours 4-12)

1. Build shared layout with navigation and notifications
2. Create citizen dashboard with service cards
3. Implement report creation form (type, title, description, priority, optional coords)
4. Build reports list view with filters
5. Create security dashboard with live feed and map

### Phase 3: Role Views (Hours 12-18)

1. Security case management (open case, add suspect, PV, close)
2. Medical queue view (simplified)
3. Maintenance task list (simplified)
4. Driver ride requests (simplified)
5. Merchant orders view (simplified)

### Phase 4: Polish & Demo (Hours 18-24)

1. Add map with markers for reports
2. Implement polling for real-time feel
3. Seed realistic demo data
4. Test full user journey: citizen reports → security resolves
5. Fix bugs, improve UI, prepare demo script

---

## 🚀 Demo Scenario

**Narrative:** "A day in Terra Nova"

1. **Citizen** logs in, sees colony overview
2. Reports a security incident (assault near Module 3)
3. **Security officer** logs in, sees incident in live feed
4. Opens case, marks suspect as "John Doe", adds arrest notes
5. Updates report status to RESOLVED
6. **Council member** logs in, sees resolved incident in oversight dashboard

Show role switching, real-time updates, and case closure.

---

## ⚠️ Constraints & Shortcuts

- **No real payments:** simulate balance and transactions
- **No real GPS:** use static coordinates or click-to-select on map
- **No complex real-time:** use 5-second polling instead of WebSockets
- **No file uploads:** skip attachments or use placeholder URLs
- **Focus on flow:** depth over breadth — one complete scenario beats half-implemented features

---

## 📤 Deliverables

- Functional Next.js app deployable on Vercel
- Prisma schema with migrations
- Seeded database with demo users
- Role-protected routes and API endpoints
- At least one complete end-to-end scenario working
- Clean, responsive UI consistent with Mars theme

---

**Build Terra Nova: one digital identity, connected services, an operational Mars city.** 🚀🔴
