import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  adapter: PrismaAdapter(prisma),
  // DB sessions so the server always owns the session state.
  session: { strategy: "database" },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          prompt: "consent"
        }
      }
    })
  ],
  callbacks: {
    session({ session, user }) {
      // Stable userId for server-side checks.
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login"
  }
});
