"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase/client";

type FormState = "idle" | "submitting" | "error";

const ERROR_MESSAGES: Record<string, string> = {
  "auth/invalid-credential":    "メールアドレスまたはパスワードが正しくありません。",
  "auth/user-not-found":        "メールアドレスまたはパスワードが正しくありません。",
  "auth/wrong-password":        "メールアドレスまたはパスワードが正しくありません。",
  "auth/too-many-requests":     "ログイン試行が多すぎます。しばらくしてから再試行してください。",
  "auth/network-request-failed":"ネットワークエラーが発生しました。接続を確認してください。",
  "session":                    "セッションの作成に失敗しました。もう一度お試しください。",
};

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus]     = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      //Firebase のサーバーに「このメール・パスワードは正しいですか？」と問い合わせる
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      //正しければ userCredential（ログイン証明書）が返ってくるので、そこから ID トークンを取り出す
      const token = await userCredential.user.getIdToken();

      // IDトークンをサーバー側の Route Handler に送り、httpOnly クッキーとして保存してもらう
      const response = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (!response.ok) {
        throw new Error("session");
      }

      router.push("/admin/dashboard");
    } catch (error) {
      const code = (error as { code?: string }).code ?? "";
      setErrorMessage(
        ERROR_MESSAGES[code] ?? "ログインに失敗しました。もう一度お試しください。"
      );
      setStatus("error");
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-8">
      <div className="w-full max-w-sm">
        <h1 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900">
          管理者ログイン
        </h1>
        <p className="mb-8 text-sm text-gray-500">
          管理画面にアクセスするにはログインが必要です。
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              メールアドレス
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              パスワード
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            />
          </div>

          {status === "error" && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {status === "submitting" ? "ログイン中..." : "ログイン"}
          </button>
        </form>
      </div>
    </div>
  );
}
