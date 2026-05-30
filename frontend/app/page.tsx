//データを取りに行く「司令塔」
import { fetchFromBackend } from "@/lib/api/backend";
import ProfileSection from "@/components/ProfileSection";
import WorksSection from "@/components/WorksSection";
import SkillsSection from "@/components/SkillsSection";

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

type Skill = {
  id: number;
  name: string;
  level: number;
  category: string;
};

//async function → 「時間がかかる作業をする関数」という意味。データを取りに行く間、待つことができる
//Promise<Profile | null> → 「最終的に Profile か null を返しますよ」という約束の型
async function getProfile(): Promise<Profile | null> {
  //try { ... } catch { return null } → データ取得に失敗しても、エラーで止まらず null（何もない）を返して安全に終わる
  try {
    // await fetchFromBackend("/profile") → バックエンドの /profile というURLにデータを取りに行く。await は「取ってくるまで待つ」という命令
    return await fetchFromBackend<Profile>("/profile");
  } catch {
    return null;
  }
}

async function getWorks(): Promise<Work[]> {
  try {
    return await fetchFromBackend<Work[]>("/works");
  } catch {
    return [];
  }
}

async function getSkills(): Promise<Skill[]> {
  try {
    return await fetchFromBackend<Skill[]>("/skills");
  } catch {
    return [];
  }
}

export default async function Home() {
  const [profile, works, skills] = await Promise.all([
    getProfile(),
    getWorks(),
    getSkills(),
  ]);

  return (
    <div className="bg-white">
      <ProfileSection profile={profile} />
      <WorksSection works={works} />
      <SkillsSection skills={skills} />
    </div>
  );
}
