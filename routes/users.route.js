const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/users.model");
const fs = require("fs");

const userRouter = express.Router();
userRouter.get("/hi", (req, res) => {
  res.send("getting");
});

userRouter.post("/signup", async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    bcrypt.hash(password, 3, async (err, encrypted) => {
      if (err) {
        res.send(err);
      } else {
        const user = new UserModel({ name, email, password: encrypted, role });
        await user.save();
        res.send("Registered");
      }
    });
  } catch (error) {
    res.send("error while registering");
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    const hashed_password = user?.password;

    bcrypt.compare(password, hashed_password, (err, result) => {
      if (result) {
        const token = jwt.sign({ userID: user._id, role: user.role }, "coder", {
          expiresIn: 60,
        });
        const refresh_token = jwt.sign({ userID: user._id }, "refreshtoken", {
          expiresIn: 300,
        });

        res.send({
          message: "Logged in successfully",
          token: token,
          refresh_token: refresh_token,
        });
      } else {
        res.send("Wrong credentials");
      }
    });
  } catch (error) {
    res.send(error);
    console.log("erroe:", error);
  }
});

userRouter.get("/logout", (req, res) => {
  const token = req.headers.authorization;
  const blacklisted = JSON.parse(fs.readFileSync("./blacklist.json", "utf-8"));
  blacklisted.push(token);
  console.log(blacklisted);
  fs.writeFileSync("./blacklist.json", JSON.stringify(blacklisted));
  res.send("Logged out successfully");
});

module.exports = { userRouter };
