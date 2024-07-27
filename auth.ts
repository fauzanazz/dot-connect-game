import authConfig from "@/auth.config"
import { getUserById } from "@/data/user"
import { db } from "@/lib/db"
import { PrismaAdapter } from "@auth/prisma-adapter"
import NextAuth from "next-auth"

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
    callbacks: {
      
      async signIn({ user}) {
        const ExistingUser = await getUserById(user.id)
        if (!ExistingUser) {
          return false
        }
        return true
      },

      async session({ session, token }) {
        if (token.sub && session.user) {
          session.user.id = token.sub
        }

        return session
      },

      async jwt({ token }){

        if (!token?.sub) {
          return token
        }

        return token
      }
    },
    adapter: PrismaAdapter(db),
    session: {
        strategy: "jwt",
    },
    ...authConfig,
})