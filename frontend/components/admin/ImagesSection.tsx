"use client";

import { useTransition, useRef, useState } from "react";
import { uploadImage, setProfileAvatar, deleteImage } from "@/app/admin/dashboard/actions";

type Image = { id: number; url: string; filename: string };

type Props = {
  images: Image[];
  profileId: number | null;
};

export default function ImagesSection({ images, profileId }: Props) {
  const [isPending, startTransition] = useTransition();
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("ファイルサイズは 5MB 以下にしてください");
      setSelectedFileName(null);
      return;
    }

    setUploadError(null);
    setUploadSuccess(false);
    setSelectedFileName(file.name);

    const formData = new FormData();
    formData.append("file", file);

    startTransition(async () => {
      const result = await uploadImage(formData);
      if (result.success) {
        if (inputRef.current) inputRef.current.value = "";
        setSelectedFileName(null);
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 2000);
      } else {
        setUploadError(result.error ?? "アップロードに失敗しました");
      }
    });
  }

  function handleSetAvatar(imageId: number) {
    if (!profileId) return;
    startTransition(async () => {
      await setProfileAvatar(profileId, imageId);
    });
  }

  function handleDelete(imageId: number) {
    setDeleteError(null);
    startTransition(async () => {
      const result = await deleteImage(imageId);
      if (!result.success) setDeleteError(result.error ?? "削除に失敗しました");
    });
  }

  return (
    <div className="flex flex-col gap-6">
      {/* アップロードエリア */}
      <div className="rounded-lg border border-dashed border-gray-300 bg-white p-6 flex flex-col items-center gap-3">
        <p className="text-sm text-gray-500">画像ファイルを選択してください（5MB 以下）</p>
        <input
          ref={inputRef}
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isPending}
          className="sr-only"
        />
        <div className="flex items-center gap-3">
          <label
            htmlFor="image-upload"
            className="cursor-pointer rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100 transition-colors aria-disabled:opacity-50"
            aria-disabled={isPending}
          >
            ファイルを選択
          </label>
          <span className={`text-sm ${uploadSuccess ? "text-green-600" : "text-gray-400"}`}>
            {uploadSuccess ? "アップロードしました" : (selectedFileName ?? "選択されていません")}
          </span>
        </div>
        {uploadError && <p className="text-sm text-red-500">{uploadError}</p>}
      </div>

      {/* 登録済み画像一覧 */}
      {images.length === 0 ? (
        <p className="text-sm text-gray-400">画像がまだ登録されていません。</p>
      ) : (
        <div className="flex flex-col gap-2">
          {deleteError && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-500">{deleteError}</p>
          )}
          <ul className="grid gap-4 sm:grid-cols-2">
            {images.map((image) => (
              <li
                key={image.id}
                className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white"
              >
                {/* サムネイル */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.url}
                  alt={image.filename}
                  className="h-40 w-full object-cover bg-gray-100"
                />
                {/* ファイル名・操作ボタン */}
                <div className="flex items-center justify-between gap-2 px-3 py-2">
                  <p className="truncate text-xs text-gray-500">{image.filename}</p>
                  <div className="flex shrink-0 gap-2">
                    {profileId && (
                      <button
                        onClick={() => handleSetAvatar(image.id)}
                        disabled={isPending}
                        className="rounded px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 disabled:opacity-50 transition-colors"
                      >
                        プロフィールに設定
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(image.id)}
                      disabled={isPending}
                      className="rounded px-2 py-1 text-xs font-medium text-red-500 hover:bg-red-50 disabled:opacity-50 transition-colors"
                    >
                      削除
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
