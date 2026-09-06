import WorkCard, { type Work } from "./WorkCard";

export default function WorksSection({ works }: { works: Work[] }) {
  return (
    <section className="relative overflow-hidden bg-slate-50 py-24 px-8">
      {/* 背景のドットパターン */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          maskImage:
            "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
        }}
      />

      <div className="relative mx-auto max-w-5xl">
        <div className="mb-12">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
            Portfolio
          </span>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            Works
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            作品名をクリックすると詳細が開きます。
          </p>
        </div>

        {works.length === 0 ? (
          <p className="text-center text-slate-400">実績がまだ登録されていません。</p>
        ) : (
          <div className="grid items-start gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {works.map((work) => (
              <WorkCard key={work.id} work={work} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
