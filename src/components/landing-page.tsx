"use client";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell, Users, Trophy, Target, Heart, TrendingUp } from "lucide-react";

interface LandingPageProps {
  onLogin: () => void;
}

export function LandingPage({ onLogin }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Dumbbell className="h-8 w-8 text-rose-600" />
            <span className="text-2xl font-bold text-gray-900">IronCircle</span>
          </div>
          <Button onClick={onLogin}>Get Started</Button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Transform Your Fitness Journey
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Track macros, join challenges, connect with gym buddies, and unlock your potential with IronCircle - the ultimate fitness community.
        </p>
        <Button size="lg" onClick={onLogin} className="text-lg px-8 py-3">
          Start Your Journey
        </Button>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything You Need to Succeed</h2>
          <p className="text-lg text-gray-600">Comprehensive tools and community support for your fitness goals</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <Target className="h-8 w-8 text-rose-600 mb-2" />
              <CardTitle>Macro Tracking</CardTitle>
              <CardDescription>
                Focus on protein goals with smart macro tracking and weekly progress charts
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-rose-600 mb-2" />
              <CardTitle>Groups & Community</CardTitle>
              <CardDescription>
                Join groups, compete on leaderboards, and participate in 4-week challenges
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Trophy className="h-8 w-8 text-rose-600 mb-2" />
              <CardTitle>Personal Progress</CardTitle>
              <CardDescription>
                Track your best weeks, compare with past performance, and celebrate achievements
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Heart className="h-8 w-8 text-rose-600 mb-2" />
              <CardTitle>Daily Motivation</CardTitle>
              <CardDescription>
                Check-in daily, build streaks, earn XP, and unlock rewards to stay motivated
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="h-8 w-8 text-rose-600 mb-2" />
              <CardTitle>Vibe Packs</CardTitle>
              <CardDescription>
                Access curated Spotify playlists, YouTube videos, and focus content for workouts
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Dumbbell className="h-8 w-8 text-rose-600 mb-2" />
              <CardTitle>Gym Buddy Matching</CardTitle>
              <CardDescription>
                Find workout partners with optional gender preferences and safety features
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-rose-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Join the Circle?</h2>
          <p className="text-lg mb-8 opacity-90">
            Start your fitness transformation today with thousands of motivated members
          </p>
          <Button size="lg" variant="secondary" onClick={onLogin} className="text-lg px-8 py-3">
            Join IronCircle Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Dumbbell className="h-6 w-6" />
            <span className="text-xl font-bold">IronCircle</span>
          </div>
          <p className="text-gray-400">© 2024 IronCircle. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}