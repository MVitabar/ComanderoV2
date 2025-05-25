import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Shield, Clock } from "lucide-react"

interface User {
  status: string
}

interface UserStatsProps {
  users: User[]
  roles: any[]
}

export function UserStats({ users, roles }: UserStatsProps) {
  const activeUsers = users.filter((user) => user.status === "active").length
  const totalUsers = users.length

  const stats = [
    {
      title: "Total Users",
      value: totalUsers,
      description: "Registered users",
      icon: Users,
    },
    {
      title: "Active Users",
      value: activeUsers,
      description: "Currently active",
      icon: Shield,
      valueColor: "text-green-600",
    },
    {
      title: "Roles",
      value: roles.length,
      description: "Available roles",
      icon: Users,
    },
    {
      title: "Online Now",
      value: 3,
      description: "Currently online",
      icon: Clock,
      valueColor: "text-blue-600",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stat.valueColor || ""}`}>{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
