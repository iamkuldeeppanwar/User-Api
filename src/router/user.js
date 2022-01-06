const express = require("express");
const router = new express.Router();
const User = require("../model/user");
const auth = require("../middleware/auth");

//Creating users
router.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

//Login users
router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.status(200).send({ user, token });
    await User.save();
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

//Authenticate users
router.get("/users/me", auth, async (req, res) => {
  try {
    await res.send(req.user);
    res.status(200).send(req.user);
  } catch (e) {
    console.log(e);
    res.status(404).send(e);
  }
});

module.exports = router;
