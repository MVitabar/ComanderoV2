"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChefHat, Plus, Settings, Users, MapPin, BarChart3, Building, LogOut } from "lucide-react"
import Link from "next/link"

export default function EstablishmentsPage() {
  const [establishments, setEstablishments] = useState([
    {
      id: "est_1",
      name: "The Golden Spoon",
      type: "Restaurant",
      address: "123 Main St, New York, NY",
      plan: "Professional",
      status: "active",
      tablesCount: 25,
      staffCount: 12,
      monthlyRevenue: 45000,
      lastAccessed: "2024-01-15T10:30:00",
    },
    {
      id: "est_2",
      name: "Café Central",
      type: "Café",
      address: "456 Oak Ave, Brooklyn, NY",
      plan: "Starter",
      status: "active",
      tablesCount: 15,
      staffCount: 6,
      monthlyRevenue: 18000,
      lastAccessed: "2024-01-14T16:45:00",
    },
    {
      id: "est_3",
      name: "Pizza Corner",
      type: "Pizzeria",
      address: "789 Pine St, Queens, NY",
      plan: "Professional",
      status: "inactive",
      tablesCount: 20,
      staffCount: 8,
      monthlyRevenue: 32000,
      lastAccessed: "2024-01-10T14:20:00",
    },
  ])

  const [showNewEstablishmentDialog, setShowNewEstablishmentDialog] = useState(false)
  const [newEstablishment, setNewEstablishment] = useState({
    name: "",
    type: "",
    address: "",
    city: "",
    country: "",
  })

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "Starter":
        return "bg-blue-100 text-blue-800"
      case "Professional":
        return "bg-green-100 text-green-800"
      case "Enterprise":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "suspended":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleCreateEstablishment = () => {
    // Handle establishment creation logic
    console.log("Creating establishment:", newEstablishment)
    setShowNewEstablishmentDialog(false)
    setNewEstablishment({ name: "", type: "", address: "", city: "", country: "" })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <ChefHat className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">Comandero</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-xs text-muted-foreground">john@example.com</p>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Your Establishments</h1>
            <p className="text-muted-foreground">Manage and access your restaurant locations</p>
          </div>
          <Dialog open={showNewEstablishmentDialog} onOpenChange={setShowNewEstablishmentDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Establishment
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>

        {/* Establishments Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {establishments.map((establishment) => (
            <Card key={establishment.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-xl">{establishment.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {establishment.address}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Badge className={getStatusColor(establishment.status)}>{establishment.status}</Badge>
                    <Badge variant="outline">{establishment.type}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">{establishment.tablesCount}</div>
                    <div className="text-xs text-muted-foreground">Tables</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{establishment.staffCount}</div>
                    <div className="text-xs text-muted-foreground">Staff</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold">{formatCurrency(establishment.monthlyRevenue)}</div>
                    <div className="text-xs text-muted-foreground">Monthly</div>
                  </div>
                </div>

                {/* Plan and Last Access */}
                <div className="flex items-center justify-between text-sm">
                  <Badge className={getPlanColor(establishment.plan)}>{establishment.plan}</Badge>
                  <span className="text-muted-foreground">Last: {formatDate(establishment.lastAccessed)}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button className="flex-1" asChild>
                    <Link href={`/dashboard?establishment=${establishment.id}`}>
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Open Dashboard
                    </Link>
                  </Button>
                  <Button variant="outline" size="icon">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Add New Establishment Card */}
          <Card className="border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer group">
            <CardContent className="flex flex-col items-center justify-center h-full min-h-[300px] text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Plus className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Add New Establishment</h3>
              <p className="text-muted-foreground text-sm mb-4">Create a new restaurant location to manage</p>
              <Button variant="outline" onClick={() => setShowNewEstablishmentDialog(true)}>
                Get Started
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Overview</h2>
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Establishments</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{establishments.length}</div>
                <p className="text-xs text-muted-foreground">
                  {establishments.filter((e) => e.status === "active").length} active
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tables</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {establishments.reduce((sum, est) => sum + est.tablesCount, 0)}
                </div>
                <p className="text-xs text-muted-foreground">Across all locations</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{establishments.reduce((sum, est) => sum + est.staffCount, 0)}</div>
                <p className="text-xs text-muted-foreground">Team members</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(establishments.reduce((sum, est) => sum + est.monthlyRevenue, 0))}
                </div>
                <p className="text-xs text-muted-foreground">Combined total</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* New Establishment Dialog */}
        <Dialog open={showNewEstablishmentDialog} onOpenChange={setShowNewEstablishmentDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Establishment</DialogTitle>
              <DialogDescription>Add a new restaurant location to your account</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Establishment Name</Label>
                <Input
                  id="name"
                  value={newEstablishment.name}
                  onChange={(e) => setNewEstablishment({ ...newEstablishment, name: e.target.value })}
                  placeholder="My Restaurant"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={newEstablishment.type}
                  onValueChange={(value) => setNewEstablishment({ ...newEstablishment, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select establishment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="restaurant">Restaurant</SelectItem>
                    <SelectItem value="cafe">Café</SelectItem>
                    <SelectItem value="bar">Bar</SelectItem>
                    <SelectItem value="fastfood">Fast Food</SelectItem>
                    <SelectItem value="pizzeria">Pizzeria</SelectItem>
                    <SelectItem value="bakery">Bakery</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={newEstablishment.address}
                  onChange={(e) => setNewEstablishment({ ...newEstablishment, address: e.target.value })}
                  placeholder="123 Main Street"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={newEstablishment.city}
                    onChange={(e) => setNewEstablishment({ ...newEstablishment, city: e.target.value })}
                    placeholder="New York"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select
                    value={newEstablishment.country}
                    onValueChange={(value) => setNewEstablishment({ ...newEstablishment, country: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="mx">Mexico</SelectItem>
                      <SelectItem value="es">Spain</SelectItem>
                      <SelectItem value="br">Brazil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setShowNewEstablishmentDialog(false)}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleCreateEstablishment}>
                  Create Establishment
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
