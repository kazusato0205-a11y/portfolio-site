import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  try {
    const works = await prisma.work.findMany({
      include: { image: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(works);
  } catch {
    res.status(500).json({ error: "実績一覧の取得に失敗しました" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    const work = await prisma.work.findUnique({
      where: { id },
      include: { image: true },
    });
    if (!work) {
      res.status(404).json({ error: "実績が見つかりません" });
      return;
    }
    res.json(work);
  } catch {
    res.status(500).json({ error: "実績の取得に失敗しました" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  const { title, description, imageId, link } = req.body;
  try {
    const work = await prisma.work.create({
      data: { title, description, imageId, link },
      include: { image: true },
    });
    res.status(201).json(work);
  } catch {
    res.status(500).json({ error: "実績の作成に失敗しました" });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { title, description, imageId, link } = req.body;
  try {
    const work = await prisma.work.update({
      where: { id },
      data: { title, description, imageId, link },
      include: { image: true },
    });
    res.json(work);
  } catch {
    res.status(500).json({ error: "実績の更新に失敗しました" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    await prisma.work.delete({ where: { id } });
    res.status(204).send();
  } catch {
    res.status(500).json({ error: "実績の削除に失敗しました" });
  }
});

export default router;
