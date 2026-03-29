# Reconnect

A mobile-first messenger clone built with Next.js 15 and Supabase.

## Features

- 🔐 Authentication (email/password)
- 💬 Group chat rooms
- 📩 Direct messaging
- ⚡ Real-time message delivery
- 📱 Mobile-first responsive design

## Tech Stack

- **Frontend:** Next.js 15 (App Router), React, TypeScript
- **Backend:** Supabase (Auth, Postgres, Realtime)
- **Styling:** Tailwind CSS
- **Testing:** Playwright

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase account

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. Run database migrations:
   - Open your Supabase project
   - Go to SQL Editor
   - Run the migrations in `supabase/migrations/001_initial_schema.sql` and `002_rls_policies.sql`

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Testing

Run E2E tests:
```bash
npm test
```

## Project Structure

```
daychat/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   │   ├── auth/         # Auth components
│   │   ├── chat/         # Chat components
│   │   ├── layout/       # Layout components
│   │   └── ui/           # UI primitives
│   └── lib/              # Utilities and hooks
│       ├── hooks/        # React hooks
│       └── supabase/     # Supabase clients
├── supabase/
│   └── migrations/       # Database migrations
├── tests/
│   └── e2e/              # Playwright E2E tests
└── package.json
```

## License

MIT
