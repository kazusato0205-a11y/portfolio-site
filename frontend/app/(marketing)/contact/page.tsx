"use client";

import { useState } from "react";

type FormState = "idle" | "submitting" | "success" | "error";

export default function ContactPage() {
  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus]   = useState<FormState>("idle");

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");

    await new Promise((resolve) => setTimeout(resolve, 800));
    setStatus("success");
  }

  if (status === "success") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-8">
        <div className="text-center">
          <div className="mb-4 text-4xl">✉️</div>
          <h2 className="mb-2 text-xl font-semibold text-gray-900">
            送信が完了しました
          </h2>
          <p className="mb-6 text-sm text-gray-500">
            お問い合わせいただきありがとうございます。
            <br />
            内容を確認のうえ、折り返しご連絡いたします。
          </p>
          <button
            onClick={() => {
              setName("");
              setEmail("");
              setMessage("");
              setStatus("idle");
            }}
            className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
          >
            ← フォームに戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-24 px-8">
      <div className="mx-auto max-w-xl">
        <h1 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900">
          Contact
        </h1>
        <p className="mb-10 text-sm text-gray-500">
          お仕事の依頼やご質問など、お気軽にお問い合わせください。
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              お名前 <span className="text-red-400">*</span>
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="山田 太郎"
              className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              メールアドレス <span className="text-red-400">*</span>
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="message" className="text-sm font-medium text-gray-700">
              メッセージ <span className="text-red-400">*</span>
            </label>
            <textarea
              id="message"
              required
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="お問い合わせ内容をご記入ください"
              className="resize-none rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            />
          </div>

          {status === "error" && (
            <p className="text-sm text-red-500">
              送信に失敗しました。時間をおいて再度お試しください。
            </p>
          )}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {status === "submitting" ? "送信中..." : "送信する"}
          </button>
        </form>
      </div>
    </div>
  );
}
