const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcrypt");
const { findById } = require("../models/User");

//CREATING A NEW POST
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(500).json(error);
  }
});

//UPDATING
router.put("/:postId", async (req, res) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId);
    if (req.body.username == post.username) {
      try {
        const updatedPost = await Post.findByIdAndUpdate(
          postId,
          { $set: req.body },
          { new: true }
        );
        res.status(200).json(updatedPost);
      } catch (error) {
        res.status(500).json(error);
      }
    } else {
      res.status(401).json("You can update your own Only");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//DELETING
router.delete("/:postId", async (req, res) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId);
    if (req.body.username == post.username) {
      try {
        await Post.findByIdAndDelete(postId);
        res.status(200).json("post successfully deleted !");
      } catch (error) {
        res.status(500).json(error);
      }
    } else {
      res.status(401).json("You can Delete your own Only");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//get 1 post
router.get("/:postId", async (req, res) => {
  const postId = req.params.postId;

  try {
    const post = await Post.findById(postId);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error);
  }
});

//get all post  /?username=kanha or /?catName:"music"
router.get("/", async (req, res) => {
  const username = req.query.username;
  const catName = req.query.catName;

  try {
    let posts;
    if (username) {
      posts = await Post.find({ username });
    } else if (catName) {
      posts = await Post.find({ categories: { $in: [catName] } });
    } else {
      posts = await Post.find();
    }
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json(error);
  }
});
module.exports = router;
