import express from "express";
import fs from "fs";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(express.json());
app.use(cors());

// Get safe directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Absolute path for data file
const DATA_FILE = path.join(__dirname, "places.json");

// Helper: Safely load JSON
function safeReadJSON() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, "[]", "utf8");
      return [];
    }
    const content = fs.readFileSync(DATA_FILE, "utf8").trim();
    if (!content) return []; // empty file
    return JSON.parse(content);
  } catch (err) {
    console.error("⚠️ Corrupted JSON detected, resetting file...");
    fs.writeFileSync(DATA_FILE, "[]", "utf8");
    return [];
  }
}

// Homepage route
app.get("/", (req, res) => {
  res.send("✅ RIBI Backend is running! Use /places to get data.");
});

// GET all places
app.get("/places", (req, res) => {
  const data = safeReadJSON();
  res.json(data);
});

// POST new place
app.post("/places", (req, res) => {
  const newPlace = req.body;

  if (!newPlace.name || !newPlace.lat || !newPlace.lng) {
    return res.status(400).json({
      error: "Missing required fields: name, lat, lng",
    });
  }

  const data = safeReadJSON();
  data.push(newPlace);

  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
    res.json({ message: "✅ Place added successfully!", place: newPlace });
  } catch (err) {
    console.error("Error writing JSON:", err);
    res.status(500).json({ error: "Failed to save data" });
  }
});

// Run server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
