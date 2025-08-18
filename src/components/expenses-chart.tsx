"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { month: "Janvier", desktop: 18600 },
  { month: "Février", desktop: 30500 },
  { month: "Mars", desktop: 23700 },
  { month: "Avril", desktop: 7300 },
  { month: "Mai", desktop: 20900 },
  { month: "Juin", desktop: 21400 },
]

const chartConfig = {
  desktop: {
    label: "Dépenses",
    color: "hsl(var(--primary))",
  },
}

export default function ExpensesChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Aperçu des Dépenses</CardTitle>
        <CardDescription>Janvier - Juin 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              tickFormatter={(value) => `${Number(value) / 1000}k`}
              tickLine={false}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent
                  formatter={(value) => `${Number(value).toLocaleString('fr-FR')} FCFA`}
                  indicator="dot" 
              />}
            />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Les dépenses sont en baisse de 5,2% ce mois-ci <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Par rapport à Mai.
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
