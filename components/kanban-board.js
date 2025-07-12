"use client"

import { useState } from "react"
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, closestCorners } from "@dnd-kit/core"
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable"
import { StageColumn } from "./stage-column"
import { LeadCard } from "./lead-card"
import { LeadDetailsModal } from "./lead-details-modal"

export function KanbanBoard({ stages, leads, onDataChange }) {
  const [activeId, setActiveId] = useState(null)
  const [selectedLead, setSelectedLead] = useState(null)
  const [showLeadModal, setShowLeadModal] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  )

  const handleDragStart = (event) => {
    setActiveId(event.active.id)
  }

  const handleDragEnd = async (event) => {
    const { active, over } = event
    setActiveId(null)

    if (!over) return

    const activeId = active.id
    const overId = over.id

    // Find the lead being dragged
    const lead = leads.find((l) => l.id === activeId)
    if (!lead) return

    // Find the target stage
    const targetStage =
      stages.find((s) => s.id === overId) ||
      stages.find((s) => leads.some((l) => l.id === overId && l.stageId === s.id))

    if (!targetStage || lead.stageId === targetStage.id) return

    // Update lead stage
    try {
      const response = await fetch(`/api/leads/${lead.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          stageId: targetStage.id,
        }),
      })

      if (response.ok) {
        onDataChange()
      }
    } catch (error) {
      console.error("Failed to update lead stage:", error)
    }
  }

  const handleLeadClick = (lead) => {
    setSelectedLead(lead)
    setShowLeadModal(true)
  }

  const handleLeadUpdated = () => {
    onDataChange()
    setShowLeadModal(false)
    setSelectedLead(null)
  }

  const activeLead = activeId ? leads.find((lead) => lead.id === activeId) : null

  return (
    <div className="h-full p-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 h-full overflow-x-auto">
          <SortableContext items={stages.map((s) => s.id)} strategy={horizontalListSortingStrategy}>
            {stages
              .sort((a, b) => a.position - b.position)
              .map((stage) => (
                <StageColumn
                  key={stage.id}
                  stage={stage}
                  leads={leads.filter((lead) => lead.stageId === stage.id)}
                  onLeadClick={handleLeadClick}
                  onDataChange={onDataChange}
                />
              ))}
          </SortableContext>
        </div>

        <DragOverlay>{activeLead ? <LeadCard lead={activeLead} isDragging /> : null}</DragOverlay>
      </DndContext>

      <LeadDetailsModal
        open={showLeadModal}
        onOpenChange={setShowLeadModal}
        lead={selectedLead}
        stages={stages}
        onLeadUpdated={handleLeadUpdated}
      />
    </div>
  )
}
