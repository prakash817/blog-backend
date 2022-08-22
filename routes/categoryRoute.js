const Category = require("../models/Category");
const router = require("express").Router();

//creating 1 category
router.post("/", async (req, res) => {
  const newCat = new Category(req.body);
  try {
    const savedCat = await newCat.save();
    res.status(200).json(savedCat);
  } catch (error) {
    res.status(500).json(error);
  }
});
//getting all category
router.get("/", async (req, res) => {
  try {
    const getCat = await Category.find();
    res.status(200).json(getCat);
  } catch (error) {
    res.status(500).json(error);
  }
});
module.exports = router;
