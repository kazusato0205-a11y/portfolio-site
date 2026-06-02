"use client";

import { useActionState } from "react";
import { updateProfile, createProfile } from "@/app/admin/dashboard/actions";

type Profile = {
  id: number;
  name: string;
  bio: string;
};

function ProfileForm({
  action,
  isPending,
  state,
  defaultValues,
  submitLabel,
  successLabel,
}: {
  action: (payload: FormData) => void;
  isPending: boolean;
  state: { error?: string; success?: boolean } | null;
  defaultValues?: { name: string; bio: string };
  submitLabel: string;
  successLabel: string;
}) {
  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">名前</label>
        <input
          name="name"
          required
          defaultValue={defaultValues?.name ?? ""}
          className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">自己紹介</label>
        <textarea
          name="bio"
          required
          rows={4}
          defaultValue={defaultValues?.bio ?? ""}
          className="resize-none rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
        />
      </div>

      {state?.error   && <p className="text-sm text-red-500">{state.error}</p>}
      {state?.success && <p className="text-sm text-green-600">{successLabel}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="self-start rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50 transition-colors"
      >
        {isPending ? "処理中..." : submitLabel}
      </button>
    </form>
  );
}

export default function ProfileEditForm({ profile }: { profile: Profile | null }) {
  const [createState, createAction, isCreating] = useActionState(createProfile, null);
  const [updateState, updateAction, isUpdating] = useActionState(
    profile ? updateProfile.bind(null, profile.id) : async () => ({ error: "プロフィールが存在しません" }),
    null
  );

  if (!profile) {
    return (
      <ProfileForm
        action={createAction}
        isPending={isCreating}
        state={createState}
        submitLabel="登録する"
        successLabel="登録しました"
      />
    );
  }

  return (
    <ProfileForm
      action={updateAction}
      isPending={isUpdating}
      state={updateState}
      defaultValues={{ name: profile.name, bio: profile.bio }}
      submitLabel="保存する"
      successLabel="保存しました"
    />
  );
}
