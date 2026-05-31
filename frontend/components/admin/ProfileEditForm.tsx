"use client";

import { useActionState } from "react";
import { updateProfile } from "@/app/admin/dashboard/actions";

type Profile = {
  id: number;
  name: string;
  bio: string;
};

export default function ProfileEditForm({ profile }: { profile: Profile | null }) {
  const updateProfileWithId = profile
    ? updateProfile.bind(null, profile.id)
    : null;

  const [state, formAction, isPending] = useActionState(
    updateProfileWithId ?? (async () => ({ error: "プロフィールが存在しません" })),
    null
  );

  if (!profile) {
    return <p className="text-sm text-gray-400">プロフィールがまだ登録されていません。</p>;
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">名前</label>
        <input
          name="name"
          required
          defaultValue={profile.name}
          className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">自己紹介</label>
        <textarea
          name="bio"
          required
          rows={4}
          defaultValue={profile.bio}
          className="resize-none rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
        />
      </div>

      {state?.error   && <p className="text-sm text-red-500">{state.error}</p>}
      {state?.success && <p className="text-sm text-green-600">保存しました</p>}

      <button
        type="submit"
        disabled={isPending}
        className="self-start rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50 transition-colors"
      >
        {isPending ? "保存中..." : "保存する"}
      </button>
    </form>
  );
}
