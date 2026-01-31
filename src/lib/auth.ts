import { MongoDBAdapter } from "@auth/mongodb-adapter"
import { ObjectId } from "mongodb"
import type { NextAuthConfig } from "next-auth"
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import clientPromise from "./mongodb-client"

export const authConfig: NextAuthConfig = {
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  events: {
    async createUser({ user }) {
      // Set default values for new users
      const client = await clientPromise
      const db = client.db()
      const usersCollection = db.collection("users")

      await usersCollection.updateOne(
        { _id: new ObjectId(user.id) },
        {
          $set: {
            currency: "USD",
            defaultAlertDays: 3,
            emailAlerts: true,
            weeklyDigest: false,
          },
        },
      )
    },
  },
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)
