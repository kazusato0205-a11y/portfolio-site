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
  const id = parseInt(req.params.id);
  const { name, bio, avatarImageId } = req.body;
  
  try {
    // 💡 1. まず、更新しようとしているプロフィールが本当に存在するか確認する
    const existingProfile = await prisma.profile.findUnique({
      where: { id },
    });

    // 💡 2. もし見つからなかったら（nullだったら）、404エラーで親切に返す
    if (!existingProfile) {
      return res.status(404).json({ error: "更新対象のプロフィールが見つかりません" });
    }

    // 💡 3. 存在することが分かってから、安全に更新処理を実行する
    const profile = await prisma.profile.update({
      where: { id },
      data: { name, bio, avatarImageId },
      include: { avatarImage: true },
    });
    res.json(profile);
  } catch {
    res.status(500).json({ error: "プロフィールの更新に失敗しました" });
  }
});

export default router;