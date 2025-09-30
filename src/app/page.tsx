"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Workout Tracker</h1>
          <div>
            {session ? (
              <div className="flex items-center gap-4">
                <span>Welcome, {session.user?.name || session.user?.email}</span>
                <Button onClick={() => signOut()} variant="destructive">
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button onClick={() => signIn()}>
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        {session ? (
          <div className="max-w-4xl">
            <h2 className="text-3xl font-bold mb-6">Your Workouts</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">Recent Workout</h3>
                <p className="text-gray-600 mb-4">No workouts yet</p>
                <Button className="bg-green-500 hover:bg-green-600">
                  Start New Workout
                </Button>
              </div>
              <div className="border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">Progress</h3>
                <p className="text-gray-600 mb-4">Track your progress over time</p>
                <Button>
                  View Progress
                </Button>
              </div>
              <div className="border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">Goals</h3>
                <p className="text-gray-600 mb-4">Set and track your fitness goals</p>
                <Button className="bg-purple-500 hover:bg-purple-600">
                  Set Goals
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-4xl font-bold mb-4">Welcome to Workout Tracker</h2>
            <p className="text-xl text-gray-600 mb-8">
              Track your workouts, monitor your progress, and achieve your fitness goals.
            </p>
            <Button onClick={() => signIn()} size="lg">
              Get Started
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
