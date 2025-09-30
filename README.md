# Workout Tracker

A modern, responsive web application for tracking workouts, nutrition, and competing with friends in fitness groups.

## Features

- **Dashboard**: Get an overview of your workout progress, current streak, and quick actions
- **Nutrition Tracking**: Monitor macronutrients with detailed breakdowns and protein intake charts
- **Groups**: Join fitness groups and compete on leaderboards
- **Responsive Design**: Built with shadcn/ui for a clean, modern interface

## Tech Stack

- Next.js 15 with App Router
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Recharts for data visualization

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Pages

- `/` - Homepage with navigation to main sections
- `/dashboard` - Workout overview and quick actions
- `/nutrition` - Macro tracking and protein charts
- `/groups` - List of joined and available groups
- `/groups/[id]/leaderboard` - Group leaderboards with rankings

## Components

The app uses a modular component structure with reusable UI components built on shadcn/ui.