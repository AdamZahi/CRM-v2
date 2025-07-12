"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, User } from "lucide-react"

const statusColors = {
  ACTIVE: "bg-green-100 text-green-800",
  INACTIVE: "bg-yellow-100 text-yellow-800",
  COMPLETED: "bg-blue-100 text-blue-800",
}

const sourceColors = {
  ORGANIC: "bg-purple-100 text-purple-800",
  PAID: "bg-orange-100 text-orange-800",
  REFERRAL: "bg-pink-100 text-pink-800",
}

export function LeadCard({ lead, onClick, isDragging = false }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: lead.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging || isSortableDragging ? 0.5 : 1,
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <CardContent className="p-3">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h4 className="font-medium text-sm truncate">{lead.name}</h4>
            <div className="flex gap-1">
              <Badge className={`text-xs ${statusColors[lead.status]}`}>{lead.status}</Badge>
            </div>
          </div>

          <div className="space-y-1">
            {lead.email && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Mail className="h-3 w-3" />
                <span className="truncate">{lead.email}</span>
              </div>
            )}
            {lead.phone && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Phone className="h-3 w-3" />
                <span>{lead.phone}</span>
              </div>
            )}
            {lead.assignedTo && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <User className="h-3 w-3" />
                <span className="truncate">{lead.assignedTo.name || lead.assignedTo.email}</span>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center">
            <Badge className={`text-xs ${sourceColors[lead.source]}`}>{lead.source}</Badge>
            <span className="text-xs text-muted-foreground">{new Date(lead.dateAdded).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
