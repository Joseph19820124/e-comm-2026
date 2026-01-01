import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

// Base config without database access (Edge-compatible)
export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      // authorize is defined in auth.ts (Node.js runtime only)
      authorize: async () => null,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
    async authorized({ auth, request }) {
      const { pathname } = request.nextUrl;

      // Admin routes protection
      if (pathname.startsWith("/admin")) {
        if (pathname === "/admin/login") {
          return true;
        }
        return auth?.user?.role === "ADMIN";
      }

      // Shop protected routes
      if (pathname.startsWith("/account") || pathname === "/checkout") {
        if (!auth?.user) {
          const loginUrl = new URL("/login", request.url);
          loginUrl.searchParams.set("callbackUrl", pathname);
          return Response.redirect(loginUrl);
        }
        return true;
      }

      return true;
    },
  },
  pages: {
    signIn: "/login",
  },
};
