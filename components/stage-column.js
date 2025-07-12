"use client"

import { useState } from "react"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useDroppable } from "@dnd-kit/core"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LeadCard } from "./lead-card"
import { MoreHorizontal, Edit2, Trash2, Check, X } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function StageColumn({ stage, leads, onLeadClick, onDataChange }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(stage.name)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const { setNodeRef: setDroppableRef } = useDroppable({
    id: stage.id,
  })

  const handleRename = async () => {
    if (editName.trim() === stage.name) {
      setIsEditing(false)
      return
    }

    try {
      const response = await fetch(`/api/stages/${stage.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editName.trim(),
        }),
      })

      if (response.ok) {
        onDataChange()
        setIsEditing(false)
      }
    } catch (error) {
      console.error("Failed to rename stage:", error)
    }
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/stages/${stage.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        onDataChange()
      }
    } catch (error) {
      console.error("Failed to delete stage:", error)
    }
    setShowDeleteDialog(false)
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleRename()
    } else if (e.key === "Escape") {
      setEditName(stage.name)
      setIsEditing(false)
    }
  }

  return (
    <>
      <Card className="w-80 flex-shrink-0 h-fit max-h-full flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            {isEditing ? (
              <div className="flex items-center gap-2 flex-1">
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="h-8"
                  autoFocus
                />
                <Button size="sm" variant="ghost" onClick={handleRename}>
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setEditName(stage.name)
                    setIsEditing(false)
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <CardTitle className="text-sm font-medium">
                  {stage.name} ({leads.length})
                </CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setIsEditing(true)}>
                      <Edit2 className="mr-2 h-4 w-4" />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto" ref={setDroppableRef}>
          <SortableContext items={leads.map((l) => l.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {leads.map((lead) => (
                <LeadCard key={lead.id} lead={lead} onClick={() => onLeadClick(lead)} />
              ))}
            </div>
          </SortableContext>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Stage</AlertDialogTitle>
            <AlertDialogDescription>
              `Are you sure you want to delete `&quot;`{stage.name}?`&quot;` This will also delete all leads in this stage. This action
              cannot be undone.`
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
