import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: { category: "asc" },
    });
    res.json(skills);
  } catch {
    res.status(500).json({ error: "スキル一覧の取得に失敗しました" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  const { name, level, category } = req.body;
  try {
    const skill = await prisma.skill.create({
      data: { name, level, category },
    });
    res.status(201).json(skill);
  } catch {
    res.status(500).json({ error: "スキルの作成に失敗しました" });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id));
  const { name, level, category } = req.body;
  try {
    const existingSkill = await prisma.skill.findUnique({ where: { id } });
    if (!existingSkill) {
      return res.status(404).json({ error: "更新対象のスキルが見つかりません" });
    }
    const skill = await prisma.skill.update({
      where: { id },
      data: { name, level, category },
    });
    res.json(skill);
  } catch {
    res.status(500).json({ error: "スキルの更新に失敗しました" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id));
  try {
    const existingSkill = await prisma.skill.findUnique({ where: { id } });
    if (!existingSkill) {
      return res.status(404).json({ error: "削除対象のスキルが見つかりません" });
    }
    await prisma.skill.delete({ where: { id } });
    res.json({ message: "スキルを削除しました" });
  } catch {
    res.status(500).json({ error: "スキルの削除に失敗しました" });
  }
});

export default router;
