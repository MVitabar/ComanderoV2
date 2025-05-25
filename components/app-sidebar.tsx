"use client"

import {
  ChefHat,
  Home,
  MapPin,
  Package,
  Users,
  BarChart3,
  Settings,
  ClipboardList,
  Building,
  LogOut,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Table Map",
    url: "/dashboard/tables",
    icon: MapPin,
  },
  {
    title: "Orders",
    url: "/dashboard/orders",
    icon: ClipboardList,
  },
  {
    title: "Kitchen & Bar",
    url: "/dashboard/kitchen",
    icon: ChefHat,
  },
  {
    title: "Inventory",
    url: "/dashboard/inventory",
    icon: Package,
  },
  {
    title: "Users",
    url: "/dashboard/users",
    icon: Users,
  },
  {
    title: "Reports",
    url: "/dashboard/reports",
    icon: BarChart3,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 px-3 py-2">
          <ChefHat className="h-6 w-6 sm:h-8 sm:w-8 text-primary flex-shrink-0" />
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-semibold truncate">Comandero</h2>
            <p className="text-xs text-muted-foreground">SaaS Platform</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium">Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url} className="w-full">
                    <Link href={item.url} className="flex items-center gap-3 px-3 py-2">
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate text-sm">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium">Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="w-full">
                  <Link href="/establishments" className="flex items-center gap-3 px-3 py-2">
                    <Building className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate text-sm">Switch Establishment</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start h-auto p-2 sm:p-3">
              <div className="flex items-center gap-2 sm:gap-3 w-full min-w-0">
                <Avatar className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback className="text-xs">JD</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-xs sm:text-sm font-medium truncate">John Doe</p>
                  <p className="text-xs text-muted-foreground truncate">The Golden Spoon</p>
                </div>
                <Badge variant="secondary" className="text-xs px-1 py-0 flex-shrink-0">
                  Owner
                </Badge>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem asChild>
              <Link href="/establishments" className="flex items-center">
                <Building className="mr-2 h-4 w-4" />
                <span>Switch Establishment</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Account Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
