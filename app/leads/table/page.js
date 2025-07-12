"use client"

import { useEffect, useState } from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { TableView } from "@/components/table-view"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { AddLeadModal } from "@/components/add-lead-modal"

export default function TablePage() {
  const [leads, setLeads] = useState([])
  const [stages, setStages] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddLead, setShowAddLead] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [leadsRes, stagesRes] = await Promise.all([fetch("/api/leads"), fetch("/api/stages")])

      if (leadsRes.ok) {
        const leadsData = await leadsRes.json()
        setLeads(leadsData)
      }

      if (stagesRes.ok) {
        const stagesData = await stagesRes.json()
        setStages(stagesData)
      }
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLeadAdded = () => {
    fetchData()
    setShowAddLead(false)
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Loading table view...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex-1">
          <h1 className="text-lg font-semibold">Table View</h1>
        </div>
        <Button onClick={() => setShowAddLead(true)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Lead
        </Button>
      </header>

      <main className="flex-1 overflow-hidden">
        <TableView leads={leads} stages={stages} onDataChange={fetchData} />
      </main>

      <AddLeadModal open={showAddLead} onOpenChange={setShowAddLead} onLeadAdded={handleLeadAdded} stages={stages} />
    </div>
  )
}
