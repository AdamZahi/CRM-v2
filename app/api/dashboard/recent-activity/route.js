import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"

export async function GET(request) {
  try {
    const { userId } = await auth(request)

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get recent leads as activity (simplified)
    const recentLeads = await prisma.lead.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        stage: true,
        assignedTo: true,
      },
      // Add organizationId filter when you implement org selection
    })

    const activities = recentLeads.map((lead) => ({
      description: `New lead "${lead.name}" added to ${lead.stage.name}`,
      createdAt: lead.createdAt,
    }))

    return NextResponse.json(activities)
  } catch (error) {
    console.error("Error fetching recent activity:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
