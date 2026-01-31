import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  // Protected routes
  const protectedRoutes = [
    "/dashboard",
    "/subscriptions",
    "/calendar",
    "/analytics",
    "/settings",
    "/folders",
    "/tags",
    "/payment-methods",
  ]

  // Auth routes (redirect to dashboard if logged in)
  const authRoutes = ["/login", "/register"]

  const isProtectedRoute = protectedRoutes.some((route) =>
    nextUrl.pathname.startsWith(route),
  )

  const isAuthRoute = authRoutes.some((route) =>
    nextUrl.pathname.startsWith(route),
  )

  // Redirect to login if trying to access protected route without auth
  if (isProtectedRoute && !isLoggedIn) {
    const redirectUrl = new URL("/login", nextUrl.origin)
    redirectUrl.searchParams.set("callbackUrl", nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Redirect to dashboard if trying to access auth routes while logged in
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl.origin))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
