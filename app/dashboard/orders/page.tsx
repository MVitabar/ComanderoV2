"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Search, Clock, ChefHat, Eye, Edit, Send, CheckCircle, XCircle } from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export default function OrdersPage() {
  const [orders, setOrders] = useState<Array<{
    id: string;
    table: number;
    waiter: string;
    status: 'pending' | 'preparing' | 'ready' | 'served' | 'cancelled';
    items: Array<{
      name: string;
      quantity: number;
      price: number;
      notes: string;
    }>;
    total: number;
    createdAt: string;
    estimatedTime: string;
  }>>([])

  const [isLoading, setIsLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [showNewOrderDialog, setShowNewOrderDialog] = useState(false)

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true)
      try {
        // Aquí iría la llamada a tu API para obtener las órdenes
        // const response = await fetch('/api/orders');
        // const data = await response.json();
        // setOrders(data);
      } catch (error) {
        console.error('Error loading orders:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
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
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendiente"
      case "preparing":
        return "Preparando"
      case "ready":
        return "Listo"
      case "served":
        return "Servido"
      case "cancelled":
        return "Cancelado"
      default:
        return status
    }
  }

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = filterStatus === "all" || order.status === filterStatus
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.table.toString().includes(searchTerm) ||
      order.waiter.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
  }

  const getTimeElapsed = (dateString: string) => {
    const now = new Date()
    const created = new Date(dateString)
    const diffMinutes = Math.floor((now.getTime() - created.getTime()) / (1000 * 60))
    return `${diffMinutes} min`
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1">
          <header className="flex h-16 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger />
            <div className="flex-1">
              <h1 className="text-2xl font-semibold">Gestión de Comandas</h1>
            </div>
            <Dialog open={showNewOrderDialog} onOpenChange={setShowNewOrderDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Comanda
                </Button>
              </DialogTrigger>
            </Dialog>
          </header>

          <main className="flex-1 p-6 space-y-6">
            {/* Filters and Search */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Buscar por ID, mesa o mesero..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Filtrar por estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los estados</SelectItem>
                      <SelectItem value="pending">Pendiente</SelectItem>
                      <SelectItem value="preparing">Preparando</SelectItem>
                      <SelectItem value="ready">Listo</SelectItem>
                      <SelectItem value="served">Servido</SelectItem>
                      <SelectItem value="cancelled">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Orders List */}
            <div className="grid gap-4">
              {filteredOrders.map((order) => (
                <Card key={order.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <CardTitle className="text-lg">{order.id}</CardTitle>
                        <Badge variant="outline">Mesa {order.table}</Badge>
                        <Badge className={getStatusColor(order.status)}>{getStatusText(order.status)}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          <Clock className="w-4 h-4 inline mr-1" />
                          {getTimeElapsed(order.createdAt)}
                        </span>
                        <span className="text-lg font-semibold">${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                    <CardDescription>
                      Mesero: {order.waiter} • Creado: {formatTime(order.createdAt)} • Tiempo estimado:{" "}
                      {order.estimatedTime}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Order Items */}
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                            <div className="flex-1">
                              <span className="font-medium">
                                {item.quantity}x {item.name}
                              </span>
                              {item.notes && <div className="text-sm text-muted-foreground">Nota: {item.notes}</div>}
                            </div>
                            <span className="font-medium">${(item.quantity * item.price).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        {order.status === "pending" && (
                          <>
                            <Button size="sm" onClick={() => updateOrderStatus(order.id, "preparing")}>
                              <Send className="w-4 h-4 mr-2" />
                              Enviar a Cocina
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4 mr-2" />
                              Editar
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => updateOrderStatus(order.id, "cancelled")}
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Cancelar
                            </Button>
                          </>
                        )}

                        {order.status === "preparing" && (
                          <Button size="sm" onClick={() => updateOrderStatus(order.id, "ready")}>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Marcar como Listo
                          </Button>
                        )}

                        {order.status === "ready" && (
                          <Button size="sm" onClick={() => updateOrderStatus(order.id, "served")}>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Marcar como Servido
                          </Button>
                        )}

                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          Ver Detalles
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredOrders.length === 0 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <ChefHat className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No hay comandas</h3>
                    <p className="text-muted-foreground">
                      {searchTerm || filterStatus !== "all"
                        ? "No se encontraron comandas con los filtros aplicados"
                        : "No hay comandas activas en este momento"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* New Order Dialog */}
            <Dialog open={showNewOrderDialog} onOpenChange={setShowNewOrderDialog}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Nueva Comanda</DialogTitle>
                  <DialogDescription>Crear una nueva comanda para el restaurante</DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="table">Mesa</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar mesa" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Mesa 1</SelectItem>
                          <SelectItem value="2">Mesa 2</SelectItem>
                          <SelectItem value="3">Mesa 3</SelectItem>
                          <SelectItem value="4">Mesa 4</SelectItem>
                          <SelectItem value="5">Mesa 5</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="waiter">Mesero</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar mesero" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="juan">Juan Pérez</SelectItem>
                          <SelectItem value="maria">María García</SelectItem>
                          <SelectItem value="carlos">Carlos López</SelectItem>
                          <SelectItem value="ana">Ana Martín</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Items de la comanda</Label>
                    <div className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center gap-4">
                        <Select>
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Seleccionar producto" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hamburguesa">Hamburguesa Clásica - $12.50</SelectItem>
                            <SelectItem value="pizza">Pizza Margherita - $15.00</SelectItem>
                            <SelectItem value="ensalada">Ensalada César - $8.50</SelectItem>
                            <SelectItem value="papas">Papas Fritas - $5.00</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input type="number" placeholder="Cant." className="w-20" min="1" />
                        <Button size="sm">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" className="flex-1" onClick={() => setShowNewOrderDialog(false)}>
                      Cancelar
                    </Button>
                    <Button className="flex-1">Crear Comanda</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
