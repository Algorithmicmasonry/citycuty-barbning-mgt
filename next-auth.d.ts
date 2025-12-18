import { DefaultSession, DefaultUser } from "next-auth"
import { JWT } from "next-auth/jwt"

/**
 * Match this with your Prisma enum
 */
export type UserRole = "ADMIN" | "SALES_REP"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: UserRole
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    role: UserRole
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: UserRole
  }
}
