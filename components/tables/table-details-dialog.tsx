"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Eye, Edit } from "lucide-react"
import type { TableWithDetails } from "@/types/table"

interface TableDetailsDialogProps {
  table: TableWithDetails | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onNewOrder: (tableId: string) => void
  onTableUpdate: (tableId: string, updates: Partial<TableWithDetails>) => void
}

const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case "available":
      return "bg-green-100 text-green-800"
    case "occupied":
      return "bg-red-100 text-red-800"
    case "reserved":
      return "bg-yellow-100 text-yellow-800"
    case "cleaning":
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case "available":
      return "Available"
    case "occupied":
      return "Occupied"
    case "reserved":
      return "Reserved"
    case "cleaning":
      return "Cleaning"
    default:
      return status
  }
}

export function TableDetailsDialog({ table, open, onOpenChange, onNewOrder, onTableUpdate }: TableDetailsDialogProps) {
  if (!table) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Table {table.number}</DialogTitle>
          <DialogDescription>Capacity: {table.capacity} people</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Status:</span>
            <Badge className={getStatusBadgeColor(table.status)}>{getStatusText(table.status)}</Badge>
          </div>

          {table.waiter && (
            <div className="flex items-center justify-between">
              <span>Waiter:</span>
              <span className="font-medium">
                {table.waiter.firstName} {table.waiter.lastName}
              </span>
            </div>
          )}

          {table.orders && table.orders.length > 0 && (
            <div>
              <span className="font-medium">Active Orders:</span>
              <div className="mt-2 space-y-1">
                {table.orders.map((order) => (
                  <Badge key={order.id} variant="outline">
                    {order.id}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            {table.status === "available" && (
              <Button className="flex-1" onClick={() => onNewOrder(table.id)}>
                <Plus className="w-4 h-4 mr-2" />
                New Order
              </Button>
            )}

            {table.status === "occupied" && (
              <>
                <Button variant="outline" className="flex-1">
                  <Eye className="w-4 h-4 mr-2" />
                  View Orders
                </Button>
                <Button className="flex-1">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Items
                </Button>
              </>
            )}

            <Button variant="outline" size="icon">
              <Edit className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
