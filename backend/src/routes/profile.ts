import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  try {
    const profile = await prisma.profile.findFirst({
      include: { avatarImage: true },
    });
    res.json(profile);
  } catch {
    res.status(500).json({ error: "プロフィールの取得に失敗しました" });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id));
  const { name, bio, avatarImageId } = req.body;

  try {
    const existingProfile = await prisma.profile.findUnique({ where: { id } });
    if (!existingProfile) {
      return res.status(404).json({ error: "更新対象のプロフィールが見つかりません" });
    }

    // 送られてきた項目だけを明示的に詰める（undefined は除外）
    const data: { name?: string; bio?: string; avatarImageId?: number | null } = {};
    if (name          !== undefined) data.name          = name;
    if (bio           !== undefined) data.bio           = bio;
    if (avatarImageId !== undefined) data.avatarImageId = avatarImageId;

    const profile = await prisma.profile.update({
      where: { id },
      data,
      include: { avatarImage: true },
    });
    res.json(profile);
  } catch {
    res.status(500).json({ error: "プロフィールの更新に失敗しました" });
  }
});

export default router;