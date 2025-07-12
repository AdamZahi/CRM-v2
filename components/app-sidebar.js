"use client"

import { useEffect, useState } from "react"
import { useUser, useClerk } from "@clerk/nextjs"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Building2, ChevronDown, Home, Kanban, LogOut, Table, Users } from "lucide-react"

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
  SidebarRail,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Kanban View",
    url: "/leads/kanban",
    icon: Kanban,
  },
  {
    title: "Table View",
    url: "/leads/table",
    icon: Table,
  },
]

export function AppSidebar() {
  const { user } = useUser()
  const { signOut } = useClerk()
  const pathname = usePathname()
  const [organizations, setOrganizations] = useState([])
  const [currentOrg, setCurrentOrg] = useState(null)

  useEffect(() => {
    if (user) {
      fetchUserOrganizations()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const fetchUserOrganizations = async () => {
    try {
      const response = await fetch("/api/organizations")
      if (response.ok) {
        const orgs = await response.json()
        setOrganizations(orgs)
        if (orgs.length > 0 && !currentOrg) {
          setCurrentOrg(orgs[0])
          localStorage.setItem("currentOrgId", orgs[0].id)
        }
      }
    } catch (error) {
      console.error("Failed to fetch organizations:", error)
    }
  }

  const handleOrgChange = (org) => {
    setCurrentOrg(org)
    localStorage.setItem("currentOrgId", org.id)
    window.location.reload() // Refresh to update data for new org
  }

  const handleSignOut = () => {
    signOut()
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="w-full">
                  <Building2 className="mr-2 h-4 w-4" />
                  <span className="truncate">{currentOrg?.name || "Select Organization"}</span>
                  <ChevronDown className="ml-auto h-4 w-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
                {organizations.map((org) => (
                  <DropdownMenuItem key={org.id} onClick={() => handleOrgChange(org)}>
                    <Building2 className="mr-2 h-4 w-4" />
                    <span>{org.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <Users className="h-4 w-4" />
                  <span className="truncate">
                    {user?.firstName || user?.emailAddresses?.[0]?.emailAddress || "User"}
                  </span>
                  <ChevronDown className="ml-auto h-4 w-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
