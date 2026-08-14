import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { checkDatabaseHealth, getCircuitState, recordDbFailure, recordDbSuccess, withTimeout } from './lib/circuit-breaker';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Evitar interceptar estáticos y health-check
  if (
    pathname.startsWith('/api/health') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico')
  ) {
    return NextResponse.next();
  }

  // Comportamiento especial para la ruta /maintenance:
  // Si el usuario entra o refresca /maintenance y la base de datos YA está activa, redirigir a /
  if (pathname === '/maintenance') {
    const health = await checkDatabaseHealth();
    if (health.isHealthy) {
      const homeUrl = request.nextUrl.clone();
      homeUrl.pathname = '/';
      return NextResponse.redirect(homeUrl);
    }
    return NextResponse.next();
  }

  // Si el circuito está abierto, redirigir inmediatamente a /maintenance (Fail-Fast)
  const circuit = getCircuitState();
  if (circuit.status === 'OPEN') {
    const url = request.nextUrl.clone();
    url.pathname = '/maintenance';
    return NextResponse.redirect(url);
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  let user = null;
  try {
    // Proteger getUser con timeout estricto de 2500ms
    const authResult = await withTimeout(
      supabase.auth.getUser(),
      2500,
      'Timeout en autenticación Supabase'
    );
    user = authResult.data.user;
    recordDbSuccess();
  } catch (error: any) {
    recordDbFailure(error);

    // Si es una ruta protegida y la DB está caída, redirigir a mantenimiento
    const protectedPaths = ['/profile', '/dashboard', '/matches', '/players'];
    const isProtectedRoute = protectedPaths.some((path) => pathname.startsWith(path));

    if (isProtectedRoute) {
      const url = request.nextUrl.clone();
      url.pathname = '/maintenance';
      return NextResponse.redirect(url);
    }
  }

  // Protected routes: redirect to login if not authenticated
  const protectedPaths = ['/profile'];
  const isProtectedRoute = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Auth routes: redirect to dashboard if already authenticated
  const authPaths = ['/login'];
  const isAuthRoute = authPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (isAuthRoute && user) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
