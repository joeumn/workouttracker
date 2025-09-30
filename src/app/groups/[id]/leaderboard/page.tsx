import Link from 'next/link'
import { ArrowLeft, Trophy, Medal, Award, TrendingUp, Users, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

// Mock data for the leaderboard
const leaderboardData = [
  {
    rank: 1,
    name: 'Alex Johnson',
    points: 2840,
    workouts: 28,
    streak: 14,
    lastActive: '2 hours ago',
    change: '+2'
  },
  {
    rank: 2,
    name: 'Sarah Chen',
    points: 2750,
    workouts: 26,
    streak: 12,
    lastActive: '4 hours ago',
    change: '0'
  },
  {
    rank: 3,
    name: 'Mike Rodriguez',
    points: 2680,
    workouts: 25,
    streak: 8,
    lastActive: '1 day ago',
    change: '+1'
  },
  {
    rank: 4,
    name: 'Emily Davis',
    points: 2590,
    workouts: 24,
    streak: 15,
    lastActive: '3 hours ago',
    change: '-1'
  },
  {
    rank: 5,
    name: 'You',
    points: 2520,
    workouts: 23,
    streak: 12,
    lastActive: 'Now',
    change: '+3',
    isCurrentUser: true
  },
  {
    rank: 6,
    name: 'David Kim',
    points: 2450,
    workouts: 22,
    streak: 6,
    lastActive: '5 hours ago',
    change: '-2'
  },
  {
    rank: 7,
    name: 'Lisa Wilson',
    points: 2380,
    workouts: 21,
    streak: 9,
    lastActive: '1 day ago',
    change: '0'
  },
  {
    rank: 8,
    name: 'Tom Brown',
    points: 2310,
    workouts: 20,
    streak: 4,
    lastActive: '2 days ago',
    change: '+1'
  }
]

const groupInfo = {
  name: 'Morning Warriors',
  description: 'Early birds who love morning workouts',
  members: 24,
  category: 'General Fitness'
}

export default async function GroupLeaderboard({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />
      default:
        return <span className="text-lg font-bold">{rank}</span>
    }
  }

  const getChangeIndicator = (change: string) => {
    if (change === '0') return null
    if (change.startsWith('+')) {
      return <span className="text-green-600 text-sm">↗ {change}</span>
    }
    return <span className="text-red-600 text-sm">↘ {change}</span>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/groups" className="mr-4">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Groups
                </Button>
              </Link>
              <h1 className="text-xl font-bold">Leaderboard</h1>
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
          {/* Group Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{groupInfo.name}</h2>
                <p className="text-gray-600 mb-4">{groupInfo.description}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {groupInfo.members} members
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Weekly Challenge
                  </div>
                  <Badge>{groupInfo.category}</Badge>
                </div>
              </div>
              <Button>
                <TrendingUp className="h-4 w-4 mr-2" />
                View Stats
              </Button>
            </div>
          </div>

          {/* Top 3 Podium */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {leaderboardData.slice(0, 3).map((user, index) => (
              <Card key={user.rank} className={`${index === 0 ? 'border-yellow-200 bg-yellow-50' : index === 1 ? 'border-gray-200 bg-gray-50' : 'border-amber-200 bg-amber-50'}`}>
                <CardHeader className="text-center pb-2">
                  <div className="flex justify-center mb-2">
                    {getRankIcon(user.rank)}
                  </div>
                  <CardTitle className="text-lg">{user.name}</CardTitle>
                  <CardDescription>Rank #{user.rank}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-2xl font-bold mb-2">{user.points.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground mb-3">points</div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Workouts:</span>
                      <span className="font-medium">{user.workouts}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Streak:</span>
                      <span className="font-medium">{user.streak} days</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Full Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle>Full Leaderboard</CardTitle>
              <CardDescription>Weekly rankings based on workout points and consistency</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Rank</TableHead>
                    <TableHead>Member</TableHead>
                    <TableHead>Points</TableHead>
                    <TableHead>Workouts</TableHead>
                    <TableHead>Streak</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Change</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaderboardData.map((user) => (
                    <TableRow 
                      key={user.rank} 
                      className={user.isCurrentUser ? 'bg-blue-50 border-blue-200' : ''}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center justify-center">
                          {getRankIcon(user.rank)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div>
                            <div className="font-medium">{user.name}</div>
                            {user.isCurrentUser && (
                              <Badge variant="secondary" className="mt-1">You</Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-bold">
                        {user.points.toLocaleString()}
                      </TableCell>
                      <TableCell>{user.workouts}</TableCell>
                      <TableCell>
                        <Badge variant={user.streak >= 10 ? 'default' : 'outline'}>
                          {user.streak} days
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.lastActive}
                      </TableCell>
                      <TableCell>
                        {getChangeIndicator(user.change)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Challenge Info */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>This Week&apos;s Challenge</CardTitle>
              <CardDescription>Compete for the top spot and earn bonus points</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">5 days</div>
                  <div className="text-sm text-muted-foreground">Time remaining</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">500</div>
                  <div className="text-sm text-muted-foreground">Bonus points for #1</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">3x</div>
                  <div className="text-sm text-muted-foreground">Weekend multiplier</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}