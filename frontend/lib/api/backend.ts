const BACKEND_URL = process.env.BACKEND_URL;

if (!BACKEND_URL) {
  throw new Error("BACKEND_URL が設定されていません。.env.local を確認してください。");
}

export async function fetchFromBackend<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${BACKEND_URL}${cleanEndpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`バックエンド通信エラー: ${response.status} ${endpoint}`);
    }

    return response.json() as Promise<T>;
  } catch (error) {
    console.error("Expressへの接続に失敗しました:", error);
    throw error;
  }
}
