// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { Role } from "@prisma/client";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Définir les routes protégées par rôle
    const roleRoutes: Record<string, Role[]> = {
      "/dashboard/author": [Role.AUTHOR, Role.ADMIN],
      "/dashboard/reviewer": [Role.REVIEWER, Role.ADMIN],
      "/dashboard/editor": [Role.EDITOR, Role.ADMIN],
      "/dashboard/admin": [Role.ADMIN],
      "/submit": [Role.AUTHOR, Role.ADMIN],
    };

    // Vérifier si la route nécessite un rôle spécifique
    for (const [route, allowedRoles] of Object.entries(roleRoutes)) {
      if (path.startsWith(route)) {
        if (!token?.role || !allowedRoles.includes(token.role as Role)) {
          return NextResponse.redirect(new URL("/unauthorized", req.url));
        }
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

// Spécifier les routes à protéger
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/submit/:path*",
    "/profile/:path*",
  ],
};