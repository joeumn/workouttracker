import Link from 'next/link'
import { ArrowLeft, Activity, Target, Calendar, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="mr-4">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <h1 className="text-xl font-bold">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/nutrition">
                <Button variant="ghost">Nutrition</Button>
              </Link>
              <Link href="/groups">
                <Button variant="ghost">Groups</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back!</h2>
            <p className="text-gray-600">Here&apos;s your workout overview for today</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Workouts This Week</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">
                  +20% from last week
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12 days</div>
                <p className="text-xs text-muted-foreground">
                  Keep it up!
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Calories Burned</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,340</div>
                <p className="text-xs text-muted-foreground">
                  This week
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Goal Progress</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">85%</div>
                <p className="text-xs text-muted-foreground">
                  Weekly goal
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Workouts */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Workouts</CardTitle>
                <CardDescription>Your latest training sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Upper Body Strength</h4>
                      <p className="text-sm text-muted-foreground">Today, 45 min</p>
                    </div>
                    <Badge>Completed</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Cardio HIIT</h4>
                      <p className="text-sm text-muted-foreground">Yesterday, 30 min</p>
                    </div>
                    <Badge>Completed</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Lower Body Focus</h4>
                      <p className="text-sm text-muted-foreground">2 days ago, 50 min</p>
                    </div>
                    <Badge>Completed</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Core & Flexibility</h4>
                      <p className="text-sm text-muted-foreground">3 days ago, 25 min</p>
                    </div>
                    <Badge variant="secondary">Skipped</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Start your workout or check your progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button className="w-full justify-start" size="lg">
                    <Activity className="h-4 w-4 mr-2" />
                    Start New Workout
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="lg">
                    <Calendar className="h-4 w-4 mr-2" />
                    View Workout Plan
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="lg">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    View Progress Charts
                  </Button>
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-3">Today&apos;s Goals</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Workout completed</span>
                        <span className="text-green-600">✓</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Protein target (120g)</span>
                        <span className="text-gray-500">85g</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Water intake (8 glasses)</span>
                        <span className="text-gray-500">6/8</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}