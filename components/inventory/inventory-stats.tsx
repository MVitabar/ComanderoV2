import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, AlertTriangle, TrendingUp } from "lucide-react"

interface InventoryItem {
  status: string
  currentStock: number
  cost: number
}

interface InventoryStatsProps {
  items: InventoryItem[]
  categories: string[]
}

export function InventoryStats({ items, categories }: InventoryStatsProps) {
  const lowStockItems = items.filter((item) => item.status === "low")
  const totalValue = items.reduce((sum, item) => sum + item.currentStock * item.cost, 0)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const stats = [
    {
      title: "Total Items",
      value: items.length,
      description: "Across all categories",
      icon: Package,
    },
    {
      title: "Low Stock Alerts",
      value: lowStockItems.length,
      description: "Items need restocking",
      icon: AlertTriangle,
      valueColor: "text-red-600",
    },
    {
      title: "Total Value",
      value: formatCurrency(totalValue),
      description: "Current inventory value",
      icon: TrendingUp,
    },
    {
      title: "Categories",
      value: categories.length,
      description: "Product categories",
      icon: Package,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stat.valueColor || ""}`}>{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
