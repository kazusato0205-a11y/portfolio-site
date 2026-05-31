import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /admin/login 以外の /admin/* はセッションクッキーが必要
  if (pathname !== "/admin/login") {
    const session = request.cookies.get("session");
    if (!session?.value) {
      // リダイレクトではなく HTTP 404 を返す（要件）
      return new NextResponse(null, { status: 404 });
    }
  }

  // layout.tsx が isAdmin 判定に使う x-pathname を注入して通過
  const res = NextResponse.next();
  res.headers.set("x-pathname", pathname);
  return res;
}

export const config = {
  matcher: ["/admin/:path*"], // /admin/* にだけ適用
};
