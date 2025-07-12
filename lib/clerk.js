import { auth } from "@clerk/nextjs/server"
import { prisma } from "./db"

export async function getCurrentUser() {
  const { userId } = await auth()

  if (!userId) {
    return null
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      orgLinks: {
        include: {
          organization: true,
        },
      },
    },
  })

  return user
}

export async function getCurrentUserOrganizations() {
  const user = await getCurrentUser()

  if (!user) {
    return []
  }

  return user.orgLinks.map((link) => link.organization)
}

export async function ensureUserExists(userId, email, name) {
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!existingUser) {
    return await prisma.user.create({
      data: {
        id: userId,
        email,
        name,
      },
    })
  }

  return existingUser
}
