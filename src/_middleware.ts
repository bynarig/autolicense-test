// import { NextResponse } from 'next/server';
// import { NextRequest } from 'next/server';
//
// // Define protected paths that require authentication
// const protectedPaths = ['/user/profile'];
//
// export async function middleware(request: NextRequest) {
//   const path = request.nextUrl.pathname;
//
//   // Check if the path is in the protected paths list
//   const isProtectedPath = protectedPaths.some(protectedPath =>
//     path === protectedPath || path.startsWith(`${protectedPath}/`)
//   );
//
//   // Only apply redirects to protected paths
//   if (isProtectedPath) {
//     // Check for the session token cookie
//     // Looking for both regular and secure cookie variants
//     const hasSessionToken =
//       request.cookies.has('next-auth.session-token') ||
//       request.cookies.has('__Secure-next-auth.session-token');
//
//     // For development environment
//     const hasDevSessionToken = request.cookies.has('next-auth.session-token');
//
//     // If no session token exists, redirect to the login page
//     if (!hasSessionToken && !hasDevSessionToken) {
//       const signInUrl = new URL('/user/login', request.url);
//       signInUrl.searchParams.set('callbackUrl', request.url);
//       return NextResponse.redirect(signInUrl);
//     }
//   }
//
//   return NextResponse.next();
// }
//
// // Configure middleware to match only the specified protected paths
// export const config = {
//   matcher: [
//     '/user/profile/:path*',
//     // Add other protected paths here
//   ],
// };