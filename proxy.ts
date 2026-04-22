import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/infrastructure/auth/auth-config'

// Routes qui nécessitent une authentification
const protectedRoutes = ['/admin', '/profile', '/favoris', '/mes-demandes']

// Routes qui nécessitent un rôle admin
const adminRoutes = ['/admin']

// Routes d'authentification (redirection si déjà connecté)
const authRoutes = ['/login', '/register']

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Redirect old /terrains routes to /proprietes
    if (pathname.startsWith('/terrains')) {
        const newPathname = pathname.replace('/terrains', '/proprietes')
        return NextResponse.redirect(new URL(newPathname + request.nextUrl.search, request.url))
    }

    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
    const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))
    const isAuthRoute = authRoutes.includes(pathname)

    // Skip session check entirely for public pages — avoids 6-8s DB call on every navigation
    if (!isProtectedRoute && !isAdminRoute && !isAuthRoute) {
        return NextResponse.next()
    }

    // Only fetch session when the route actually needs it
    let session = null
    try {
        session = await auth.api.getSession({ headers: request.headers })
    } catch {
        // Session fetch failed — treat as unauthenticated
    }

    if (isAdminRoute) {
        if (!session?.user) {
            return NextResponse.rewrite(new URL('/404', request.url))
        }
        const userRole = (session.user as any).role?.toUpperCase()
        const isAdmin = userRole === 'ADMIN' || userRole === 'SUPER_ADMIN'
        if (!isAdmin) {
            return NextResponse.rewrite(new URL('/404', request.url))
        }
        return NextResponse.next()
    }

    if (isProtectedRoute) {
        if (!session?.user) {
            const loginUrl = new URL('/login', request.url)
            loginUrl.searchParams.set('redirect', pathname)
            return NextResponse.redirect(loginUrl)
        }
        return NextResponse.next()
    }

    // Auth routes (/login, /register) — redirect if already logged in
    if (isAuthRoute && session?.user) {
        const userRole = (session.user as any).role?.toUpperCase()
        const isAdmin = userRole === 'ADMIN' || userRole === 'SUPER_ADMIN'
        return NextResponse.redirect(new URL(isAdmin ? '/admin' : '/', request.url))
    }

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
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}
