import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"

export async function GET(request) {
  try {
    const { userId } = await auth(request)

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const stages = await prisma.stage.findMany({
      orderBy: { position: "asc" },
    })

    return NextResponse.json(stages)
  } catch (error) {
    console.error("Error fetching stages:", error)
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
    const { name } = body

    // Get user's organization
    const userOrgs = await prisma.userOrganization.findMany({
      where: { userId },
    })

    if (userOrgs.length === 0) {
      return NextResponse.json({ error: "No organization found" }, { status: 400 })
    }

    // Get the highest position for new stage
    const lastStage = await prisma.stage.findFirst({
      where: { organizationId: userOrgs[0].organizationId },
      orderBy: { position: "desc" },
    })

    const stage = await prisma.stage.create({
      data: {
        name,
        position: (lastStage?.position || 0) + 1,
        organizationId: userOrgs[0].organizationId,
      },
    })

    return NextResponse.json(stage)
  } catch (error) {
    console.error("Error creating stage:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
