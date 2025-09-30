import Link from 'next/link'
import { ArrowLeft, Users, Trophy, Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const groupsData = [
  {
    id: 1,
    name: 'Morning Warriors',
    description: 'Early birds who love morning workouts',
    members: 24,
    isJoined: true,
    activity: 'Very Active',
    category: 'General Fitness'
  },
  {
    id: 2,
    name: 'Strength Squad',
    description: 'Focused on powerlifting and strength training',
    members: 18,
    isJoined: true,
    activity: 'Active',
    category: 'Strength Training'
  },
  {
    id: 3,
    name: 'Cardio Crew',
    description: 'Running, cycling, and all things cardio',
    members: 31,
    isJoined: false,
    activity: 'Very Active',
    category: 'Cardio'
  },
  {
    id: 4,
    name: 'Weekend Warriors',
    description: 'Making the most of weekend workout sessions',
    members: 15,
    isJoined: false,
    activity: 'Moderate',
    category: 'General Fitness'
  },
  {
    id: 5,
    name: 'Yoga Flow',
    description: 'Mindful movement and flexibility focus',
    members: 28,
    isJoined: true,
    activity: 'Active',
    category: 'Yoga & Flexibility'
  },
  {
    id: 6,
    name: 'HIIT Heroes',
    description: 'High intensity interval training enthusiasts',
    members: 22,
    isJoined: false,
    activity: 'Very Active',
    category: 'HIIT'
  }
]

export default function Groups() {
  const joinedGroups = groupsData.filter(group => group.isJoined)
  const availableGroups = groupsData.filter(group => !group.isJoined)

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
              <h1 className="text-xl font-bold">Groups</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Link href="/nutrition">
                <Button variant="ghost">Nutrition</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Workout Groups</h2>
              <p className="text-gray-600">Join groups and compete with fellow fitness enthusiasts</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline">
                <Search className="h-4 w-4 mr-2" />
                Search Groups
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Group
              </Button>
            </div>
          </div>

          {/* My Groups */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">My Groups ({joinedGroups.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {joinedGroups.map((group) => (
                <Card key={group.id} className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{group.name}</CardTitle>
                        <CardDescription className="mt-1">{group.description}</CardDescription>
                      </div>
                      <Badge variant="secondary">Joined</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Members</span>
                        <span className="font-medium">{group.members}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Activity</span>
                        <Badge variant={group.activity === 'Very Active' ? 'default' : 'outline'}>
                          {group.activity}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Category</span>
                        <span className="font-medium">{group.category}</span>
                      </div>
                      <div className="pt-3 space-y-2">
                        <Link href={`/groups/${group.id}/leaderboard`}>
                          <Button variant="outline" className="w-full">
                            <Trophy className="h-4 w-4 mr-2" />
                            View Leaderboard
                          </Button>
                        </Link>
                        <Button variant="outline" className="w-full">
                          <Users className="h-4 w-4 mr-2" />
                          Group Chat
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Available Groups */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Discover Groups ({availableGroups.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableGroups.map((group) => (
                <Card key={group.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{group.name}</CardTitle>
                        <CardDescription className="mt-1">{group.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Members</span>
                        <span className="font-medium">{group.members}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Activity</span>
                        <Badge variant={group.activity === 'Very Active' ? 'default' : 'outline'}>
                          {group.activity}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Category</span>
                        <span className="font-medium">{group.category}</span>
                      </div>
                      <div className="pt-3 space-y-2">
                        <Button className="w-full">
                          <Plus className="h-4 w-4 mr-2" />
                          Join Group
                        </Button>
                        <Link href={`/groups/${group.id}/leaderboard`}>
                          <Button variant="outline" className="w-full">
                            <Trophy className="h-4 w-4 mr-2" />
                            Preview Leaderboard
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}