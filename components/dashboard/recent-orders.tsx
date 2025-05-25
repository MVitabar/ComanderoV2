import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChefHat } from "lucide-react"
import Link from "next/link"

interface Order {
  id: string
  table: string
  items: number
  total: string
  status: string
  time: string
}

interface RecentOrdersProps {
  orders: Order[]
  establishmentName?: string
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "preparing":
      return "bg-blue-100 text-blue-800"
    case "ready":
      return "bg-green-100 text-green-800"
    case "served":
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case "pending":
      return "Pending"
    case "preparing":
      return "Preparing"
    case "ready":
      return "Ready"
    case "served":
      return "Served"
    default:
      return status
  }
}

export function RecentOrders({ orders, establishmentName }: RecentOrdersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ChefHat className="h-5 w-5" />
          Recent Orders
        </CardTitle>
        <CardDescription>Latest orders for {establishmentName}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{order.id}</span>
                  <Badge variant="outline">{order.table}</Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {order.items} items • {order.total}
                </div>
              </div>
              <div className="text-right space-y-1">
                <Badge className={getStatusColor(order.status)}>{getStatusText(order.status)}</Badge>
                <div className="text-xs text-muted-foreground">{order.time}</div>
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full mt-4" asChild>
          <Link href="/dashboard/orders">View all orders</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
