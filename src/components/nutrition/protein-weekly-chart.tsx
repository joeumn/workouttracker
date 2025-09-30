'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const proteinData = [
  { day: 'Mon', protein: 95, goal: 120 },
  { day: 'Tue', protein: 110, goal: 120 },
  { day: 'Wed', protein: 87, goal: 120 },
  { day: 'Thu', protein: 125, goal: 120 },
  { day: 'Fri', protein: 92, goal: 120 },
  { day: 'Sat', protein: 108, goal: 120 },
  { day: 'Today', protein: 89, goal: 120 }
]

export function ProteinWeeklyChart() {
  const averageProtein = Math.round(proteinData.reduce((sum, day) => sum + day.protein, 0) / proteinData.length)
  const daysOnTarget = proteinData.filter(day => day.protein >= day.goal).length

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Protein Trend</CardTitle>
        <CardDescription>Track your protein intake over the past week</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={proteinData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="day" 
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                domain={['dataMin - 10', 'dataMax + 10']}
              />
              <Tooltip 
                formatter={(value, name) => [
                  `${value}g`, 
                  name === 'protein' ? 'Protein Intake' : 'Daily Goal'
                ]}
                labelFormatter={(label) => `Day: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="goal" 
                stroke="#94a3b8" 
                strokeDasharray="5 5"
                dot={false}
                name="goal"
              />
              <Line 
                type="monotone" 
                dataKey="protein" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                name="protein"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{averageProtein}g</div>
            <div className="text-sm text-muted-foreground">Weekly Average</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{daysOnTarget}/7</div>
            <div className="text-sm text-muted-foreground">Days on Target</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}