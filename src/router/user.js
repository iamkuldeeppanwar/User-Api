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
    console.log(e);
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
  } catch (e) {
    res.status(400).send(e);
  }
});

//Update-user
router.patch("/users/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  try {
    if (req.body.name !== "") user.name = req.body.name;
    if (req.body.email !== "") user.email = req.body.email;
    if (req.body.phone !== "") user.phone = req.body.phone;

    await user.save();
    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

//Get Single user
router.get("/users/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  try {
    if (!user) {
      throw new Error("user not Found!");
    }
    res.send(user);
  } catch (e) {
    res.status(404).send(e);
  }
});

//Get all Sorted user
router.get("/users", auth, async (req, res) => {
  const user = await User.find({}, null, { sort: { name: 1 } });
  res.send(user);
});

//Logout users
router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
});

//Deleting User
router.delete("/users/:id", auth, async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ _id: req.params.id });
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
