const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");
const postRoute = require("./routes/postRoute");
const categoryRoute = require("./routes/categoryRoute");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const PORT = process.env.PORT || 5000;

dotenv.config();
app.use(express.json());
app.use(cors());
app.use("/images", express.static(path.join(__dirname, "/images")));

mongoose
  .connect(process.env.MONGO_URL)
  .then(console.log("mongo connected"))
  .catch((err) => console.log(err));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  console.log(req.file);
  res.status(200).json("file has been uploaded successfully");
});
app.get("/hello", (req,res)=>{
res.send("hello everyone")
})

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/post", postRoute);
app.use("/api/category", categoryRoute);

app.listen(PORT, () => {
  console.log(`started on port http://localhost:${PORT}/`);
});

//1.11
