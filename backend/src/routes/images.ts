import fs from "fs";
import path from "path";
import { Router, Request, Response } from "express";
import multer from "multer";
import { prisma } from "../lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { UPLOADS_DIR } from "../lib/paths";

const router = Router();

const storage = multer.diskStorage({
  destination: UPLOADS_DIR,
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.get("/", async (_req: Request, res: Response) => {
  try {
    const images = await prisma.image.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(images);
  } catch {
    res.status(500).json({ error: "画像一覧の取得に失敗しました" });
  }
});

router.post("/", upload.single("file"), async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: "ファイルが見つかりません" });
  }
  const url = `/uploads/${req.file.filename}`;
  try {
    const image = await prisma.image.create({
      data: { url, filename: req.file.originalname },
    });
    res.status(201).json(image);
  } catch {
    res.status(500).json({ error: "画像の登録に失敗しました" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id));
  try {
    const existingImage = await prisma.image.findUnique({ where: { id } });
    if (!existingImage) {
      return res.status(404).json({ error: "削除対象の画像が見つかりません" });
    }

    // DB レコードを先に削除する（失敗時はファイルに触らず500を返す → 整合した状態を維持）
    await prisma.image.delete({ where: { id } });

    // DB 削除後にファイルをベストエフォートで削除する
    // 失敗しても DB は既にクリーンなためユーザーには見えず、孤立ファイルとしてのみ残る
    const filePath = path.join(UPLOADS_DIR, path.basename(existingImage.url));
    await fs.promises.unlink(filePath).catch((err: NodeJS.ErrnoException) => {
      if (err.code !== "ENOENT") {
        console.error(`孤立ファイルの削除に失敗（手動クリーンアップが必要）: ${filePath}`);
      }
    });

    return res.json({ message: "画像を削除しました" });

  } catch (error) {
    if (error && typeof error === "object" && "code" in error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2003") {
          return res.status(400).json({
            error: "この画像はプロフィールまたは作品実績で使用中のため、削除できません",
          });
        }
      }
    }
    return res.status(500).json({ error: "画像の削除に失敗しました" });
  }
});

export default router;
