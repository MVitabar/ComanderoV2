"use client"

import { useState, useEffect } from "react"
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
import { useAuth } from "@/hooks/use-auth"

export default function ReportsPage() {
  const { user } = useAuth()
  const [dateRange, setDateRange] = useState<"today" | "week" | "month">("today")
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showCalendar, setShowCalendar] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [salesData, setSalesData] = useState<any>(null)
  const [topItems, setTopItems] = useState<any[]>([])
  const [hourlyData, setHourlyData] = useState<any[]>([])
  const [staffPerformance, setStaffPerformance] = useState<any[]>([])
  const [tableUtilization, setTableUtilization] = useState<any[]>([])

  useEffect(() => {
    const fetchReports = async () => {
      if (!user?.establishment_id) return

      setIsLoading(true)
      try {
        const { ReportsService } = await import('@/lib/supabase/reports')

        // Cargar reporte de ventas
        const salesReport = await ReportsService.getSalesReport(user.establishment_id, dateRange)
        setSalesData(salesReport)
        setTopItems(salesReport.topItems || [])
        setHourlyData(salesReport.hourlyData || [])

        // Cargar rendimiento del staff
        const staffData = await ReportsService.getStaffPerformance(user.establishment_id)
        setStaffPerformance(staffData || [])

        // Cargar utilización de mesas
        const tableData = await ReportsService.getTableUtilization(user.establishment_id)
        setTableUtilization(tableData || [])
      } catch (error) {
        console.error('Error loading reports:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchReports()
  }, [user?.establishment_id, dateRange])

  if (isLoading) {
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

  const currentData = salesData || { revenue: 0, orders: 0, avgOrderValue: 0, growth: 0 }

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
