const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const mongoose = require("mongoose");

const app = express();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
app.use("/uploads", express.static("uploads"));

const upload = multer({ storage });

mongoose
  .connect(
    "mongodb+srv://huzaifa:fireburning300@cluster0.xxwlzho.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("connected....");
  });

const ImageSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
});

const Image = mongoose.model("Image", ImageSchema);

app.use(bodyParser.json());

app.post("/image", upload.single("image"), (req, res) => {
  const newImage = new Image({
    image: req.file.path,
  });
  console.log(req.file.path);

  newImage.save((error) => {
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Could not save image to database.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Image was saved to the database successfully.",
    });
  });
});

app.get("/vides", (req, res) => {});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
