"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase/client";

type AuthState = {
  user: User | null;
  loading: boolean;
};

export function useAuth(): AuthState {
  const [user, setUser]       = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //onAuthStateChanged は「ログイン状態が変わったら教えて」と Firebase に頼む関数
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    // コンポーネントが破棄されたときに監視を解除する
    return () => unsubscribe();
  }, []);

  return { user, loading };
}
