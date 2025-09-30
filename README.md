# IronCircle - Fitness Community & Tracker

IronCircle is a comprehensive fitness tracking and community platform built with Next.js 15, TypeScript, Tailwind CSS, and modern web technologies. It focuses on macro tracking (with protein emphasis), social features, gamification, and community building.

![IronCircle Landing Page](https://github.com/user-attachments/assets/b7a6a49b-f91c-4bbb-8097-171a1ec3a8e1)

![IronCircle Dashboard](https://github.com/user-attachments/assets/7a114a8c-8fcd-4dc2-9f87-278bd4c78e19)

## 🚀 Features

### Core Functionality
- **Macro Tracking**: Focus on protein goals with smart tracking and weekly progress charts
- **Daily Check-ins**: Track mood, energy levels, and build streaks
- **Workout Logging**: Record and track your fitness activities
- **Progress Analytics**: Compare current vs. best/last week performance

### Social & Community
- **Groups**: Join fitness communities and participate in group challenges
- **Leaderboards**: Compete with friends and community members
- **4-Week Challenges**: Structured fitness challenges with progress tracking
- **Social Feed**: Share achievements and connect with other members
- **Gym Buddy Matching**: Find workout partners with optional gender preferences
- **Safety Features**: Block and report functionality for user safety

### Motivation & Gamification
- **XP System**: Earn experience points for activities and achievements
- **Levels & Streaks**: Track consecutive days and unlock new levels
- **Rewards System**: Unlock achievements and rewards for consistency
- **Vibe Packs**: Access curated Spotify/YouTube playlists and focus videos

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Database**: Prisma with PostgreSQL (configured)
- **Authentication**: Auth.js (configured for future use)
- **Testing**: Vitest + Playwright
- **Icons**: Lucide React

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd workouttracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your environment variables:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/ironcircle"
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Set up the database** (when ready)
   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

## 🏃‍♂️ Running the Application

### Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm start
```

## 🧪 Testing

### Unit Tests (Vitest)
```bash
# Run tests
npm run test

# Run tests with UI
npm run test:ui

# Run tests in watch mode
npm test -- --watch
```

### End-to-End Tests (Playwright)
```bash
# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui
```

## 📊 Database Schema

The application uses Prisma with PostgreSQL and includes models for:

- **Users**: Profile information, preferences, XP, levels, streaks
- **Workouts**: Exercise logging and tracking
- **Macro Entries**: Daily nutrition tracking
- **Groups**: Community features and memberships
- **Challenges**: 4-week challenges and participation
- **Social Features**: Posts, likes, comments, buddy requests
- **Safety**: User blocking and reporting system
- **Vibe Packs**: Curated playlists and focus content

## 🎯 Current Implementation Status

### ✅ Completed Features
- Modern Next.js 15 setup with TypeScript and Tailwind CSS
- Responsive landing page with feature showcase
- Interactive dashboard with macro tracking
- Daily check-in system with mood tracking
- User stats display (streaks, XP, levels)
- Groups and challenges UI
- Vibe packs interface
- Unit and E2E testing setup
- Basic state management for demo functionality

### 🚧 In Progress / Planned
- Database integration with Prisma
- User authentication with Auth.js
- Real data persistence
- Social feed implementation
- Gym buddy matching algorithm
- Advanced analytics and charts
- Mobile responsiveness optimization
- API endpoints for all features
- Comprehensive seed data

## 🔧 Development

### Project Structure
```
src/
├── app/                 # Next.js App Router pages
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── dashboard.tsx   # Main dashboard
│   └── landing-page.tsx # Landing page
├── lib/                # Utility functions
└── test/               # Test files

prisma/
└── schema.prisma       # Database schema

tests/                  # E2E tests
```

### Key Components
- **LandingPage**: Marketing page with feature showcase
- **Dashboard**: Main application interface
- **UI Components**: Reusable components built with shadcn/ui
- **Button, Input, Card**: Core UI building blocks

## 🎨 Design System

The application uses a cohesive design system with:
- **Primary Color**: Rose/Pink (`rose-600`)
- **Typography**: Clean, modern fonts
- **Layout**: Card-based interface with proper spacing
- **Icons**: Lucide React for consistent iconography
- **Responsive**: Mobile-first approach

## 🚀 Deployment

The application is configured for easy deployment on platforms like:
- Vercel (recommended for Next.js)
- Netlify
- Railway (for full-stack with database)

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

---

**IronCircle** - Transform Your Fitness Journey 💪
