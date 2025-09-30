'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

const macroData = [
  {
    name: 'Protein',
    current: 89,
    goal: 120,
    unit: 'g',
    color: 'bg-green-500',
    percentage: 74
  },
  {
    name: 'Carbohydrates',
    current: 205,
    goal: 250,
    unit: 'g',
    color: 'bg-orange-500',
    percentage: 82
  },
  {
    name: 'Fat',
    current: 67,
    goal: 75,
    unit: 'g',
    color: 'bg-purple-500',
    percentage: 89
  },
  {
    name: 'Fiber',
    current: 28,
    goal: 35,
    unit: 'g',
    color: 'bg-blue-500',
    percentage: 80
  }
]

export function MacroTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Macro Breakdown</CardTitle>
        <CardDescription>Daily macronutrient targets and progress</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nutrient</TableHead>
              <TableHead>Current</TableHead>
              <TableHead>Goal</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {macroData.map((macro) => (
              <TableRow key={macro.name}>
                <TableCell className="font-medium">{macro.name}</TableCell>
                <TableCell>
                  {macro.current}{macro.unit}
                </TableCell>
                <TableCell>
                  {macro.goal}{macro.unit}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${macro.color}`}
                        style={{width: `${Math.min(macro.percentage, 100)}%`}}
                      ></div>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {macro.percentage}%
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={macro.percentage >= 90 ? 'default' : macro.percentage >= 70 ? 'secondary' : 'outline'}
                  >
                    {macro.percentage >= 90 ? 'Excellent' : macro.percentage >= 70 ? 'Good' : 'Needs Work'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}