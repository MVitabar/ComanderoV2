import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string
  change: string
  icon: LucideIcon
  trend: "up" | "down" | "neutral"
}

export function StatCard({ title, value, change, icon: Icon, trend }: StatCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground truncate pr-2">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      </CardHeader>
      <CardContent className="space-y-1">
        <div className="text-xl sm:text-2xl font-bold">{value}</div>
        <p
          className={`text-xs ${
            trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-muted-foreground"
          }`}
        >
          {change} from yesterday
        </p>
      </CardContent>
    </Card>
  )
}

interface StatsCardsProps {
  stats: StatCardProps[]
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  )
}
