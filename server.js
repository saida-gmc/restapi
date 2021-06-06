const express = require("express");
const app = express();

const User = require("./models/User");
const mongoose = require("mongoose");
const { restart } = require("nodemon");
//dot env
const dotenv = require("dotenv").config();

//middelware
app.use(express.json());
//connect to db
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("database connected");
  } catch (error) {
    console.log(error);
  }
};
connectDB();
//
app.listen(5000, (err) => {
  err
    ? console.log(err)
    : console.log(`server is connected on port ${process.env.PORT}`);
});
//test
app.get("/", (req, res) => {
  res.send({ msg: "routing" });
});
//add user
app.post("/api/users", async () => {
  try {
    const newUser = new User(req.body);
    const findUser = await User.findOne({ name: req.body.name });
    if (findUser) {
      return restart.status(400).send({ msg: "name should be unique" });
    }
    await newUser.save();
    res.send({ message: "user added", newUser });
  } catch (error) {
    res.status(500).send(error);
  }
});
//get users
app.get("/", async () => {
  try {
    const allUsers = await User.find({});
    res.send(allUsers);
  } catch (error) {
    res.status(400).send(error);
  }
});
//edit user
app.put("/:id", async (req, res) => {
  try {
    const updatedUser = await User.updateOne(
      { _id: req.params.id },
      { $set: { ...req.body } }
    );

    res.send(updatedUser);
  } catch (error) {
    res.status(400).send({ message: "user not found" });
  }
});
//delete user
app.delete("/:id", async (req, res) => {
  try {
    await User.deleteOne({ _id: req.params.id });

    res.send({ message: "user deleted" });
  } catch (error) {
    res.status(400).send({ message: "user not found" });
  }
});
