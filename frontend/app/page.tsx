import { fetchBackend } from "@/lib/api/backend";

type HealthResponse = { status: string };

async function getBackendStatus(): Promise<"ok" | "error"> {
  try {
    const data = await fetchBackend<HealthResponse>("/health");
    return data.status === "ok" ? "ok" : "error";
  } catch {
    return "error";
  }
}

export default async function Home() {
  const backendStatus = await getBackendStatus();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <main className="flex flex-col items-center gap-6 p-16 text-center">
        <h1 className="text-2xl font-semibold text-black dark:text-white">
          Portfolio Site
        </h1>
        <div className="flex flex-col gap-2 text-sm">
          <StatusRow label="Frontend (Next.js)" status="ok" />
          <StatusRow label="Backend (Express)" status={backendStatus} />
        </div>
      </main>
    </div>
  );
}

function StatusRow({ label, status }: { label: string; status: "ok" | "error" }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`inline-block h-2.5 w-2.5 rounded-full ${
          status === "ok" ? "bg-green-500" : "bg-red-500"
        }`}
      />
      <span className="text-zinc-700 dark:text-zinc-300">{label}</span>
      <span
        className={`font-mono font-medium ${
          status === "ok" ? "text-green-600" : "text-red-500"
        }`}
      >
        {status}
      </span>
    </div>
  );
}
