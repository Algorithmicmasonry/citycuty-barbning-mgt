import prisma from "@/lib/prisma"
import 'dotenv/config'
import bcrypt from "bcrypt"







async function main() {
  const password = await bcrypt.hash("password123", 10)

  await prisma.user.upsert({
    where: { email: "admin@citycut.com" },
    update: {},
    create: {
      email: "admin@citycut.com",
      passwordHash: password,
      role: "ADMIN",
    },
  })

  await prisma.user.upsert({
    where: { email: "sales@citycut.com" },
    update: {},
    create: {
      email: "sales@citycut.com",
      passwordHash: password,
      role: "SALES_REP",
    },
  })
}

main()
