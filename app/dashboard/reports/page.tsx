"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { TrendingUp, TrendingDown, Download, CalendarIcon, MapPin } from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { format } from "date-fns"
import { KeyMetrics } from "@/components/reports/key-metrics"

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState("today")
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showCalendar, setShowCalendar] = useState(false)

  // Mock data for reports
  const salesData = {
    today: { revenue: 2847, orders: 23, avgOrder: 123.78, growth: 12.5 },
    week: { revenue: 18420, orders: 156, avgOrder: 118.08, growth: 8.3 },
    month: { revenue: 78650, orders: 642, avgOrder: 122.51, growth: 15.2 },
  }

  const topItems = [
    { name: "Hamburguesa Clásica", quantity: 45, revenue: 562.5, percentage: 18.2 },
    { name: "Pizza Margherita", quantity: 32, revenue: 480.0, percentage: 15.5 },
    { name: "Ensalada César", quantity: 28, revenue: 238.0, percentage: 11.4 },
    { name: "Papas Fritas", quantity: 67, revenue: 335.0, percentage: 10.8 },
    { name: "Cerveza Corona", quantity: 89, revenue: 400.5, percentage: 9.1 },
  ]

  const hourlyData = [
    { hour: "08:00", orders: 2, revenue: 45 },
    { hour: "09:00", orders: 5, revenue: 125 },
    { hour: "10:00", orders: 8, revenue: 180 },
    { hour: "11:00", orders: 12, revenue: 285 },
    { hour: "12:00", orders: 18, revenue: 420 },
    { hour: "13:00", orders: 25, revenue: 580 },
    { hour: "14:00", orders: 22, revenue: 510 },
    { hour: "15:00", orders: 15, revenue: 340 },
    { hour: "16:00", orders: 10, revenue: 230 },
    { hour: "17:00", orders: 8, revenue: 185 },
    { hour: "18:00", orders: 20, revenue: 465 },
    { hour: "19:00", orders: 28, revenue: 650 },
    { hour: "20:00", orders: 32, revenue: 745 },
    { hour: "21:00", orders: 25, revenue: 580 },
    { hour: "22:00", orders: 15, revenue: 350 },
  ]

  const staffPerformance = [
    { name: "Juan Pérez", orders: 28, revenue: 1250, avgTime: "12 min", rating: 4.8 },
    { name: "María García", orders: 32, revenue: 1480, avgTime: "10 min", rating: 4.9 },
    { name: "Carlos López", orders: 25, revenue: 1120, avgTime: "15 min", rating: 4.6 },
    { name: "Ana Martín", orders: 22, revenue: 980, avgTime: "13 min", rating: 4.7 },
  ]

  const tableUtilization = [
    { table: "Table 1", occupancy: 85, revenue: 320, turns: 6 },
    { table: "Table 2", occupancy: 92, revenue: 280, turns: 8 },
    { table: "Table 3", occupancy: 78, revenue: 450, turns: 5 },
    { table: "Table 4", occupancy: 88, revenue: 380, turns: 7 },
    { table: "Table 5", occupancy: 95, revenue: 520, turns: 9 },
  ]

  const currentData = salesData[dateRange] || salesData.today

  const getMaxRevenue = () => {
    return Math.max(...hourlyData.map((item) => item.revenue))
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1">
          <header className="flex h-16 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger />
            <div className="flex-1">
              <h1 className="text-2xl font-semibold">Reports & Analytics</h1>
            </div>
            <div className="flex items-center gap-2">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
              <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {format(selectedDate, "MMM dd")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} />
                </PopoverContent>
              </Popover>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </header>

          <main className="flex-1 p-6 space-y-6">
            {/* Key Metrics */}
            <KeyMetrics data={currentData} />

            <Tabs defaultValue="sales" className="space-y-6">
              <TabsList>
                <TabsTrigger value="sales">Sales</TabsTrigger>
                <TabsTrigger value="products">Products</TabsTrigger>
                <TabsTrigger value="staff">Staff</TabsTrigger>
                <TabsTrigger value="tables">Tables</TabsTrigger>
              </TabsList>

              <TabsContent value="sales" className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  {/* Hourly Sales Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Hourly Sales</CardTitle>
                      <CardDescription>Revenue and orders throughout the day</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {hourlyData.map((item, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-sm font-medium">{item.hour}</span>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <div
                                  className="h-2 bg-blue-500 rounded"
                                  style={{ width: `${(item.revenue / getMaxRevenue()) * 100}px` }}
                                />
                                <span className="text-sm">{item.revenue}</span>
                              </div>
                              <Badge variant="outline">{item.orders} orders</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Payment Methods */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Payment Methods</CardTitle>
                      <CardDescription>Revenue breakdown by payment type</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { method: "Credit Card", amount: 1680, percentage: 59 },
                          { method: "Cash", amount: 854, percentage: 30 },
                          { method: "Debit Card", amount: 313, percentage: 11 },
                        ].map((payment, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="font-medium">{payment.method}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-500 h-2 rounded-full"
                                  style={{ width: `${payment.percentage}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium">{payment.amount}</span>
                              <span className="text-xs text-muted-foreground">({payment.percentage}%)</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="products" className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  {/* Top Selling Items */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Selling Items</CardTitle>
                      <CardDescription>Best performing menu items</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {topItems.map((item, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="space-y-1">
                              <span className="font-medium">{item.name}</span>
                              <div className="text-sm text-muted-foreground">
                                {item.quantity} sold • {item.revenue}
                              </div>
                            </div>
                            <Badge variant="outline">{item.percentage}%</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Category Performance */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Category Performance</CardTitle>
                      <CardDescription>Revenue by menu category</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { category: "Main Dishes", revenue: 1250, orders: 45, growth: 12.5 },
                          { category: "Beverages", revenue: 680, orders: 89, growth: 8.3 },
                          { category: "Appetizers", revenue: 420, orders: 32, growth: -2.1 },
                          { category: "Desserts", revenue: 280, orders: 18, growth: 15.2 },
                        ].map((category, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="space-y-1">
                              <span className="font-medium">{category.category}</span>
                              <div className="text-sm text-muted-foreground">{category.orders} orders</div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold">{category.revenue}</div>
                              <div
                                className={`text-xs flex items-center ${category.growth > 0 ? "text-green-600" : "text-red-600"}`}
                              >
                                {category.growth > 0 ? (
                                  <TrendingUp className="w-3 h-3 mr-1" />
                                ) : (
                                  <TrendingDown className="w-3 h-3 mr-1" />
                                )}
                                {Math.abs(category.growth)}%
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="staff" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Staff Performance</CardTitle>
                    <CardDescription>Individual staff member metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {staffPerformance.map((staff, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="space-y-1">
                            <span className="font-medium">{staff.name}</span>
                            <div className="text-sm text-muted-foreground">
                              {staff.orders} orders • Avg time: {staff.avgTime}
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="font-semibold">{staff.revenue}</div>
                              <div className="text-sm text-muted-foreground">Revenue</div>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-yellow-500">★</span>
                              <span className="font-medium">{staff.rating}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tables" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Table Utilization</CardTitle>
                    <CardDescription>Table performance and occupancy rates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {tableUtilization.map((table, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <MapPin className="h-5 w-5 text-muted-foreground" />
                            <div className="space-y-1">
                              <span className="font-medium">{table.table}</span>
                              <div className="text-sm text-muted-foreground">{table.turns} table turns</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="text-center">
                              <div className="font-semibold">{table.occupancy}%</div>
                              <div className="text-xs text-muted-foreground">Occupancy</div>
                            </div>
                            <div className="text-center">
                              <div className="font-semibold">{table.revenue}</div>
                              <div className="text-xs text-muted-foreground">Revenue</div>
                            </div>
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div className="bg-green-500 h-2 rounded-full" style={{ width: `${table.occupancy}%` }} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
