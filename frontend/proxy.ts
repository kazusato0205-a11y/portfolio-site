import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ADMIN_PATHS = ["/admin/login"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = !PUBLIC_ADMIN_PATHS.includes(pathname);
  if (isProtected) {
    const session = request.cookies.get("session");
    if (!session?.value) {
      // リダイレクトではなく HTTP 404 を返す（要件）
      return new NextResponse(null, { status: 404 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"], // /admin/* にだけ適用
};
