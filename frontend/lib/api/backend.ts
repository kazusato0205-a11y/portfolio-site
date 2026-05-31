const BACKEND_URL = process.env.BACKEND_URL;

if (!BACKEND_URL) {
  throw new Error("BACKEND_URL が設定されていません。.env.local を確認してください。");
}

export async function fetchFromBackend<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${BACKEND_URL}${cleanEndpoint}`;

  // body が文字列（JSON.stringify の戻り値）のときだけ Content-Type: application/json を付与する
  // FormData のときは fetch が boundary 付きで自動セットするため付与しない
  // body なし（GET/DELETE）や将来の Blob 等は呼び出し元が明示的にヘッダーを渡す
  const contentTypeHeader: Record<string, string> =
    typeof options.body === "string" ? { "Content-Type": "application/json" } : {};

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...contentTypeHeader,
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
