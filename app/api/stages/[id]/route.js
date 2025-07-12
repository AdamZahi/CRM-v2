import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"

export async function PATCH(request, { params }) {
  try {
    const { userId } = await auth(request)

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    const stage = await prisma.stage.update({
      where: { id },
      data: body,
    })

    return NextResponse.json(stage)
  } catch (error) {
    console.error("Error updating stage:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { userId } = await auth(request)

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    // Delete all leads in this stage first
    await prisma.lead.deleteMany({
      where: { stageId: id },
    })

    // Then delete the stage
    await prisma.stage.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting stage:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
