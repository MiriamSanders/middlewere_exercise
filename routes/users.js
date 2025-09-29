const express = require("express");
const bcrypt = require("bcrypt");

const { auth } = require("../middlewares/auth");
const { UserModel, validUser, validLogin, createToken } = require("../models/userModel")
const jwt = require("jsonwebtoken");

const router = express.Router();

router.get("/", async (req, res) => {
  res.json({ msg: "Users work" })
})

router.get("/myEmail", auth, async (req, res) => {
  try {
    let user = await UserModel.findOne({ _id:
       req.tokenData._id }, { email: 1 })
    res.json(user);
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err", err })
  }
})

router.get("/myInfo", async (req, res) => {
 
  let token = req.header("x-api-key");
  if (!token) {
    return res.status(401).json({ msg: "You need to send token to this endpoint url" })
  }
  try {
    let tokenData = jwt.verify(token, "MaorSecret");
    console.log(tokenData);
    let user = await UserModel.findOne({ _id: tokenData._id },
       { password: 0 });
    res.json(user);
  }
  catch (err) {
    return res.status(401).json({ msg: "Token not valid or expired" })
  }

})

router.post("/", async (req, res) => {
  let validBody = validUser(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let user = new UserModel(req.body);
    console.log(user);
    
    user.password = await bcrypt.hash(user.password, 10);

    await user.save();
    user.password = "******";
    res.status(201).json(user);
  }
  catch (err) {
    if (err.code == 11000) {
      return res.status(500).json({ msg: "Email already in system, try log in", code: 11000 })

    }
    console.log(err);
    res.status(500).json({ msg: "err", err })
  }
})

router.post("/login", async (req, res) => {
  let validBody = validLogin(req.body);
  if (validBody.error) {
    console.log(validBody.error);
    return res.status(400).json(validBody.error.details);
  }
  try {
    let user = await UserModel.findOne({ email: req.body.email })
    if (!user) {
      return res.status(401).json({ msg: "Password or email is wrong ,code:1" })
    }
    let authPassword = await bcrypt.compare(req.body.password, user.password);
    if (!authPassword) {
      return res.status(401).json({ msg: "Password or email is wrong ,code:2" });
    }
    let newToken = createToken(user._id);
    res.json({ token: newToken });
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err", err })
  }
})

module.exports = router;