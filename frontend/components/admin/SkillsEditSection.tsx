"use client";

import { useActionState, useTransition, useState, useEffect } from "react";
import { createSkill, deleteSkill } from "@/app/admin/dashboard/actions";

type Skill = {
  id: number;
  name: string;
  level: number;
  category: string;
};

function AddSkillForm({ onSuccess }: { onSuccess: () => void }) {
  const [state, formAction, isPending] = useActionState(createSkill, null);

  useEffect(() => {
    if (!state?.success) return;
    const timer = setTimeout(onSuccess, 1500);
    return () => clearTimeout(timer);
  }, [state, onSuccess]);

  return (
    <form action={formAction} className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4">
      <p className="text-sm font-medium text-gray-700">新しいスキルを追加</p>

      <input
        name="name"
        required
        placeholder="スキル名（例：React）"
        className="rounded-lg border border-gray-200 px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
      />
      <input
        name="category"
        required
        placeholder="カテゴリ（例：Frontend）"
        className="rounded-lg border border-gray-200 px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
      />
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-500">レベル（1〜5）</label>
        <input
          name="level"
          type="number"
          required
          min={1}
          max={5}
          defaultValue={3}
          className="w-24 rounded-lg border border-gray-200 px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
        />
      </div>

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

export default function SkillsEditSection({ skills }: { skills: Skill[] }) {
  const [formKey, setFormKey] = useState(0);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, startDeleteTransition] = useTransition();

  function handleDelete(id: number) {
    setDeleteError(null);
    startDeleteTransition(async () => {
      const result = await deleteSkill(id);
      if (!result.success) {
        setDeleteError(result.error ?? "削除に失敗しました");
      }
    });
  }

  return (
    <div className="flex flex-col gap-6">
      {/* 登録済み一覧 */}
      {skills.length === 0 ? (
        <p className="text-sm text-gray-400">スキルがまだ登録されていません。</p>
      ) : (
        <div className="flex flex-col gap-2">
          {deleteError && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-500">{deleteError}</p>
          )}
          <ul className="flex flex-col gap-2">
            {skills.map((skill) => (
              <li
                key={skill.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3 mr-3">
                  <span className="truncate font-medium text-gray-900">{skill.name}</span>
                  <span className="shrink-0 text-xs text-gray-400">{skill.category}</span>
                  <span className="shrink-0 text-xs text-blue-500">Lv.{skill.level}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(skill.id)}
                  disabled={isDeleting}
                  className="shrink-0 rounded px-3 py-1 text-xs font-medium text-red-500 hover:bg-red-50 disabled:opacity-50 transition-colors"
                >
                  削除
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <AddSkillForm key={formKey} onSuccess={() => setFormKey((k) => k + 1)} />
    </div>
  );
}
