import { Router, Request, Response } from "express";
import multer from "multer";
import { prisma } from "../lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

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
  const base64url = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
  try {
    const image = await prisma.image.create({
      data: { url: base64url, filename: req.file.originalname },
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

    await prisma.image.delete({ where: { id } });
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
