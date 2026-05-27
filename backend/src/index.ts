import "dotenv/config";
import express from "express";
import cors from "cors";
import profileRouter from "./routes/profile";
import worksRouter from "./routes/works";
import skillsRouter from "./routes/skills";
import imagesRouter from "./routes/images";

const app = express();
const PORT = process.env.PORT ?? 4000;

app.use(cors());
app.use(express.json());

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
