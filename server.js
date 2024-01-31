const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const Image = require("./Image");

const app = express();
app.use(cors());
const PORT = process.env.PORT || 5002;

async function conCheck() {
  try {
    await mongoose.connect(
      `mongodb+srv://arjunsingh27:Test123@cluster0.0t9vaxx.mongodb.net/image`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error(err);
  }
}

conCheck();

const storage = multer.memoryStorage();

const upload = multer({ storage });
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { title, description } = req.body;

    const newImage = new Image({
      title: title,
      description: description,
      data: req.file.buffer,
      contentType: req.file.mimetype,
    });

    await newImage.save();
    console.log("Image saved successfully");

    res.json({ success: true, message: "Image uploaded successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error uploading image" });
  }
});

app.get("/images", async (req, res) => {
  try {
    const images = await Image.find({}, "title description data contentType");
    res.json(images);
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).json({ success: false, message: "Error fetching images" });
  }
});

app.get("/photos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const photo = await Image.findById(
      id,
      "title description data contentType"
    );

    if (!photo) {
      return res.status(404).json({ error: "Photo not found" });
    }

    res.json(photo);
    console.log(photo);
  } catch (error) {
    console.error("Error fetching photo details:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching photo details" });
  }
});

app.listen(PORT || process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
