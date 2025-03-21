import NextAuth from 'next-auth';
import authConfig from './auth.config';
import { NextResponse } from 'next/server';

export const { auth } = NextAuth(authConfig);

const publicPages = [
  '/',
  '/search',
  '/sign-in',
  '/sign-up',
  '/cart',
  '/cart/(.*)',
  '/product/(.*)',
  '/page/(.*)',
];

export default auth((req) => {
  const publicPathnameRegex = new RegExp(
    `^(${publicPages.flatMap((p) => (p === '/' ? ['', '/'] : p)).join('|')})/?$`,
    'i'
  );

  const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname);

  if (isPublicPage) {
    return NextResponse.next();
  }

  if (!req.auth) {
    const newUrl = new URL(
      `/sign-in?callbackUrl=${encodeURIComponent(req.nextUrl.pathname) || '/'}`,
      req.nextUrl.origin
    );
    return NextResponse.redirect(newUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
