const BACKEND_URL = process.env.BACKEND_URL;

if (!BACKEND_URL) {
  throw new Error("BACKEND_URL が設定されていません。.env.local を確認してください。");
}

export async function fetchBackend<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BACKEND_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`バックエンドへのリクエストが失敗しました: ${res.status} ${path}`);
  }

  return res.json() as Promise<T>;
}
