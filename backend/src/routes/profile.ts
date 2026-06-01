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

router.post("/", async (req: Request, res: Response) => {
  const { name, bio } = req.body;
  if (!name || !bio) {
    return res.status(400).json({ error: "name と bio は必須です" });
  }
  try {
    const existing = await prisma.profile.findFirst();
    if (existing) {
      return res.status(409).json({ error: "プロフィールは既に登録されています" });
    }
    const profile = await prisma.profile.create({
      data: { name, bio },
      include: { avatarImage: true },
    });
    res.status(201).json(profile);
  } catch {
    res.status(500).json({ error: "プロフィールの作成に失敗しました" });
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

    // 送られてきた項目だけを明示的に詰める（undefined は「変更なし」として除外）
    // avatarImageId: null を送ると解除、number を送ると設定、undefined を送ると変更なし
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