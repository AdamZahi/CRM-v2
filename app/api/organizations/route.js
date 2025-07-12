import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"
import { ensureUserExists } from "@/lib/clerk"

export async function GET(request) {
  try {
    const { userId } = await auth(request)

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Ensure user exists in database
    await ensureUserExists(userId)

    const userOrganizations = await prisma.userOrganization.findMany({
      where: { userId },
      include: {
        organization: true,
      },
    })

    const organizations = userOrganizations.map((uo) => uo.organization)

    return NextResponse.json(organizations)
  } catch (error) {
    console.error("Error fetching organizations:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
