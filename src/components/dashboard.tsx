"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Dumbbell, 
  Users, 
  Trophy, 
  Target, 
  Heart, 
  TrendingUp, 
  LogOut,
  Plus,
  Calendar,
  BarChart3,
  Medal,
  Flame
} from "lucide-react";

interface DashboardProps {
  onLogout: () => void;
}

export function Dashboard({ onLogout }: DashboardProps) {
  const mockUser = { name: "Demo User" };
  const [proteinGoal] = useState(120);
  const [currentProtein, setCurrentProtein] = useState(0);
  const [streak] = useState(7);
  const [xp] = useState(1250);
  const [level] = useState(5);

  const progress = (currentProtein / proteinGoal) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Dumbbell className="h-8 w-8 text-rose-600" />
              <span className="text-2xl font-bold text-gray-900">IronCircle</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-orange-500" />
                <span className="font-medium">{streak} day streak</span>
              </div>
              <div className="flex items-center gap-2">
                <Medal className="h-5 w-5 text-yellow-500" />
                <span className="font-medium">Level {level} ({xp} XP)</span>
              </div>
              <span className="text-sm text-gray-600">Welcome, {mockUser.name}</span>
              <Button variant="outline" size="sm" onClick={onLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Daily Check-in */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  Daily Check-in
                </CardTitle>
                <CardDescription>How are you feeling today?</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Button variant="outline" className="flex-1">😊 Great</Button>
                  <Button variant="outline" className="flex-1">😐 Okay</Button>
                  <Button variant="outline" className="flex-1">😴 Tired</Button>
                  <Button variant="outline" className="flex-1">💪 Energized</Button>
                </div>
              </CardContent>
            </Card>

            {/* Macro Tracking */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  Today&apos;s Macros
                </CardTitle>
                <CardDescription>Track your nutrition goals - focus on protein!</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Protein</span>
                    <span className="text-sm text-gray-600">{currentProtein}g / {proteinGoal}g</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-500 h-3 rounded-full transition-all duration-300" 
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Input 
                    type="number" 
                    placeholder="Add protein (g)" 
                    value={currentProtein || ''}
                    onChange={(e) => setCurrentProtein(Number(e.target.value))}
                  />
                  <Button>
                    <Plus className="h-4 w-4" />
                    Add
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">850</div>
                    <div className="text-sm text-gray-600">Calories</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">45g</div>
                    <div className="text-sm text-gray-600">Carbs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">28g</div>
                    <div className="text-sm text-gray-600">Fat</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Workouts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Dumbbell className="h-5 w-5 text-green-500" />
                    Recent Workouts
                  </div>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Log Workout
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">Push Day</div>
                      <div className="text-sm text-gray-600">Chest, Shoulders, Triceps • 45 min</div>
                    </div>
                    <div className="text-sm text-gray-500">Yesterday</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">Pull Day</div>
                      <div className="text-sm text-gray-600">Back, Biceps • 50 min</div>
                    </div>
                    <div className="text-sm text-gray-500">2 days ago</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">Leg Day</div>
                      <div className="text-sm text-gray-600">Squats, Deadlifts, Lunges • 60 min</div>
                    </div>
                    <div className="text-sm text-gray-500">4 days ago</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Weekly Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-500" />
                  This Week
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm">Workouts</span>
                  <span className="font-medium">4/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Avg Protein</span>
                  <span className="font-medium">98g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Check-ins</span>
                  <span className="font-medium">6/7</span>
                </div>
                <Button variant="outline" className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </CardContent>
            </Card>

            {/* Groups */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    My Groups
                  </div>
                  <Button size="sm" variant="outline">Join</Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="font-medium">Morning Warriors</div>
                  <div className="text-sm text-gray-600">248 members</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="font-medium">Protein Hunters</div>
                  <div className="text-sm text-gray-600">156 members</div>
                </div>
              </CardContent>
            </Card>

            {/* Current Challenge */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  4-Week Challenge
                </CardTitle>
                <CardDescription>28-Day Consistency Challenge</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>Week 2 of 4</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '50%' }}></div>
                  </div>
                  <div className="text-sm text-gray-600 mt-2">
                    Rank: #23 of 156 participants
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vibe Packs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-pink-500" />
                  Today&apos;s Vibe
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  🎵 Beast Mode Playlist
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  🎯 Focus Deep Work
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  💪 Morning Motivation
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}