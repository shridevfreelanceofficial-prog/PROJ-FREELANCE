# ShriDev Freelance

A full-stack freelancing project management and showcase system built with Next.js, Neon PostgreSQL, Brevo SMTP, and Vercel Blob.

## Features

### Administrator Features
- **Dashboard** - Overview of projects, members, payments, and meetings
- **Profile Management** - Complete profile with signature upload
- **Member Management** - Create, edit, view, and deactivate team members
- **Project Management** - Create projects, assign members with daily working hours
- **Meeting Scheduling** - Schedule meetings with automatic notifications and reminders
- **Payment Tracking** - Track payments with member confirmation workflow
- **Certificate Generation** - Generate completion certificates for team members
- **Project Showcase** - Manage public showcase of completed projects

### Team Member Features
- **Dashboard** - View assigned projects, notifications, and pending actions
- **Project Participation** - Confirm participation in assigned projects
- **Work Timer** - Track work hours with start/pause/resume/stop functionality
- **Daily Reports** - Upload PDF daily work reports
- **Deliverables** - Upload project deliverables (files or drive links)
- **Payments** - View payment history and confirm receipt
- **Certificates** - View earned certificates

### Public Features
- **Certificate Verification** - Verify authenticity of certificates
- **Project Showcase** - View completed projects

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Neon PostgreSQL (Serverless)
- **File Storage**: Vercel Blob
- **Email**: Brevo SMTP
- **Authentication**: JWT with HTTP-only cookies

## Theme

Neo Mint Theme colors:
- Primary: Mint Green (#10B981)
- Secondary: Deep Teal (#0F766E)
- Background: Cool White (#F8FAFC)
- Cards: Pure White (#FFFFFF)
- Accent: Soft Mint (#D1FAE5)
- Text: Dark Slate (#111827)

## Prerequisites

Before you begin, ensure you have the following:
- Node.js 18+ installed
- A Neon PostgreSQL account
- A Vercel account (for Blob storage and deployment)
- A Brevo account (for email sending)

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd shridev-freelance
npm install
```

### 2. Set Up Neon PostgreSQL

1. Go to [Neon](https://neon.tech) and create an account
2. Create a new project
3. Copy the connection string (DATABASE_URL)
4. Run the schema from `src/lib/db/schema.sql` in the Neon SQL editor

### 3. Set Up Vercel Blob

1. Go to [Vercel](https://vercel.com) and create an account
2. Create a new project or use existing one
3. Go to Storage → Blob and create a new blob store
4. Copy the `BLOB_READ_WRITE_TOKEN`

### 4. Set Up Brevo SMTP

1. Go to [Brevo](https://www.brevo.com) and create an account
2. Go to SMTP & API settings
3. Copy your SMTP credentials:
   - Host: smtp-relay.brevo.com
   - Port: 587
   - User: Your SMTP login
   - Pass: Your SMTP key

### 5. Create Environment File

Create `.env.local` in the project root:

```env
# Database
NEON_DATABASE_URL=your_neon_connection_string

# Vercel Blob
BLOB_READ_WRITE_TOKEN=your_blob_token

# JWT Secret (generate a random 32+ character string)
JWT_SECRET=your_jwt_secret_key

# Brevo SMTP
BREVO_SMTP_HOST=smtp-relay.brevo.com
BREVO_SMTP_PORT=587
BREVO_SMTP_USER=your_smtp_user
BREVO_SMTP_PASS=your_smtp_password

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 6. Create Initial Admin User

Run this SQL in your Neon database to create the first admin:

```sql
-- Replace with your desired credentials
INSERT INTO administrators (username, password, is_profile_complete)
VALUES ('admin', '$2a$10$your_hashed_password_here', false);
```

To generate a hashed password, you can use this Node.js script:

```javascript
const bcrypt = require('bcryptjs');
const password = 'your_password';
const hash = await bcrypt.hash(password, 10);
console.log(hash);
```

### 7. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
src/
├── app/
│   ├── admin/
│   │   ├── login/
│   │   └── dashboard/
│   │       ├── members/
│   │       ├── projects/
│   │       ├── meetings/
│   │       ├── payments/
│   │       └── showcase/
│   ├── member/
│   │   ├── login/
│   │   └── dashboard/
│   │       ├── projects/
│   │       ├── work-timer/
│   │       ├── reports/
│   │       ├── payments/
│   │       └── certificates/
│   ├── api/
│   │   ├── admin/
│   │   ├── member/
│   │   ├── auth/
│   │   └── certificates/
│   └── certificate-verification/
├── components/
│   └── ui/
├── lib/
│   ├── auth/
│   ├── db/
│   ├── blob/
│   ├── email/
│   └── documents/
└── middleware.ts
```

## API Routes

### Authentication
- `POST /api/admin/login` - Admin login
- `POST /api/member/login` - Member login
- `POST /api/auth/logout` - Logout
- `GET /api/admin/me` - Get current admin
- `GET /api/member/me` - Get current member

### Admin Routes
- `GET /api/admin/stats` - Dashboard statistics
- `GET/POST /api/admin/members` - Member management
- `GET/POST /api/admin/projects` - Project management
- `POST /api/admin/meetings` - Meeting scheduling
- `GET /api/admin/payments` - Payment overview
- `POST /api/admin/projects/[id]/certificates` - Generate certificates

### Member Routes
- `GET /api/member/projects` - Get assigned projects
- `POST /api/member/work-session/start` - Start work timer
- `POST /api/member/work-session/pause` - Pause work timer
- `POST /api/member/work-session/resume` - Resume work timer
- `POST /api/member/work-session/stop` - Stop work timer
- `POST /api/member/reports` - Upload daily report
- `POST /api/member/projects/[id]/deliverables` - Upload deliverables
- `POST /api/member/payments/[id]/confirm` - Confirm payment receipt

### Public Routes
- `POST /api/certificates/verify` - Verify certificate

## Deployment

### Deploy to Vercel

1. Push your code to a Git repository
2. Import the project in Vercel
3. Add all environment variables
4. Deploy

The project will be automatically deployed with each push to the main branch.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - see LICENSE file for details
