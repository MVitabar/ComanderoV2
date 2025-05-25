"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DollarSign, ChefHat, Clock, MapPin, Building } from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { useSearchParams } from "next/navigation"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { RecentOrders } from "@/components/dashboard/recent-orders"
import { InventoryAlerts } from "@/components/dashboard/inventory-alerts"
import { QuickActions } from "@/components/dashboard/quick-actions"

export default function Dashboard() {
  const searchParams = useSearchParams()
  const [selectedEstablishment, setSelectedEstablishment] = useState("")
  const [establishments, setEstablishments] = useState<Array<{id: string, name: string, type: string}>>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<Array<{
    title: string;
    value: string;
    change: string;
    icon: any;
    trend: 'up' | 'down' | 'neutral';
  }>>([])
  const [recentOrders, setRecentOrders] = useState<Array<any>>([])
  const [lowStockItems, setLowStockItems] = useState<Array<any>>([])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Aquí iría la llamada a tu API para obtener los establecimientos
        // const response = await fetch('/api/establishments')
        // const data = await response.json()
        // setEstablishments(data)
        
        // Si no hay establecimientos, establecer un estado vacío
        setEstablishments([])
        
        // Cargar estadísticas
        // const statsResponse = await fetch('/api/dashboard/stats')
        // setStats(await statsResponse.json())
        
        // Cargar órdenes recientes
        // const ordersResponse = await fetch('/api/orders/recent')
        // setRecentOrders(await ordersResponse.json())
        
        // Cargar artículos con bajo stock
        // const inventoryResponse = await fetch('/api/inventory/low-stock')
        // setLowStockItems(await inventoryResponse.json())
        
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [])

  useEffect(() => {
    const establishmentId = searchParams.get("establishment")
    if (establishmentId && establishments.length > 0) {
      setSelectedEstablishment(establishmentId)
    } else if (establishments.length > 0) {
      setSelectedEstablishment(establishments[0]?.id || "")
    }
  }, [searchParams, establishments])

  const currentEstablishment = establishments.find((est) => est.id === selectedEstablishment)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1">
          {/* Mobile-First Header */}
          <header className="flex h-14 sm:h-16 items-center gap-2 sm:gap-4 border-b bg-background px-3 sm:px-6">
            <SidebarTrigger />
            <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 min-w-0">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold truncate">Dashboard</h1>
              {/* Mobile-First Establishment Selector */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Building className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <Select value={selectedEstablishment} onValueChange={setSelectedEstablishment}>
                  <SelectTrigger className="w-full sm:w-48 h-8 sm:h-10 text-xs sm:text-sm">
                    <SelectValue placeholder="Select establishment" />
                  </SelectTrigger>
                  <SelectContent>
                    {establishments.map((establishment) => (
                      <SelectItem key={establishment.id} value={establishment.id}>
                        <span className="truncate">{establishment.name}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge variant="outline" className="text-green-600 border-green-600 text-xs px-2 py-1">
                Online
              </Badge>
              {currentEstablishment && (
                <Badge variant="secondary" className="hidden sm:inline-flex text-xs">
                  {currentEstablishment.type}
                </Badge>
              )}
            </div>
          </header>

          <main className="flex-1 p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
            {/* Mobile-First Establishment Context Alert */}
            {currentEstablishment && (
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="pt-4 sm:pt-6">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <Building className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                      <span className="font-medium text-sm sm:text-base truncate">
                        You are viewing data for:{" "}
                        <strong className="block sm:inline">{currentEstablishment.name}</strong>
                      </span>
                    </div>
                    <Badge variant="outline" className="self-start sm:self-center text-xs">
                      {currentEstablishment.type}
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    All data and actions are isolated to this establishment only.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Mobile-First Stats Cards */}
            <StatsCards stats={stats} />

            {/* Mobile-First Grid Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
              {/* Recent Orders */}
              <RecentOrders orders={recentOrders} establishmentName={currentEstablishment?.name} />

              {/* Low Stock Alert */}
              <InventoryAlerts items={lowStockItems} establishmentName={currentEstablishment?.name} />
            </div>

            {/* Quick Actions */}
            <QuickActions establishmentName={currentEstablishment?.name} />
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
