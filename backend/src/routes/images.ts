import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const { url, filename } = req.body;
  try {
    const image = await prisma.image.create({
      data: { url, filename },
    });
    res.status(201).json(image);
  } catch {
    res.status(500).json({ error: "画像の登録に失敗しました" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id));
  try {
    // そもそもその画像が今もあるか確認する（前回の404対応と同じです）
    const existingImage = await prisma.image.findUnique({ where: { id } });
    if (!existingImage) {
      return res.status(404).json({ error: "削除対象の画像が見つかりません" });
    }

    // Profileモデルでこの画像が使われているか（参照されているか）調べる
    const isUsedInProfile = await prisma.profile.findFirst({
      where: { avatarImageId: id }
    });

    // Workモデルでこの画像が使われているか調べる
    const isUsedInWork = await prisma.work.findFirst({
      where: { imageId: id } // ※モデル側の実際のカラム名（imageIdなど）に合わせてください
    });

    //もしどちらか一方で使われていたら、エラー（400）を返して削除をブロックする
    if (isUsedInProfile || isUsedInWork) {
      return res.status(400).json({ 
        error: "この画像はプロフィールまたは作品実績で使用中のため、削除できません" 
      });
    }
    await prisma.image.delete({ where: { id } });
    res.json({ message: "画像を削除しました" });
  } catch {
    res.status(500).json({ error: "画像の削除に失敗しました" });
  }
});

export default router;
