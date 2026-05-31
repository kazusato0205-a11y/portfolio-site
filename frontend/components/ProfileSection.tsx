// データを画面に描く「表示担当」
import Image from "next/image";

type Profile = {
  id: number;
  name: string;
  bio: string;
  avatarImage: {
    id: number;
    url: string;
    filename: string;
  } | null;
};

//page.tsx から渡されたデータを受け取る（荷物の受け取り口）
export default function ProfileSection({ profile }: { profile: Profile | null }) {
  // profileが null（空）だったら、「登録されていません」と表示して終了
  if (!profile) {
    return (
      <section className="py-24 px-8 text-center text-gray-400">
        <p>プロフィールが登録されていません。</p>
      </section>
    );
  }

  return (
    <section className="py-24 px-8">
      <div className="mx-auto max-w-3xl flex flex-col items-center gap-8 sm:flex-row sm:items-start sm:gap-12">
        {profile.avatarImage ? (
          <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-full border border-gray-200 sm:h-40 sm:w-40">
            {profile.avatarImage.url.startsWith("data:") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.avatarImage.url} alt={profile.name} className="h-full w-full object-cover" />
            ) : (
              <Image src={profile.avatarImage.url} alt={profile.name} fill className="object-cover" />
            )}
          </div>
        ) : (
          <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-full bg-gray-100 text-4xl text-gray-300 sm:h-40 sm:w-40">
            {profile.name.charAt(0)}
          </div>
        )}

        <div className="flex flex-col gap-4 text-center sm:text-left">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
            {profile.name}
          </h1>
          <p className="text-base leading-relaxed text-gray-600">{profile.bio}</p>
        </div>
      </div>
    </section>
  );
}
