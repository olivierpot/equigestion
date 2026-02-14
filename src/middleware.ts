import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    const { pathname } = req.nextUrl;

    // Routes publiques
    const publicRoutes = ["/login"];
    const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

    // Routes API auth (toujours accessibles)
    const isAuthApi = pathname.startsWith("/api/auth");

    if (isPublicRoute || isAuthApi) {
        return NextResponse.next();
    }

    // Vérifier l'authentification
    if (!req.auth) {
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Routes admin - vérifier le rôle
    if (pathname.startsWith("/admin")) {
        if (req.auth.user?.role !== "ADMIN") {
            return NextResponse.redirect(new URL("/", req.url));
        }
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (public folder)
         */
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
