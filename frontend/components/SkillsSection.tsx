type Skill = {
  id: number;
  name: string;
  level: number;
  category: string;
};

function LevelDots({ level }: { level: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`inline-block h-2 w-2 rounded-full ${
            i < level ? "bg-blue-500" : "bg-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

// カテゴリの表示順（ここに無いものは後ろに五十音／アルファベット順で続く）
const CATEGORY_ORDER = [
  "Language",
  "Frontend",
  "Backend",
  "Database",
  "Infra / Tools",
  "Testing",
];

export default function SkillsSection({ skills }: { skills: Skill[] }) {
  // カテゴリごとにスキルをグループ化する
  const grouped = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  // カテゴリ内はレベルの高い順、同レベルなら名前順で並べる
  for (const list of Object.values(grouped)) {
    list.sort((a, b) => b.level - a.level || a.name.localeCompare(b.name));
  }

  const categories = Object.keys(grouped).sort((a, b) => {
    const ia = CATEGORY_ORDER.indexOf(a);
    const ib = CATEGORY_ORDER.indexOf(b);
    return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib) || a.localeCompare(b);
  });

  return (
    <section className="bg-white py-24 px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
            Tech
          </span>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            Skills
          </h2>
        </div>

        {skills.length === 0 ? (
          <p className="text-center text-gray-400">スキルがまだ登録されていません。</p>
        ) : (
          <div className="flex flex-col gap-10">
            {categories.map((category) => (
              <div key={category}>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue-600">
                  {category}
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {grouped[category].map((skill) => (
                    <div
                      key={skill.id}
                      className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:border-blue-200 hover:shadow-md hover:shadow-blue-50"
                    >
                      <span className="text-sm font-medium text-slate-800">
                        {skill.name}
                      </span>
                      <LevelDots level={skill.level} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
