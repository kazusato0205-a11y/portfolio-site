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
  const id = parseInt(req.params.id);
  try {
    await prisma.image.delete({ where: { id } });
    res.status(204).send();
  } catch {
    res.status(500).json({ error: "画像の削除に失敗しました" });
  }
});

export default router;
