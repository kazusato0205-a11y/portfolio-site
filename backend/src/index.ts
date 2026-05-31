import "dotenv/config";
import fs from "fs";
import path from "path";
import express from "express";
import cors from "cors";
import profileRouter from "./routes/profile";
import worksRouter from "./routes/works";
import skillsRouter from "./routes/skills";
import imagesRouter from "./routes/images";

const app = express();
const PORT = process.env.PORT ?? 4000;

// 画像保存先ディレクトリが存在しない場合は自動作成
const uploadsDir = path.join(__dirname, "../public/uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

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
