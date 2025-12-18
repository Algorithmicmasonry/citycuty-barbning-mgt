import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import  {authOptions } from "@/app/api/auth/[...nextauth]/route"

export default async function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();

  // Allow public routes
  if (url.pathname.startsWith("/login") || url.pathname === "/") {
    return NextResponse.next();
  }

  // Get session server-side
  const session = await getServerSession(authOptions);

  if (!session) {
    // Redirect unauthenticated users to login
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Protect admin routes
  if (url.pathname.startsWith("/admin") && session.user.role !== "ADMIN") {
    url.pathname = "/unauthorized"; // you can create this page
    return NextResponse.redirect(url);
  }

  // Protect sales rep routes
  if (url.pathname.startsWith("/sales") && session.user.role !== "SALES_REP") {
    url.pathname = "/unauthorized";
    return NextResponse.redirect(url);
  }

  // Allow access
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/sales/:path*"], // paths to protect
};

