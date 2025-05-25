import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, ChefHat, BarChart3, Clock, TrendingUp, TrendingDown } from "lucide-react"

interface SalesData {
  revenue: number
  orders: number
  avgOrder: number
  growth: number
}

interface KeyMetricsProps {
  data: SalesData
}

export function KeyMetrics({ data }: KeyMetricsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const metrics = [
    {
      title: "Revenue",
      value: formatCurrency(data.revenue),
      change: `+${data.growth}% from last period`,
      icon: DollarSign,
      trend: "up",
    },
    {
      title: "Orders",
      value: data.orders.toString(),
      change: "+8.2% from last period",
      icon: ChefHat,
      trend: "up",
    },
    {
      title: "Avg Order Value",
      value: formatCurrency(data.avgOrder),
      change: "-2.1% from last period",
      icon: BarChart3,
      trend: "down",
    },
    {
      title: "Avg Service Time",
      value: "18 min",
      change: "-2 min improvement",
      icon: Clock,
      trend: "up",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
            <metric.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className={`text-xs flex items-center ${metric.trend === "up" ? "text-green-600" : "text-red-600"}`}>
              {metric.trend === "up" ? (
                <TrendingUp className="w-3 h-3 mr-1" />
              ) : (
                <TrendingDown className="w-3 h-3 mr-1" />
              )}
              {metric.change}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
