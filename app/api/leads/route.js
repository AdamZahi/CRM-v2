import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"

export async function GET(request) {
  try {
    const { userId } = await auth(request)

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const leads = await prisma.lead.findMany({
      include: {
        stage: true,
        assignedTo: true,
        organization: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(leads)
  } catch (error) {
    console.error("Error fetching leads:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, email, phone, source, status, stageId, reminder } = body

    // For now, use a default organization - you'll need to implement org selection
    const userOrgs = await prisma.userOrganization.findMany({
      where: { userId },
    })

    if (userOrgs.length === 0) {
      return NextResponse.json({ error: "No organization found" }, { status: 400 })
    }

    const lead = await prisma.lead.create({
      data: {
        name,
        email,
        phone,
        source,
        status,
        stageId,
        reminder,
        organizationId: userOrgs[0].organizationId,
        assignedToId: userId,
      },
      include: {
        stage: true,
        assignedTo: true,
        organization: true,
      },
    })

    return NextResponse.json(lead)
  } catch (error) {
    console.error("Error creating lead:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
