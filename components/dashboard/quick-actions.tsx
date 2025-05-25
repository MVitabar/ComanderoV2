import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, ChefHat, Package, BarChart3 } from "lucide-react"
import Link from "next/link"

interface QuickActionsProps {
  establishmentName?: string
}

export function QuickActions({ establishmentName }: QuickActionsProps) {
  const actions = [
    {
      href: "/dashboard/tables",
      icon: MapPin,
      label: "View Tables",
    },
    {
      href: "/dashboard/orders",
      icon: ChefHat,
      label: "New Order",
    },
    {
      href: "/dashboard/inventory",
      icon: Package,
      label: "Inventory",
    },
    {
      href: "/dashboard/reports",
      icon: BarChart3,
      label: "Reports",
    },
  ]

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg sm:text-xl">Quick Actions</CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Access frequently used functions for {establishmentName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {actions.map((action) => (
            <Button
              key={action.href}
              className="h-16 sm:h-20 flex-col gap-2 text-xs sm:text-sm font-medium"
              variant="outline"
              asChild
            >
              <Link href={action.href}>
                <action.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="text-center leading-tight">{action.label}</span>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
