"use client"

import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { TableStatusOverview } from "@/components/tables/table-status-overview"
import { TableMap } from "@/components/tables/table-map"
import { TableDetailsDialog } from "@/components/tables/table-details-dialog"
import { NewOrderDialog } from "@/components/tables/new-order-dialog"
import { TableService } from "@/lib/supabase/tables"
import { useAuth } from "@/hooks/use-auth"
import type { TableWithDetails } from "@/types/table"

export default function TablesPage() {
  const { user } = useAuth()
  const [tables, setTables] = useState<TableWithDetails[]>([])
  const [selectedTable, setSelectedTable] = useState<TableWithDetails | null>(null)
  const [showNewOrderDialog, setShowNewOrderDialog] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.establishmentId) {
      loadTables()
    }
  }, [user?.establishmentId])

  const loadTables = async () => {
    try {
      setLoading(true)
      const data = await TableService.getTables(user!.establishmentId)
      setTables(data)
    } catch (error) {
      console.error("Error loading tables:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleTableClick = (table: TableWithDetails) => {
    setSelectedTable(table)
  }

  const handleNewOrder = (tableId: string) => {
    const table = tables.find((t) => t.id === tableId)
    if (table) {
      setSelectedTable(table)
      setShowNewOrderDialog(true)
    }
  }

  const handleTableUpdate = async (tableId: string, updates: Partial<TableWithDetails>) => {
    try {
      await TableService.updateTable(tableId, updates)
      await loadTables() // Reload tables to get updated data
    } catch (error) {
      console.error("Error updating table:", error)
    }
  }

  if (loading) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <div className="flex-1">
            <header className="flex h-16 items-center gap-4 border-b bg-background px-6">
              <SidebarTrigger />
              <div className="flex-1">
                <h1 className="text-2xl font-semibold">Table Map</h1>
              </div>
            </header>
            <main className="flex-1 p-6">
              <div className="animate-pulse space-y-6">
                <div className="grid gap-4 md:grid-cols-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-24 bg-gray-200 rounded-lg" />
                  ))}
                </div>
                <div className="h-96 bg-gray-200 rounded-lg" />
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1">
          <header className="flex h-16 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger />
            <div className="flex-1">
              <h1 className="text-2xl font-semibold">Table Map</h1>
            </div>
          </header>

          <main className="flex-1 p-6 space-y-6">
            {/* Status Overview */}
            <TableStatusOverview tables={tables} />

            {/* Restaurant Map */}
            <TableMap tables={tables} onTableClick={handleTableClick} />

            {/* Table Details Dialog */}
            <TableDetailsDialog
              table={selectedTable}
              open={!!selectedTable}
              onOpenChange={() => setSelectedTable(null)}
              onNewOrder={handleNewOrder}
              onTableUpdate={handleTableUpdate}
            />

            {/* New Order Dialog */}
            <NewOrderDialog
              table={selectedTable}
              open={showNewOrderDialog}
              onOpenChange={setShowNewOrderDialog}
              onOrderCreated={loadTables}
            />
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
