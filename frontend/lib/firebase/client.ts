import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const requiredEnvVars = {
  NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
} as const;

const missingVars = Object.entries(requiredEnvVars)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  throw new Error(
    `Firebase の初期化に失敗しました。以下の環境変数が設定されていません:\n` +
    missingVars.map((key) => `  - ${key}`).join("\n") +
    `\n\nfrontend/.env.local に上記の変数を追加してください。`
  );
}

const firebaseConfig = {
  apiKey: requiredEnvVars.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: requiredEnvVars.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: requiredEnvVars.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: requiredEnvVars.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: requiredEnvVars.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: requiredEnvVars.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// すでに初期化済みの場合は既存のインスタンスを再利用する
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
