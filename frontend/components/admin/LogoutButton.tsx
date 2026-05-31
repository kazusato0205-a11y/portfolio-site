"use client";

import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { logout } from "@/app/admin/dashboard/actions";

export default function LogoutButton() {
  async function handleLogout() {
    await signOut(auth);
    await logout();
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
    >
      ログアウト
    </button>
  );
}
