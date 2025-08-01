import NextAuth from "next-auth";

import authConfig from "@/auth.config";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "@/routes";

const { auth } = NextAuth(authConfig);

/**
 * Middleware to handle authentication and authorization for the app.
 *
 * Return values:
 * - null: continue processing the request
 * - Response.redirect: redirect to the given URL
 */
export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    // Since this is an API route for auth, we should let it through
    return;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      // If the user is alreadylogged in, no need to go to auth route again
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    } else {
      // Otherwise, continue to the auth route
      return;
    }
  }

  if (!isLoggedIn && !isPublicRoute) {
    // Non public routes require authentication
    return Response.redirect(new URL("/auth/login", nextUrl));
  }

  // If the user is logged in, continue
  return;
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
