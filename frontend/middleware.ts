import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /admin/login 自体は保護しない（ログインページは誰でも見られる）
  if (pathname === "/admin/login") return NextResponse.next();

  // /admin/* へのアクセスにはセッションクッキーが必要
  const session = request.cookies.get("session");
  if (!session?.value) {
    // リダイレクトではなく HTTP 404 を返す（要件）
    return new NextResponse(null, { status: 404 });
  }

  return NextResponse.next();// 通行証あり → 通過
}

export const config = {
  matcher: ["/admin/:path*"], // /admin/* にだけ適用
};
