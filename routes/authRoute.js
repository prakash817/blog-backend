const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//REGISTER
router.post("/register", async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const hassedPass = await bcrypt.hash(req.body.password, salt);
  // let { username, email, password } = req.body;
  try {
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hassedPass,
    });

    const user = await newUser.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  console.log(req.body, "api");
  try {
    const user = await User.findOne({ username: req.body.username });
    // console.log(user, "api");
    !user && res.status(400).json({ massage: "Wrong Credential !" });

    const validated = await bcrypt.compare(req.body.password, user.password);
    // const validated = req.body.password == user.password;
    console.log(
      user,
      "api",
      validated,
      "repass",
      typeof req.body.password,
      req.body.password,
      "userpass",
      typeof user.password,
      user.password
    );

    !validated && res.status(400).json({ massage: "Wrong Credential !" });

    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
