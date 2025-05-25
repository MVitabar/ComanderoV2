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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, AlertTriangle, Edit, Trash2, Download, Upload } from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { InventoryStats } from "@/components/inventory/inventory-stats"

export default function InventoryPage() {
  const [inventoryItems, setInventoryItems] = useState<Array<{
    id: string;
    name: string;
    category: string;
    currentStock: number;
    minimumStock: number;
    unit: string;
    price: number;
    supplier: string;
    lastUpdated: string;
  }>>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showAddItemDialog, setShowAddItemDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  useEffect(() => {
    const fetchInventoryData = async () => {
      setIsLoading(true);
      try {
        // Aquí irían las llamadas a la API para obtener los datos
        // const [itemsResponse, categoriesResponse] = await Promise.all([
        //   fetch('/api/inventory/items'),
        //   fetch('/api/inventory/categories')
        // ]);
        // 
        // const itemsData = await itemsResponse.json();
        // const categoriesData = await categoriesResponse.json();
        // 
        // setInventoryItems(itemsData);
        // setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading inventory data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInventoryData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "low":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "good":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "low":
        return "Low Stock"
      case "medium":
        return "Medium Stock"
      case "good":
        return "Good Stock"
      default:
        return status
    }
  }

  const calculateStatus = (current: number, minimum: number) => {
    if (current <= minimum) return "low"
    if (current <= minimum * 1.5) return "medium"
    return "good"
  }

  const filteredItems = inventoryItems.filter((item) => {
    const matchesCategory = filterCategory === "all" || item.category === filterCategory
    const matchesStatus = filterStatus === "all" || item.status === filterStatus
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesStatus && matchesSearch
  })

  const handleAddItem = () => {
    const status = calculateStatus(newItem.currentStock, newItem.minimumStock)
    const item = {
      id: inventoryItems.length + 1,
      ...newItem,
      status,
      lastUpdated: new Date().toISOString(),
    }
    setInventoryItems([...inventoryItems, item])
    setNewItem({
      name: "",
      category: "",
      currentStock: 0,
      minimumStock: 0,
      unit: "",
      cost: 0,
      supplier: "",
    })
    setShowAddItemDialog(false)
  }

  const handleEditItem = () => {
    if (!selectedItem) return

    const status = calculateStatus(selectedItem.currentStock, selectedItem.minimumStock)
    const updatedItems = inventoryItems.map((item) =>
      item.id === selectedItem.id ? { ...selectedItem, status, lastUpdated: new Date().toISOString() } : item,
    )
    setInventoryItems(updatedItems)
    setShowEditDialog(false)
    setSelectedItem(null)
  }

  const handleDeleteItem = (itemId: number) => {
    setInventoryItems(inventoryItems.filter((item) => item.id !== itemId))
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

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1">
          <header className="flex h-16 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger />
            <div className="flex-1">
              <h1 className="text-2xl font-semibold">Inventory Management</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
              <Dialog open={showAddItemDialog} onOpenChange={setShowAddItemDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Item
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>
          </header>

          <main className="flex-1 p-6 space-y-6">
            {/* Stats Overview */}
            <InventoryStats items={inventoryItems} categories={categories} />

            <Tabs defaultValue="inventory" className="space-y-6">
              <TabsList>
                <TabsTrigger value="inventory">Inventory</TabsTrigger>
                <TabsTrigger value="alerts">Low Stock Alerts</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
              </TabsList>

              <TabsContent value="inventory" className="space-y-6">
                {/* Filters */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                          <Input
                            placeholder="Search items or suppliers..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <Select value={filterCategory} onValueChange={setFilterCategory}>
                        <SelectTrigger className="w-full md:w-48">
                          <SelectValue placeholder="Filter by category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-full md:w-48">
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="low">Low Stock</SelectItem>
                          <SelectItem value="medium">Medium Stock</SelectItem>
                          <SelectItem value="good">Good Stock</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Inventory Table */}
                <Card>
                  <CardHeader>
                    <CardTitle>Inventory Items</CardTitle>
                    <CardDescription>Manage your restaurant inventory and stock levels</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                        >
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-3">
                              <h3 className="font-medium">{item.name}</h3>
                              <Badge variant="outline">{item.category}</Badge>
                              <Badge className={getStatusColor(item.status)}>{getStatusText(item.status)}</Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Supplier: {item.supplier} • Last updated: {formatDate(item.lastUpdated)}
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="text-center">
                              <div className="text-lg font-semibold">
                                {item.currentStock} {item.unit}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Min: {item.minimumStock} {item.unit}
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-semibold">{formatCurrency(item.price)}</div>
                              <div className="text-xs text-muted-foreground">per {item.unit}</div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setCurrentItem(item)
                                  setShowEditDialog(true)
                                }}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleDeleteItem(item.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="alerts" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      Low Stock Alerts
                    </CardTitle>
                    <CardDescription>Items that need immediate attention</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {inventoryItems
                        .filter((item) => item.status === "low")
                        .map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-4 border border-red-200 bg-red-50 rounded-lg"
                          >
                            <div className="space-y-1">
                              <h3 className="font-medium">{item.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                Current: {item.currentStock} {item.unit} • Minimum: {item.minimumStock} {item.unit}
                              </p>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <div className="text-lg font-semibold text-red-600">
                                  {item.currentStock} {item.unit}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Need {item.minimumStock - item.currentStock} more
                                </div>
                              </div>
                              <Button size="sm">Reorder</Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reports" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Stock by Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {categories.map((category) => {
                          const categoryItems = inventoryItems.filter((item) => item.category === category)
                          const categoryValue = categoryItems.reduce(
                            (sum, item) => sum + item.currentStock * item.price,
                            0,
                          )
                          return (
                            <div key={category} className="flex items-center justify-between">
                              <span className="font-medium">{category}</span>
                              <div className="text-right">
                                <div className="font-semibold">{formatCurrency(categoryValue)}</div>
                                <div className="text-xs text-muted-foreground">{categoryItems.length} items</div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Top Suppliers</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {Array.from(new Set(inventoryItems.map((item) => item.supplier))).map((supplier) => {
                          const supplierItems = inventoryItems.filter((item) => item.supplier === supplier)
                          const supplierValue = supplierItems.reduce(
                            (sum, item) => sum + item.currentStock * item.price,
                            0,
                          )
                          return (
                            <div key={supplier} className="flex items-center justify-between">
                              <span className="font-medium">{supplier}</span>
                              <div className="text-right">
                                <div className="font-semibold">{formatCurrency(supplierValue)}</div>
                                <div className="text-xs text-muted-foreground">{supplierItems.length} items</div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>

            {/* Add Item Dialog */}
            <Dialog open={showAddItemDialog} onOpenChange={setShowAddItemDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Inventory Item</DialogTitle>
                  <DialogDescription>Add a new item to your inventory</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Item Name</Label>
                      <Input
                        id="name"
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        placeholder="Item name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={newItem.category}
                        onValueChange={(value) => setNewItem({ ...newItem, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentStock">Current Stock</Label>
                      <Input
                        id="currentStock"
                        type="number"
                        value={newItem.currentStock}
                        onChange={(e) => setNewItem({ ...newItem, currentStock: Number(e.target.value) })}
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="minimumStock">Minimum Stock</Label>
                      <Input
                        id="minimumStock"
                        type="number"
                        value={newItem.minimumStock}
                        onChange={(e) => setNewItem({ ...newItem, minimumStock: Number(e.target.value) })}
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="unit">Unit</Label>
                      <Input
                        id="unit"
                        value={newItem.unit}
                        onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                        placeholder="kg, units, liters"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price per Unit</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={newItem.price}
                        onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="supplier">Supplier</Label>
                      <Input
                        id="supplier"
                        value={newItem.supplier}
                        onChange={(e) => setNewItem({ ...newItem, supplier: e.target.value })}
                        placeholder="Supplier name"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" className="flex-1" onClick={() => setShowAddItemDialog(false)}>
                      Cancel
                    </Button>
                    <Button className="flex-1" onClick={handleAddItem}>
                      Add Item
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Edit Item Dialog */}
            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Inventory Item</DialogTitle>
                  <DialogDescription>Update item details and stock levels</DialogDescription>
                </DialogHeader>
                {currentItem && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="editName">Item Name</Label>
                        <Input
                          id="editName"
                          value={currentItem.name}
                          onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="editCategory">Category</Label>
                        <Select
                          value={currentItem.category}
                          onValueChange={(value) => setCurrentItem({ ...currentItem, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="editCurrentStock">Current Stock</Label>
                        <Input
                          id="editCurrentStock"
                          type="number"
                          value={currentItem.currentStock}
                          onChange={(e) => setCurrentItem({ ...currentItem, currentStock: Number(e.target.value) })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="editMinimumStock">Minimum Stock</Label>
                        <Input
                          id="editMinimumStock"
                          type="number"
                          value={currentItem.minimumStock}
                          onChange={(e) => setCurrentItem({ ...currentItem, minimumStock: Number(e.target.value) })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="editUnit">Unit</Label>
                        <Input
                          id="editUnit"
                          value={currentItem.unit}
                          onChange={(e) => setCurrentItem({ ...currentItem, unit: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="editPrice">Price per Unit</Label>
                        <Input
                          id="editPrice"
                          type="number"
                          step="0.01"
                          value={currentItem.price}
                          onChange={(e) => setCurrentItem({ ...currentItem, price: Number(e.target.value) })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="editSupplier">Supplier</Label>
                        <Input
                          id="editSupplier"
                          value={currentItem.supplier}
                          onChange={(e) => setCurrentItem({ ...currentItem, supplier: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button variant="outline" className="flex-1" onClick={() => setShowEditDialog(false)}>
                        Cancel
                      </Button>
                      <Button className="flex-1" onClick={handleEditItem}>
                        Update Item
                      </Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
