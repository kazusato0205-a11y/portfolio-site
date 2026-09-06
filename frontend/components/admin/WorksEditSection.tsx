"use client";

import { useActionState, useTransition, useState, useEffect } from "react";
import { createWork, updateWork, deleteWork } from "@/app/admin/dashboard/actions";

type Work = {
  id: number;
  title: string;
  description: string;
  link: string | null;
};

function AddWorkForm({ onSuccess }: { onSuccess: () => void }) {
  const [state, formAction, isPending] = useActionState(createWork, null);

  useEffect(() => {
    if (!state?.success) return;
    const timer = setTimeout(onSuccess, 1500);
    return () => clearTimeout(timer);
  }, [state, onSuccess]);

  return (
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
  );
}

function EditWorkForm({ work, onClose }: { work: Work; onClose: () => void }) {
  const updateWorkWithId = updateWork.bind(null, work.id);
  const [state, formAction, isPending] = useActionState(updateWorkWithId, null);

  useEffect(() => {
    if (!state?.success) return;
    const timer = setTimeout(onClose, 1000);
    return () => clearTimeout(timer);
  }, [state, onClose]);

  return (
    <form action={formAction} className="flex flex-col gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
      <input
        name="title"
        required
        defaultValue={work.title}
        placeholder="タイトル"
        className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
      />
      <textarea
        name="description"
        required
        rows={6}
        defaultValue={work.description}
        placeholder="説明"
        className="resize-none rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
      />
      <input
        name="link"
        type="url"
        defaultValue={work.link ?? ""}
        placeholder="リンク（任意）"
        className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
      />

      {state?.error   && <p className="text-sm text-red-500">{state.error}</p>}
      {state?.success && <p className="text-sm text-green-600">更新しました</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50 transition-colors"
        >
          {isPending ? "更新中..." : "保存する"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-gray-200 bg-white px-5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          キャンセル
        </button>
      </div>
    </form>
  );
}

export default function WorksEditSection({ works }: { works: Work[] }) {
  const [formKey, setFormKey] = useState(0);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, startDeleteTransition] = useTransition();

  function handleDelete(id: number) {
    setDeleteError(null);
    startDeleteTransition(async () => {
      const result = await deleteWork(id);
      if (!result.success) {
        setDeleteError(result.error ?? "削除に失敗しました");
      }
    });
  }

  return (
    <div className="flex flex-col gap-6">
      {/* 登録済み一覧 */}
      {works.length === 0 ? (
        <p className="text-sm text-gray-400">実績がまだ登録されていません。</p>
      ) : (
        <div className="flex flex-col gap-2">
          {deleteError && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-500">{deleteError}</p>
          )}
          <ul className="flex flex-col gap-2">
            {works.map((work) => (
              <li key={work.id} className="flex flex-col gap-2">
                {editingId === work.id ? (
                  <EditWorkForm work={work} onClose={() => setEditingId(null)} />
                ) : (
                  <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm">
                    <div className="min-w-0 flex-1 mr-3">
                      <p className="truncate font-medium text-gray-900">{work.title}</p>
                      {work.link && (
                        <p className="truncate text-xs text-gray-400 mt-0.5">{work.link}</p>
                      )}
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setEditingId(work.id)}
                        className="rounded px-3 py-1 text-xs font-medium text-blue-500 hover:bg-blue-50 transition-colors"
                      >
                        編集
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(work.id)}
                        disabled={isDeleting}
                        className="rounded px-3 py-1 text-xs font-medium text-red-500 hover:bg-red-50 disabled:opacity-50 transition-colors"
                      >
                        削除
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <AddWorkForm key={formKey} onSuccess={() => setFormKey((k) => k + 1)} />
    </div>
  );
}
