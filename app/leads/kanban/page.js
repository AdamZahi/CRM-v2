"use client"

import { useEffect, useState } from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { KanbanBoard } from "@/components/kanban-board"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { AddLeadModal } from "@/components/add-lead-modal"
import { AddStageModal } from "@/components/add-stage-modal"

export default function KanbanPage() {
  const [stages, setStages] = useState([])
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddLead, setShowAddLead] = useState(false)
  const [showAddStage, setShowAddStage] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [stagesRes, leadsRes] = await Promise.all([fetch("/api/stages"), fetch("/api/leads")])

      if (stagesRes.ok) {
        const stagesData = await stagesRes.json()
        setStages(stagesData)
      }

      if (leadsRes.ok) {
        const leadsData = await leadsRes.json()
        setLeads(leadsData)
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

  const handleStageAdded = () => {
    fetchData()
    setShowAddStage(false)
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Loading kanban board...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex-1">
          <h1 className="text-lg font-semibold">Pipeline View</h1>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowAddStage(true)} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Stage
          </Button>
          <Button onClick={() => setShowAddLead(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Lead
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        <KanbanBoard stages={stages} leads={leads} onDataChange={fetchData} />
      </main>

      <AddLeadModal open={showAddLead} onOpenChange={setShowAddLead} onLeadAdded={handleLeadAdded} stages={stages} />

      <AddStageModal open={showAddStage} onOpenChange={setShowAddStage} onStageAdded={handleStageAdded} />
    </div>
  )
}
