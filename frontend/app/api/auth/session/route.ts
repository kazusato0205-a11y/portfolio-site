import { NextResponse } from "next/server";

// ログイン後に呼ばれる：セッションクッキーをセットする
export async function POST(request: Request) {
  const { token } = await request.json();

  if (!token) {
    return NextResponse.json({ error: "トークンがありません" }, { status: 400 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60, // 1時間
    path: "/",
  });
  return response;
}

// ログアウト時に呼ばれる：maxAge: -1 でクッキーを即時破棄する
export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set("session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: -1,
    path: "/",
  });
  return response;
}
