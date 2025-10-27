import express from "express";
import fs from "fs";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = "./places.json";

// ✅ Get all places
app.get("/places", (req, res) => {
  if (!fs.existsSync(DATA_FILE)) return res.json([]);
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  res.json(data);
});

// ✅ Add new place
app.post("/places", (req, res) => {
  const newPlace = req.body;
  if (!newPlace || !newPlace.name || !newPlace.lat || !newPlace.lng) {
    return res.status(400).json({ error: "Invalid data" });
  }

  let data = [];
  if (fs.existsSync(DATA_FILE)) {
    data = JSON.parse(fs.readFileSync(DATA_FILE));
  }
  data.push(newPlace);
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
