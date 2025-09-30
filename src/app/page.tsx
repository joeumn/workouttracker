import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">Workout Tracker</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
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
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to Workout Tracker
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Track your workouts, monitor nutrition, and compete with friends
            </p>
            <Link href="/dashboard">
              <Button size="lg" className="mr-4">
                Get Started
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Dashboard</CardTitle>
                <CardDescription>
                  View your workout overview and progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/dashboard">
                  <Button variant="outline" className="w-full">
                    View Dashboard
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Nutrition</CardTitle>
                <CardDescription>
                  Track macros and protein intake
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/nutrition">
                  <Button variant="outline" className="w-full">
                    View Nutrition
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Groups</CardTitle>
                <CardDescription>
                  Join groups and compete on leaderboards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/groups">
                  <Button variant="outline" className="w-full">
                    View Groups
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}