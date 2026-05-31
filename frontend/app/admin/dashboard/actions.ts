"use server"; // サーバー上で実行される

import { fetchFromBackend } from "@/lib/api/backend";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type ActionResult = { error?: string; success?: boolean } | null;

// プロフィール更新
export async function updateProfile(
  id: number,
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const name = formData.get("name") as string;
  const bio  = formData.get("bio")  as string;
  try {
    await fetchFromBackend(`/profile/${id}`, {
      method: "PUT",
      body: JSON.stringify({ name, bio }),
    });
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch {
    return { error: "プロフィールの更新に失敗しました" };
  }
}

// 実績を新規作成
export async function createWork(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const title       = formData.get("title")       as string;
  const description = formData.get("description") as string;
  const link        = (formData.get("link") as string) || null;
  try {
    await fetchFromBackend("/works", {
      method: "POST",
      body: JSON.stringify({ title, description, link }),
    });
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch {
    return { error: "実績の作成に失敗しました" };
  }
}

// 実績を削除
export async function deleteWork(id: number) {
  await fetchFromBackend(`/works/${id}`, { method: "DELETE" });
  revalidatePath("/admin/dashboard");//ページのデータを再取得して画面を更新
}

// スキルを新規作成
export async function createSkill(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const name     = formData.get("name")     as string;
  const level    = parseInt(formData.get("level") as string);
  const category = formData.get("category") as string;
  try {
    await fetchFromBackend("/skills", {
      method: "POST",
      body: JSON.stringify({ name, level, category }),
    });
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch {
    return { error: "スキルの作成に失敗しました" };
  }
}

// スキルを削除
export async function deleteSkill(id: number) {
  await fetchFromBackend(`/skills/${id}`, { method: "DELETE" });
  revalidatePath("/admin/dashboard");
}

// 画像を登録（Base64 データURLをそのまま url フィールドに保存）
export async function uploadImage(data: { url: string; filename: string }) {
  try {
    await fetchFromBackend("/images", {
      method: "POST",
      body: JSON.stringify(data),
    });
    revalidatePath("/admin/dashboard");
  } catch {
    return { error: "画像の登録に失敗しました" };
  }
}

// 画像をプロフィールのアバターに設定
export async function setProfileAvatar(profileId: number, imageId: number) {
  try {
    // 現在の name・bio を保持したまま avatarImageId だけ更新する
    const current = await fetchFromBackend<{ name: string; bio: string }>("/profile");
    await fetchFromBackend(`/profile/${profileId}`, {
      method: "PUT",
      body: JSON.stringify({ name: current.name, bio: current.bio, avatarImageId: imageId }),
    });
    revalidatePath("/admin/dashboard");
  } catch {
    return { error: "アバターの設定に失敗しました" };
  }
}

// 画像を削除（他のデータに使用中の場合は 400 エラー）
export async function deleteImage(id: number) {
  try {
    await fetchFromBackend(`/images/${id}`, { method: "DELETE" });
    revalidatePath("/admin/dashboard");
  } catch {
    return { error: "この画像はプロフィールまたは実績で使用中のため削除できません" };
  }
}

// ログアウト
export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  redirect("/admin/login");
}
