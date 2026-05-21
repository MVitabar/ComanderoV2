"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, ChefHat, CheckCircle, AlertTriangle, Coffee } from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { useAuth } from "@/hooks/use-auth"

export default function KitchenPage() {
  const { user } = useAuth()
  const [kitchenOrders, setKitchenOrders] = useState<any[]>([])
  const [barOrders, setBarOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.establishment_id) return

      setIsLoading(true)
      try {
        const { OrderService } = await import('@/lib/supabase/orders')

        // Obtener órdenes pendientes y en preparación
        const orders = await OrderService.getOrdersByStatus(user.establishment_id, 'pending')
        const preparingOrders = await OrderService.getOrdersByStatus(user.establishment_id, 'preparing')
        const readyOrders = await OrderService.getOrdersByStatus(user.establishment_id, 'ready')

        // Separar por tipo (kitchen vs bar) - simplificado
        const allOrders = [...orders, ...preparingOrders, ...readyOrders]

        setKitchenOrders(allOrders.slice(0, 10)) // Primeras 10 para kitchen
        setBarOrders(allOrders.slice(10, 20)) // Siguientes 10 para bar
      } catch (error) {
        console.error('Error loading kitchen orders:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [user?.establishment_id])

  const updateKitchenOrderStatus = (orderId: string, newStatus: string) => {
    setKitchenOrders((orders) =>
      orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)),
    )
  }

  const updateBarOrderStatus = (orderId: string, newStatus: string) => {
    setBarOrders((orders) => orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
  }

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <div className="flex-1">
            <header className="flex h-16 items-center gap-4 border-b bg-background px-6">
              <SidebarTrigger />
              <div className="flex-1">
                <h1 className="text-2xl font-semibold">Kitchen Display</h1>
              </div>
            </header>
            <main className="flex-1 p-6">
              <div className="animate-pulse space-y-6">
                <div className="h-96 bg-gray-200 rounded-lg" />
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    )
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "normal":
        return "bg-blue-100 text-blue-800"
      case "low":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "high":
        return "Alta"
      case "normal":
        return "Normal"
      case "low":
        return "Baja"
      default:
        return priority
    }
  }

  const getTimeColor = (timeElapsed: number, estimatedTime: number) => {
    const percentage = (timeElapsed / estimatedTime) * 100
    if (percentage >= 100) return "text-red-600"
    if (percentage >= 80) return "text-orange-600"
    return "text-green-600"
  }

  const formatTime = (minutes: number) => {
    return `${minutes} min`
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1">
          <header className="flex h-16 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger />
            <div className="flex-1">
              <h1 className="text-2xl font-semibold">Vista de Cocina y Barra</h1>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-green-600 border-green-600">
                Sistema activo
              </Badge>
            </div>
          </header>

          <main className="flex-1 p-6">
            <Tabs defaultValue="kitchen" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="kitchen" className="flex items-center gap-2">
                  <ChefHat className="w-4 h-4" />
                  Cocina ({kitchenOrders.length})
                </TabsTrigger>
                <TabsTrigger value="bar" className="flex items-center gap-2">
                  <Coffee className="w-4 h-4" />
                  Barra ({barOrders.length})
                </TabsTrigger>
              </TabsList>

              {/* Kitchen Tab */}
              <TabsContent value="kitchen" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {kitchenOrders.map((order) => (
                    <Card key={order.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{order.id}</CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">Mesa {order.table}</Badge>
                            <Badge className={getPriorityColor(order.priority)}>
                              {getPriorityText(order.priority)}
                            </Badge>
                          </div>
                        </div>
                        <CardDescription className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span className={getTimeColor(order.timeElapsed, order.estimatedTime)}>
                            {formatTime(order.timeElapsed)} / {formatTime(order.estimatedTime)}
                          </span>
                          {order.timeElapsed >= order.estimatedTime && (
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                          )}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Order Items */}
                        <div className="space-y-2">
                          {order.items.map((item, index) => (
                            <div key={index} className="p-3 bg-muted/50 rounded-lg">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium">
                                  {item.quantity}x {item.name}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {item.station}
                                </Badge>
                              </div>
                              {item.notes && <div className="text-sm text-muted-foreground">📝 {item.notes}</div>}
                            </div>
                          ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          {order.status === "pending" && (
                            <Button className="flex-1" onClick={() => updateKitchenOrderStatus(order.id, "preparing")}>
                              Iniciar Preparación
                            </Button>
                          )}

                          {order.status === "preparing" && (
                            <Button className="flex-1" onClick={() => updateKitchenOrderStatus(order.id, "ready")}>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Marcar Listo
                            </Button>
                          )}
                        </div>

                        {/* Waiter Info */}
                        <div className="text-sm text-muted-foreground border-t pt-2">Mesero: {order.waiter}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {kitchenOrders.length === 0 && (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center py-8">
                        <ChefHat className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No hay órdenes en cocina</h3>
                        <p className="text-muted-foreground">Todas las órdenes han sido completadas</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Bar Tab */}
              <TabsContent value="bar" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {barOrders.map((order) => (
                    <Card key={order.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{order.id}</CardTitle>
                          <Badge variant="outline">Mesa {order.table}</Badge>
                        </div>
                        <CardDescription className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span className={getTimeColor(order.timeElapsed, order.estimatedTime)}>
                            {formatTime(order.timeElapsed)} / {formatTime(order.estimatedTime)}
                          </span>
                          {order.timeElapsed >= order.estimatedTime && (
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                          )}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Order Items */}
                        <div className="space-y-2">
                          {order.items.map((item, index) => (
                            <div key={index} className="p-3 bg-muted/50 rounded-lg">
                              <div className="font-medium">
                                {item.quantity}x {item.name}
                              </div>
                              {item.notes && <div className="text-sm text-muted-foreground">📝 {item.notes}</div>}
                            </div>
                          ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          {order.status === "pending" && (
                            <Button className="flex-1" onClick={() => updateBarOrderStatus(order.id, "preparing")}>
                              Iniciar Preparación
                            </Button>
                          )}

                          {order.status === "preparing" && (
                            <Button className="flex-1" onClick={() => updateBarOrderStatus(order.id, "ready")}>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Marcar Listo
                            </Button>
                          )}

                          {order.status === "ready" && (
                            <Badge className="flex-1 justify-center py-2 bg-green-100 text-green-800">
                              ✅ Listo para servir
                            </Badge>
                          )}
                        </div>

                        {/* Waiter Info */}
                        <div className="text-sm text-muted-foreground border-t pt-2">Mesero: {order.waiter}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {barOrders.length === 0 && (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center py-8">
                        <Coffee className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No hay órdenes en barra</h3>
                        <p className="text-muted-foreground">Todas las bebidas han sido preparadas</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
