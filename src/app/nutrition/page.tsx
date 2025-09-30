import Link from 'next/link'
import { ArrowLeft, Plus, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { MacroTable } from '@/components/nutrition/macro-table'
import { ProteinWeeklyChart } from '@/components/nutrition/protein-weekly-chart'

export default function Nutrition() {
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
              <h1 className="text-xl font-bold">Nutrition</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
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
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Nutrition Tracking</h2>
              <p className="text-gray-600">Monitor your macros and protein intake</p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Food
            </Button>
          </div>

          {/* Today's Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Calories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,847</div>
                <p className="text-xs text-muted-foreground">
                  of 2,200 goal
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{width: '84%'}}></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Protein</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">89g</div>
                <p className="text-xs text-muted-foreground">
                  of 120g goal
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{width: '74%'}}></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Carbs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">205g</div>
                <p className="text-xs text-muted-foreground">
                  of 250g goal
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-orange-600 h-2 rounded-full" style={{width: '82%'}}></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Fat</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">67g</div>
                <p className="text-xs text-muted-foreground">
                  of 75g goal
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{width: '89%'}}></div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Macro Table and Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <MacroTable />
            <ProteinWeeklyChart />
          </div>

          {/* Recent Meals */}
          <Card>
            <CardHeader>
              <CardTitle>Today&apos;s Meals</CardTitle>
              <CardDescription>Track your daily food intake</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Meal</TableHead>
                    <TableHead>Food</TableHead>
                    <TableHead>Calories</TableHead>
                    <TableHead>Protein</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Breakfast</TableCell>
                    <TableCell>Oatmeal with berries</TableCell>
                    <TableCell>320</TableCell>
                    <TableCell>12g</TableCell>
                    <TableCell>7:30 AM</TableCell>
                    <TableCell><Badge>Logged</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Snack</TableCell>
                    <TableCell>Greek yogurt</TableCell>
                    <TableCell>150</TableCell>
                    <TableCell>20g</TableCell>
                    <TableCell>10:15 AM</TableCell>
                    <TableCell><Badge>Logged</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Lunch</TableCell>
                    <TableCell>Chicken salad bowl</TableCell>
                    <TableCell>520</TableCell>
                    <TableCell>35g</TableCell>
                    <TableCell>12:45 PM</TableCell>
                    <TableCell><Badge>Logged</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Snack</TableCell>
                    <TableCell>Protein shake</TableCell>
                    <TableCell>180</TableCell>
                    <TableCell>25g</TableCell>
                    <TableCell>3:20 PM</TableCell>
                    <TableCell><Badge>Logged</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Dinner</TableCell>
                    <TableCell>Salmon with quinoa</TableCell>
                    <TableCell>677</TableCell>
                    <TableCell>42g</TableCell>
                    <TableCell>7:00 PM</TableCell>
                    <TableCell><Badge variant="secondary">Planned</Badge></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}