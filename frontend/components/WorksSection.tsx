import Image from "next/image";

type Work = {
  id: number;
  title: string;
  description: string;
  image: {
    id: number;
    url: string;
    filename: string;
  } | null;
  link: string | null;
};

export default function WorksSection({ works }: { works: Work[] }) {
  return (
    <section className="bg-gray-50 py-24 px-8">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-12 text-2xl font-semibold tracking-tight text-gray-900">
          Works
        </h2>

        {works.length === 0 ? (
          <p className="text-center text-gray-400">実績がまだ登録されていません。</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {works.map((work) => (
              <div
                key={work.id}
                className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white"
              >
                {work.image ? (
                  <div className="relative h-48 w-full">
                    <Image
                      src={work.image.url}
                      alt={work.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-48 w-full items-center justify-center bg-gray-100 text-gray-300 text-sm">
                    No Image
                  </div>
                )}

                <div className="flex flex-1 flex-col gap-3 p-5">
                  <h3 className="text-base font-semibold text-gray-900">
                    {work.title}
                  </h3>
                  <p className="flex-1 text-sm leading-relaxed text-gray-600">
                    {work.description}
                  </p>
                  {work.link && (
                    <a
                      href={work.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto inline-block text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
                    >
                      リンクを見る →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
