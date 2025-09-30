# Workout Tracker

A modern workout tracking application built with Next.js, TypeScript, Prisma, and NextAuth.js.

## 🚀 Features

- **User Authentication**: Secure login with multiple OAuth providers (Google, GitHub)
- **Workout Tracking**: Create, edit, and track workouts and exercises
- **Progress Monitoring**: View your fitness progress over time
- **Modern UI**: Built with Tailwind CSS and shadcn/ui components
- **Type-Safe**: Full TypeScript support
- **Database**: PostgreSQL with Prisma ORM

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma](https://www.prisma.io/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Deployment**: Ready for [Vercel](https://vercel.com/)

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database
- OAuth provider credentials (Google/GitHub)

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/joeumn/workouttracker.git
cd workouttracker
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Update `.env.local` with your configuration:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/workouttracker?schema=public"

# NextAuth.js
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

### 4. Set up the database

```bash
# Generate Prisma client
npm run db:generate

# Push the schema to your database
npm run db:push

# Optional: Open Prisma Studio to view your database
npm run db:studio
```

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 📝 Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run type-check` - Run TypeScript type checking
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Create and run database migrations
- `npm run db:studio` - Open Prisma Studio

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── auth/          # NextAuth.js API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Home page
├── components/            # React components
│   └── session-provider.tsx
└── lib/                   # Utility functions
    ├── auth.ts           # NextAuth configuration
    ├── prisma.ts         # Prisma client
    └── utils.ts          # Utility functions

prisma/
└── schema.prisma         # Database schema

public/                   # Static files
```

## 🗄️ Database Schema

The application includes the following main models:

- **User**: User accounts with authentication
- **Account**: OAuth account information
- **Session**: User sessions
- **Workout**: Individual workout sessions
- **Exercise**: Exercises within workouts

## 🔐 Authentication

This application uses NextAuth.js with the following providers:

- Google OAuth
- GitHub OAuth

To set up OAuth providers:

1. **Google**: Visit [Google Cloud Console](https://console.cloud.google.com/)
2. **GitHub**: Visit [GitHub Developer Settings](https://github.com/settings/developers)

## 🚀 Deployment

### Deploy on Vercel

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Set up environment variables in Vercel dashboard
4. Deploy!

### Database Setup for Production

1. Set up a PostgreSQL database (recommended: [Supabase](https://supabase.com/), [Railway](https://railway.app/), or [Neon](https://neon.tech/))
2. Update `DATABASE_URL` in your production environment
3. Run database migrations

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Prisma](https://www.prisma.io/) - Database toolkit
- [NextAuth.js](https://next-auth.js.org/) - Authentication library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - UI component library
