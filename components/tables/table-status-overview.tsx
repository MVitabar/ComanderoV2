import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Table {
  status: string
}

interface TableStatusOverviewProps {
  tables: Table[]
}

export function TableStatusOverview({ tables }: TableStatusOverviewProps) {
  const statusStats = {
    available: tables.filter((t) => t.status === "available").length,
    occupied: tables.filter((t) => t.status === "occupied").length,
    reserved: tables.filter((t) => t.status === "reserved").length,
    cleaning: tables.filter((t) => t.status === "cleaning").length,
  }

  const statusCards = [
    { title: "Disponibles", count: statusStats.available, color: "bg-green-500" },
    { title: "Ocupadas", count: statusStats.occupied, color: "bg-red-500" },
    { title: "Reservadas", count: statusStats.reserved, color: "bg-yellow-500" },
    { title: "Limpieza", count: statusStats.cleaning, color: "bg-gray-500" },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {statusCards.map((status) => (
        <Card key={status.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{status.title}</CardTitle>
            <div className={`w-3 h-3 ${status.color} rounded-full`}></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{status.count}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
