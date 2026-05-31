"use client";

import { useActionState } from "react";
import { createWork, deleteWork } from "@/app/admin/dashboard/actions";

type Work = {
  id: number;
  title: string;
  description: string;
  link: string | null;
};

export default function WorksEditSection({ works }: { works: Work[] }) {
  const [state, formAction, isPending] = useActionState(createWork, null);

  return (
    <div className="flex flex-col gap-6">
      {/* 登録済み一覧 */}
      {works.length === 0 ? (
        <p className="text-sm text-gray-400">実績がまだ登録されていません。</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {works.map((work) => (
            <li
              key={work.id}
              className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm"
            >
              <div>
                <p className="font-medium text-gray-900">{work.title}</p>
                {work.link && (
                  <p className="text-xs text-gray-400 mt-0.5">{work.link}</p>
                )}
              </div>
              <form action={deleteWork.bind(null, work.id)}>
                <button
                  type="submit"
                  className="rounded px-3 py-1 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
                >
                  削除
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}

      {/* 新規追加フォーム */}
      <form action={formAction} className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4">
        <p className="text-sm font-medium text-gray-700">新しい実績を追加</p>

        <input
          name="title"
          required
          placeholder="タイトル"
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
        />
        <textarea
          name="description"
          required
          rows={3}
          placeholder="説明"
          className="resize-none rounded-lg border border-gray-200 px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
        />
        <input
          name="link"
          type="url"
          placeholder="リンク（任意）"
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
        />

        {state?.error   && <p className="text-sm text-red-500">{state.error}</p>}
        {state?.success && <p className="text-sm text-green-600">追加しました</p>}

        <button
          type="submit"
          disabled={isPending}
          className="self-start rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50 transition-colors"
        >
          {isPending ? "追加中..." : "追加する"}
        </button>
      </form>
    </div>
  );
}
