"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"
import type { TableWithDetails } from "@/types/table"

interface TableMapProps {
  tables: TableWithDetails[]
  onTableClick: (table: TableWithDetails) => void
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "available":
      return "bg-green-500 hover:bg-green-600"
    case "occupied":
      return "bg-red-500 hover:bg-red-600"
    case "reserved":
      return "bg-yellow-500 hover:bg-yellow-600"
    case "cleaning":
      return "bg-gray-500 hover:bg-gray-600"
    default:
      return "bg-gray-500 hover:bg-gray-600"
  }
}

export function TableMap({ tables, onTableClick }: TableMapProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Restaurant Floor Plan</CardTitle>
        <CardDescription>Click on a table to view details or create a new order</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative bg-gray-50 rounded-lg p-8 min-h-[400px] overflow-auto">
          {/* Restaurant Layout */}
          <div className="relative w-full h-[350px]">
            {tables.map((table) => (
              <Button
                key={table.id}
                className={`absolute w-20 h-20 rounded-lg flex flex-col items-center justify-center text-white font-semibold transition-all hover:scale-105 ${getStatusColor(table.status)}`}
                style={{ left: table.position.x, top: table.position.y }}
                onClick={() => onTableClick(table)}
              >
                <span className="text-lg">{table.number}</span>
                <span className="text-xs">
                  <Users className="w-3 h-3 inline mr-1" />
                  {table.capacity}
                </span>
              </Button>
            ))}

            {/* Kitchen Area */}
            <div className="absolute right-0 top-0 w-32 h-32 bg-blue-100 border-2 border-blue-300 rounded-lg flex items-center justify-center">
              <div className="text-center text-blue-700">
                <div className="font-semibold">Kitchen</div>
              </div>
            </div>

            {/* Bar Area */}
            <div className="absolute right-0 bottom-0 w-32 h-32 bg-purple-100 border-2 border-purple-300 rounded-lg flex items-center justify-center">
              <div className="text-center text-purple-700">
                <div className="font-semibold">Bar</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
