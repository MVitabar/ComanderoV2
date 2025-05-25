import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import Link from "next/link"

interface LowStockItem {
  name: string
  current: number
  minimum: number
  unit: string
}

interface InventoryAlertsProps {
  items: LowStockItem[]
  establishmentName?: string
}

export function InventoryAlerts({ items, establishmentName }: InventoryAlertsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          Inventory Alerts
        </CardTitle>
        <CardDescription>Low stock items for {establishmentName}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 border rounded-lg border-orange-200 bg-orange-50"
            >
              <div className="space-y-1">
                <div className="font-medium">{item.name}</div>
                <div className="text-sm text-muted-foreground">
                  Minimum: {item.minimum} {item.unit}
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-orange-600">
                  {item.current} {item.unit}
                </div>
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full mt-4" asChild>
          <Link href="/dashboard/inventory">Manage inventory</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
