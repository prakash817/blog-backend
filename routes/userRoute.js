const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcrypt");
const { findById } = require("../models/User");

//updating
router.put("/:userId", async (req, res) => {
  const userId = req.params.userId;
  if (req.body.userId == userId) {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hassedPass = await bcrypt.hash(req.body.password, salt);
      req.body.password = hassedPass;
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(401).json("You can update your own Only");
  }
});
//DELETING
router.delete("/:userId", async (req, res) => {
  const userId = req.params.userId;
  if (req.body.userId == userId) {
    try {
      const user = await User.findById(userId);

      try {
        await Post.deleteMany({ username: user.username });
        await User.findByIdAndDelete(userId);
        res.status(200).json("User Succefully Deleted");
      } catch (error) {
        res.status(500).json(error);
      }
    } catch (error) {
      res.status(401).json("User Not Found !");
    }
  } else {
    res.status(401).json("You can Delete your own Only");
  }
});

router.get("/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (error) {
    res.status(500).json(error);
  }
});
module.exports = router;
