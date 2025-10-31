import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that require authentication
const protectedRoutes = [
  '/dashboard', 
  '/profile', 
  '/admin', 
  '/settings'
]

// Routes that require specific subscription tiers
const premiumRoutes = ['/mentoring', '/ai-interview']
const proRoutes = ['/analytics', '/advanced-study-plans']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Get token from cookie
  const token = request.cookies.get('auth-token')?.value
  
  // Check if route requires authentication
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  
  if (isProtectedRoute) {
    if (!token) {
      // Redirect to login if no token
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
    // Note: Full JWT verification happens in API routes and components
    // Middleware just checks for token presence for performance
  }
  
  // Don't redirect authenticated users away from auth pages
  // Let the AuthContext handle this logic instead
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|logos|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)',
  ],
}