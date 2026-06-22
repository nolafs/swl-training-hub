import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)']);
const isPendingRoute = createRouteMatcher(['/pending(.*)']);
const isAdminRoute = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();
  const metadata = (sessionClaims?.metadata as Record<string, unknown>) ?? {};
  const approved = metadata.approved as boolean | undefined;
  const role = metadata.role as string | undefined;

  console.log('META DATA', metadata);
  console.log('userId', metadata);
  console.log('sessionClaims', sessionClaims);

  // /sign-in and /sign-up — public, but bounce signed-in users
  if (isPublicRoute(req)) {
    if (userId) {
      return NextResponse.redirect(new URL(approved ? '/' : '/pending', req.url));
    }
    return NextResponse.next();
  }

  // /pending — requires auth, but NOT approval
  // Redirect unauthenticated → /sign-in, approved users → /
  if (isPendingRoute(req)) {
    if (!userId) return NextResponse.redirect(new URL('/sign-in', req.url));
    if (approved) return NextResponse.redirect(new URL('/', req.url));
    return NextResponse.next();
  }

  // All other routes — require auth + approval
  if (!userId) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }
  if (!approved) {
    return NextResponse.redirect(new URL('/pending', req.url));
  }

  // /admin — additionally requires role=admin
  if (isAdminRoute(req) && role !== 'admin') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};