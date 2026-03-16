import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// DEMO MODE: All routes are public so seed data is visible without login.
// In production, remove '(.*)' from publicRoutes and enforce auth per route.
const isPublicRoute = createRouteMatcher([
  "/",
  "(.*)", // DEMO OVERRIDE — bypass Clerk for all routes
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks/clerk",
  "/api/webhooks/postmark",
  "/api/recaps/(.*)/confirm",
  "/api/recaps/(.*)/confirm/(.*)",
  "/dashboard(.*)",
  "/settings(.*)",
  "/queues(.*)",
  "/onboarding(.*)",
  "/api/(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
