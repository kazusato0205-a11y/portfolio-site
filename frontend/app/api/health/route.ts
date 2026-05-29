import { NextResponse } from "next/server";
import { fetchFromBackend } from "@/lib/api/backend";

export async function GET() {
  try {
    const data = await fetchFromBackend<{ status: string }>("/health");
    return NextResponse.json({ frontend: "ok", backend: data.status });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "不明なエラー";
    return NextResponse.json({ frontend: "ok", backend: "error", message }, { status: 502 });
  }
}
