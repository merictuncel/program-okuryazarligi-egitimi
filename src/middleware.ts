import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Login sayfası herkese açık
        if (pathname.startsWith("/admin/login")) {
          return true;
        }

        // /admin altındaki diğer tüm sayfalar için oturum zorunlu
        if (pathname.startsWith("/admin")) {
          return !!token;
        }

        return true;
      },
    },
  },
);

export const config = {
  matcher: ["/admin/:path*"],
};
