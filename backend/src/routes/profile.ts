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
