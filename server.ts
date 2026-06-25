import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const STATE_FILE_PATH = path.join(process.cwd(), "user_state.json");

// Default state if no saved state exists
const DEFAULT_STATE = {
  healthScore: null,
  level: 1,
  xp: 0,
  streak: 3,
  gems: 150,
  hearts: 3,
  completedLessons: [],
  expenses: [
    { id: "e1", title: "Kira Harcaması", amount: 500, category: "Kira", date: "Dün" },
    { id: "e2", title: "Market Harcaması", amount: 150, category: "Market", date: "Bugün" }
  ],
  portfolio: [],
  quests: [],
  dailyRewardCollected: false,
  activeBadge: "Standart",
  simulationMode: "historical",
  activeMonth2023: 0
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse JSON
  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Get user state
  app.get("/api/state", (req, res) => {
    try {
      if (fs.existsSync(STATE_FILE_PATH)) {
        const fileContent = fs.readFileSync(STATE_FILE_PATH, "utf-8");
        const state = JSON.parse(fileContent);
        return res.json(state);
      } else {
        // Return default state if file doesn't exist
        return res.json(DEFAULT_STATE);
      }
    } catch (error) {
      console.error("Error reading state file:", error);
      return res.status(500).json({ error: "Failed to read state" });
    }
  });

  // Save user state
  app.post("/api/state", (req, res) => {
    try {
      const state = req.body;
      fs.writeFileSync(STATE_FILE_PATH, JSON.stringify(state, null, 2), "utf-8");
      return res.json({ success: true });
    } catch (error) {
      console.error("Error writing state file:", error);
      return res.status(500).json({ error: "Failed to save state" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
