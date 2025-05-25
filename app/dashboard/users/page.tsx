"use client"

import { useState } from "react"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Search, UserPlus, Edit, Trash2, Mail, Phone } from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { UserStats } from "@/components/users/user-stats"

export default function UsersPage() {
  const [users, setUsers] = useState([
    {
      id: 1,
      firstName: "Juan",
      lastName: "Pérez",
      email: "juan.perez@restaurant.com",
      phone: "+1 (555) 123-4567",
      role: "waiter",
      status: "active",
      avatar: "/placeholder.svg?height=40&width=40",
      lastLogin: "2024-01-15T10:30:00",
      createdAt: "2024-01-01T09:00:00",
      permissions: {
        tables: true,
        orders: true,
        kitchen: false,
        inventory: false,
        reports: false,
        users: false,
      },
    },
    {
      id: 2,
      firstName: "María",
      lastName: "García",
      email: "maria.garcia@restaurant.com",
      phone: "+1 (555) 234-5678",
      role: "manager",
      status: "active",
      avatar: "/placeholder.svg?height=40&width=40",
      lastLogin: "2024-01-15T11:45:00",
      createdAt: "2024-01-01T09:00:00",
      permissions: {
        tables: true,
        orders: true,
        kitchen: true,
        inventory: true,
        reports: true,
        users: true,
      },
    },
    {
      id: 3,
      firstName: "Carlos",
      lastName: "López",
      email: "carlos.lopez@restaurant.com",
      phone: "+1 (555) 345-6789",
      role: "chef",
      status: "active",
      avatar: "/placeholder.svg?height=40&width=40",
      lastLogin: "2024-01-15T08:15:00",
      createdAt: "2024-01-05T14:30:00",
      permissions: {
        tables: false,
        orders: true,
        kitchen: true,
        inventory: true,
        reports: false,
        users: false,
      },
    },
    {
      id: 4,
      firstName: "Ana",
      lastName: "Martín",
      email: "ana.martin@restaurant.com",
      phone: "+1 (555) 456-7890",
      role: "waiter",
      status: "inactive",
      avatar: "/placeholder.svg?height=40&width=40",
      lastLogin: "2024-01-10T16:20:00",
      createdAt: "2024-01-08T11:15:00",
      permissions: {
        tables: true,
        orders: true,
        kitchen: false,
        inventory: false,
        reports: false,
        users: false,
      },
    },
  ])

  const [filterRole, setFilterRole] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddUserDialog, setShowAddUserDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    permissions: {
      tables: false,
      orders: false,
      kitchen: false,
      inventory: false,
      reports: false,
      users: false,
    },
  })

  const roles = [
    { value: "owner", label: "Owner", color: "bg-purple-100 text-purple-800" },
    { value: "manager", label: "Manager", color: "bg-blue-100 text-blue-800" },
    { value: "chef", label: "Chef", color: "bg-orange-100 text-orange-800" },
    { value: "waiter", label: "Waiter", color: "bg-green-100 text-green-800" },
    { value: "bartender", label: "Bartender", color: "bg-cyan-100 text-cyan-800" },
    { value: "cashier", label: "Cashier", color: "bg-yellow-100 text-yellow-800" },
  ]

  const getRoleColor = (role: string) => {
    const roleObj = roles.find((r) => r.value === role)
    return roleObj?.color || "bg-gray-100 text-gray-800"
  }

  const getRoleLabel = (role: string) => {
    const roleObj = roles.find((r) => r.value === role)
    return roleObj?.label || role
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

  const filteredUsers = users.filter((user) => {
    const matchesRole = filterRole === "all" || user.role === filterRole
    const matchesStatus = filterStatus === "all" || user.status === filterStatus
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesRole && matchesStatus && matchesSearch
  })

  const handleAddUser = () => {
    const user = {
      id: users.length + 1,
      ...newUser,
      status: "active",
      avatar: "/placeholder.svg?height=40&width=40",
      lastLogin: null,
      createdAt: new Date().toISOString(),
    }
    setUsers([...users, user])
    setNewUser({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      role: "",
      permissions: {
        tables: false,
        orders: false,
        kitchen: false,
        inventory: false,
        reports: false,
        users: false,
      },
    })
    setShowAddUserDialog(false)
  }

  const handleEditUser = () => {
    if (!selectedUser) return

    const updatedUsers = users.map((user) => (user.id === selectedUser.id ? selectedUser : user))
    setUsers(updatedUsers)
    setShowEditDialog(false)
    setSelectedUser(null)
  }

  const handleDeleteUser = (userId: number) => {
    setUsers(users.filter((user) => user.id !== userId))
  }

  const toggleUserStatus = (userId: number) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, status: user.status === "active" ? "inactive" : "active" } : user,
      ),
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatLastLogin = (dateString: string | null) => {
    if (!dateString) return "Never"
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
              <h1 className="text-2xl font-semibold">User Management</h1>
            </div>
            <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add User
                </Button>
              </DialogTrigger>
            </Dialog>
          </header>

          <main className="flex-1 p-6 space-y-6">
            {/* Stats Overview */}
            <UserStats users={users} roles={roles} />

            <Tabs defaultValue="users" className="space-y-6">
              <TabsList>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
                <TabsTrigger value="activity">Activity Log</TabsTrigger>
              </TabsList>

              <TabsContent value="users" className="space-y-6">
                {/* Filters */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                          <Input
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <Select value={filterRole} onValueChange={setFilterRole}>
                        <SelectTrigger className="w-full md:w-48">
                          <SelectValue placeholder="Filter by role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Roles</SelectItem>
                          {roles.map((role) => (
                            <SelectItem key={role.value} value={role.value}>
                              {role.label}
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
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="suspended">Suspended</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Users List */}
                <Card>
                  <CardHeader>
                    <CardTitle>Team Members</CardTitle>
                    <CardDescription>Manage your restaurant staff and their permissions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredUsers.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                        >
                          <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={user.avatar || "/placeholder.svg"} />
                              <AvatarFallback>
                                {user.firstName[0]}
                                {user.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">
                                  {user.firstName} {user.lastName}
                                </h3>
                                <Badge className={getRoleColor(user.role)}>{getRoleLabel(user.role)}</Badge>
                                <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Mail className="h-3 w-3" />
                                  {user.email}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  {user.phone}
                                </span>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Last login: {formatLastLogin(user.lastLogin)} • Joined: {formatDate(user.createdAt)}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={user.status === "active"}
                              onCheckedChange={() => toggleUserStatus(user.id)}
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedUser(user)
                                setShowEditDialog(true)
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDeleteUser(user.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="roles" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Role Permissions</CardTitle>
                    <CardDescription>Configure permissions for each role</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {roles.map((role) => (
                        <div key={role.value} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <Badge className={role.color}>{role.label}</Badge>
                              <span className="text-sm text-muted-foreground">
                                {users.filter((u) => u.role === role.value).length} users
                              </span>
                            </div>
                            <Button variant="outline" size="sm">
                              Edit Permissions
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {Object.keys(newUser.permissions).map((permission) => (
                              <div key={permission} className="flex items-center space-x-2">
                                <Switch
                                  id={`${role.value}-${permission}`}
                                  defaultChecked={role.value === "manager" || role.value === "owner"}
                                />
                                <Label htmlFor={`${role.value}-${permission}`} className="capitalize">
                                  {permission}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>User activity and system events</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          user: "María García",
                          action: "Logged in",
                          time: "2 minutes ago",
                          type: "login",
                        },
                        {
                          user: "Juan Pérez",
                          action: "Created order CMD-005",
                          time: "15 minutes ago",
                          type: "order",
                        },
                        {
                          user: "Carlos López",
                          action: "Updated inventory item",
                          time: "1 hour ago",
                          type: "inventory",
                        },
                        {
                          user: "Ana Martín",
                          action: "Logged out",
                          time: "2 hours ago",
                          type: "logout",
                        },
                      ].map((activity, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <div>
                              <span className="font-medium">{activity.user}</span>
                              <span className="text-muted-foreground"> {activity.action}</span>
                            </div>
                          </div>
                          <span className="text-sm text-muted-foreground">{activity.time}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Add User Dialog */}
            <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                  <DialogDescription>Create a new user account for your restaurant</DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={newUser.firstName}
                        onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                        placeholder="John"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={newUser.lastName}
                        onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        placeholder="john@restaurant.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={newUser.phone}
                        onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <Label>Permissions</Label>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.keys(newUser.permissions).map((permission) => (
                        <div key={permission} className="flex items-center space-x-2">
                          <Switch
                            id={permission}
                            checked={newUser.permissions[permission]}
                            onCheckedChange={(checked) =>
                              setNewUser({
                                ...newUser,
                                permissions: { ...newUser.permissions, [permission]: checked },
                              })
                            }
                          />
                          <Label htmlFor={permission} className="capitalize">
                            {permission}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" className="flex-1" onClick={() => setShowAddUserDialog(false)}>
                      Cancel
                    </Button>
                    <Button className="flex-1" onClick={handleAddUser}>
                      Add User
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Edit User Dialog */}
            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Edit User</DialogTitle>
                  <DialogDescription>Update user information and permissions</DialogDescription>
                </DialogHeader>
                {selectedUser && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="editFirstName">First Name</Label>
                        <Input
                          id="editFirstName"
                          value={selectedUser.firstName}
                          onChange={(e) => setSelectedUser({ ...selectedUser, firstName: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="editLastName">Last Name</Label>
                        <Input
                          id="editLastName"
                          value={selectedUser.lastName}
                          onChange={(e) => setSelectedUser({ ...selectedUser, lastName: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="editEmail">Email</Label>
                        <Input
                          id="editEmail"
                          type="email"
                          value={selectedUser.email}
                          onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="editPhone">Phone</Label>
                        <Input
                          id="editPhone"
                          value={selectedUser.phone}
                          onChange={(e) => setSelectedUser({ ...selectedUser, phone: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="editRole">Role</Label>
                      <Select
                        value={selectedUser.role}
                        onValueChange={(value) => setSelectedUser({ ...selectedUser, role: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map((role) => (
                            <SelectItem key={role.value} value={role.value}>
                              {role.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-4">
                      <Label>Permissions</Label>
                      <div className="grid grid-cols-2 gap-4">
                        {Object.keys(selectedUser.permissions).map((permission) => (
                          <div key={permission} className="flex items-center space-x-2">
                            <Switch
                              id={`edit-${permission}`}
                              checked={selectedUser.permissions[permission]}
                              onCheckedChange={(checked) =>
                                setSelectedUser({
                                  ...selectedUser,
                                  permissions: { ...selectedUser.permissions, [permission]: checked },
                                })
                              }
                            />
                            <Label htmlFor={`edit-${permission}`} className="capitalize">
                              {permission}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button variant="outline" className="flex-1" onClick={() => setShowEditDialog(false)}>
                        Cancel
                      </Button>
                      <Button className="flex-1" onClick={handleEditUser}>
                        Update User
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
