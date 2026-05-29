import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client"; // 環境に応じて /library に変更してください

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
    // 1. そもそもその画像が今もあるか確認する（404対応）
    const existingImage = await prisma.image.findUnique({ where: { id } });
    if (!existingImage) {
      return res.status(404).json({ error: "削除対象の画像が見つかりません" });
    }

    // 2. 削除を実行（参照中ならここでP2003エラーが飛ぶ）
    await prisma.image.delete({ where: { id } });
    return res.json({ message: "画像を削除しました" });

  } catch (error) {
    // 3. 外部キー制約エラー（他のデータが参照中）の識別
    if (error && typeof error === "object" && "code" in error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2003") {
          return res.status(400).json({
            error: "この画像はプロフィールまたは作品実績で使用中のため、削除できません",
          });
        }
      }
    }

    // 4. それ以外の予期せぬシステムエラーは500を返す
    return res.status(500).json({ error: "画像の削除に失敗しました" });
  }
});

export default router;