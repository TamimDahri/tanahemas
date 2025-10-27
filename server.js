import express from "express";
import fs from "fs";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(express.json());
app.use(cors());

// Get current directory safely (for ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Absolute path for the JSON file
const DATA_FILE = path.join(__dirname, "places.json");

// Ensure the JSON file exists
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, "[]", "utf8");
}

// Simple homepage / health check
app.get("/", (req, res) => {
  res.send("✅ RIBI Backend is running! Use /places to view data.");
});

// Get all data
app.get("/places", (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    res.json(data);
  } catch (err) {
    console.error("Error reading JSON:", err);
    res.status(500).json({ error: "Failed to read data" });
  }
});

// Add new place
app.post("/places", (req, res) => {
  const newPlace = req.body;

  if (!newPlace.name || !newPlace.lat || !newPlace.lng) {
    return res.status(400).json({ error: "Missing required fields: name, lat, lng" });
  }

  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    data.push(newPlace);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
    res.json({ message: "✅ Place added successfully!", place: newPlace });
  } catch (err) {
    console.error("Error writing JSON:", err);
    res.status(500).json({ error: "Failed to save data" });
  }
});

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
