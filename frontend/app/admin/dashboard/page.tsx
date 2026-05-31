import { fetchFromBackend } from "@/lib/api/backend";
import ProfileEditForm from "@/components/admin/ProfileEditForm";
import WorksEditSection from "@/components/admin/WorksEditSection";
import SkillsEditSection from "@/components/admin/SkillsEditSection";
import ImagesSection from "@/components/admin/ImagesSection";
import LogoutButton from "@/components/admin/LogoutButton";

type Profile = { id: number; name: string; bio: string; avatarImage: { url: string } | null };
type Work    = { id: number; title: string; description: string; link: string | null };
type Skill   = { id: number; name: string; level: number; category: string };
type Image   = { id: number; url: string; filename: string };

async function getProfile() {
  try { return await fetchFromBackend<Profile>("/profile"); }
  catch { return null; }
}
async function getWorks() {
  try { return await fetchFromBackend<Work[]>("/works"); }
  catch { return []; }
}
async function getSkills() {
  try { return await fetchFromBackend<Skill[]>("/skills"); }
  catch { return []; }
}
async function getImages() {
  try { return await fetchFromBackend<Image[]>("/images"); }
  catch { return []; }
}

export default async function DashboardPage() {
  const [profile, works, skills, images] = await Promise.all([
    getProfile(), getWorks(), getSkills(), getImages(),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* トップバー */}
      <header className="border-b border-gray-200 bg-white px-8 py-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">ダッシュボード</h1>
        <LogoutButton />
      </header>

      <div className="mx-auto max-w-3xl px-8 py-12 flex flex-col gap-12">
        {/* プロフィール */}
        <section>
          <h2 className="mb-6 text-base font-semibold text-gray-900 border-b border-gray-200 pb-2">
            プロフィール
          </h2>
          <ProfileEditForm profile={profile} />
        </section>

        {/* 実績 */}
        <section>
          <h2 className="mb-6 text-base font-semibold text-gray-900 border-b border-gray-200 pb-2">
            実績（Works）
          </h2>
          <WorksEditSection works={works} />
        </section>

        {/* スキル */}
        <section>
          <h2 className="mb-6 text-base font-semibold text-gray-900 border-b border-gray-200 pb-2">
            スキル（Skills）
          </h2>
          <SkillsEditSection skills={skills} />
        </section>

        {/* 画像管理 */}
        <section>
          <h2 className="mb-6 text-base font-semibold text-gray-900 border-b border-gray-200 pb-2">
            画像管理
          </h2>
          <ImagesSection images={images} profileId={profile?.id ?? null} />
        </section>
      </div>
    </div>
  );
}
