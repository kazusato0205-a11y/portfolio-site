import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

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

    await prisma.image.delete({ where: { id } });
    res.json({ message: "画像を削除しました" });
  } catch (error) {
    // 💡 3. もしエラーが発生し、それが「外部キー制約（他のデータが参照中）」によるものなら400を返す
    if (error && typeof error === "object" && "code" in error) {
    // 2. さらに、それがPrismaの特定のエラー型であるかチェックする
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2003") {
        return res.status(400).json({
          error: "この画像はプロフィールまたは作品実績で使用中のため、削除できません",
        });
      }
    }
  }

    // それ以外の本当のシステムエラーは500を返す
    res.status(500).json({ error: "画像の削除に失敗しました" });
  }
});

export default router;
