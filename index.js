const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const sharp = require("sharp");

const app = express();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const imageExtension = file.mimetype.split("/");
    console.log(imageExtension);
    cb(null, file.fieldname + ".jpg");
  },
});
app.use("/uploads", express.static("uploads"));

const upload = multer({ storage });

app.use(bodyParser.json());

app.post("/image", upload.single("image"), (req, res) => {
  sharp(req.file.path)
    .toFormat("jpg")
    .jpeg({ quality: 90 })
    .toFile("./uploads/" + "image", (err, info) => {
      if (err) {
        console.log("error...................", err);
        res.status(500).send(err);
      } else {
        return res.status(200).json({
          success: true,
          message: "Image was saved to the database successfully.",
          image: `uploads/${req.file.filename}`,
        });
      }
    });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
