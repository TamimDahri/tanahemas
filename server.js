import express from "express";
import fs from "fs";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const DATA_FILE = "./data/places.json";

// Get all data
app.get("/places", (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  res.json(data);
});

// Add new place
app.post("/places", (req, res) => {
  const newPlace = req.body;
  if (!newPlace.name || !newPlace.lat || !newPlace.lng) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  data.push(newPlace);
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

  res.json({ message: "Place added!", place: newPlace });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
