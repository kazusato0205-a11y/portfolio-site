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

export default function SkillsSection({ skills }: { skills: Skill[] }) {
  // カテゴリごとにスキルをグループ化する
  const grouped = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <section className="bg-white py-24 px-8">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-12 text-2xl font-semibold tracking-tight text-gray-900">
          Skills
        </h2>

        {skills.length === 0 ? (
          <p className="text-center text-gray-400">スキルがまだ登録されていません。</p>
        ) : (
          <div className="flex flex-col gap-10">
            {Object.entries(grouped).map(([category, categorySkills]) => (
              <div key={category}>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue-600">
                  {category}
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {categorySkills.map((skill) => (
                    <div
                      key={skill.id}
                      className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3"
                    >
                      <span className="text-sm font-medium text-gray-800">
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
