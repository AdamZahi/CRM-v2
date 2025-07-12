import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"

export async function GET(request) {
  try {
    const { userId } = await auth(request)
    console.log("userId:", userId);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get current organization from header or use first available
    const orgId = getCurrentOrgId() // You'll need to implement this

    const [totalLeads, activeLeads, completedLeads, inactiveLeads] = await Promise.all([
      prisma.lead.count({
        where: { organizationId: orgId },
      }),
      prisma.lead.count({
        where: {
          organizationId: orgId,
          status: "ACTIVE",
        },
      }),
      prisma.lead.count({
        where: {
          organizationId: orgId,
          status: "COMPLETED",
        },
      }),
      prisma.lead.count({
        where: {
          organizationId: orgId,
          status: "INACTIVE",
        },
      }),
    ])

    return NextResponse.json({
      totalLeads,
      activeLeads,
      completedLeads,
      inactiveLeads,
    })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function getCurrentOrgId() {
  // This is a simplified version - you'd get this from request headers or session
  // For now, return null and handle in the query
  return 'org2'
}
