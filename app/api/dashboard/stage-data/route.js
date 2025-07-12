import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"

export async function GET(request) {
  try {
    const { userId } = await auth(request)

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const stageData = await prisma.stage.findMany({
      include: {
        _count: {
          select: { leads: true },
        },
      },
      // Add organizationId filter when you implement org selection
    })

    const formattedData = stageData.map((stage) => ({
      name: stage.name,
      count: stage._count.leads,
    }))

    return NextResponse.json(formattedData)
  } catch (error) {
    console.error("Error fetching stage data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
