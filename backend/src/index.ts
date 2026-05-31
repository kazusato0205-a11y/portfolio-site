import "dotenv/config";
import fs from "fs";
import express from "express";
import cors from "cors";
import { UPLOADS_DIR } from "./lib/paths";
import profileRouter from "./routes/profile";
import worksRouter from "./routes/works";
import skillsRouter from "./routes/skills";
import imagesRouter from "./routes/images";

const app = express();
const PORT = process.env.PORT ?? 4000;

// 画像保存先ディレクトリが存在しない場合は自動作成
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(UPLOADS_DIR));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/profile", profileRouter);
app.use("/api/works", worksRouter);
app.use("/api/skills", skillsRouter);
app.use("/api/images", imagesRouter);

app.listen(PORT, () => {
  console.log(`サーバー起動中: http://localhost:${PORT}`);
});
