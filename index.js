const express = require("express");
const { connection } = require("./configs/db");
const { userRouter } = require("./routes/users.route");
const { authenticate, authorize } = require("./middlewares/authenticate");

const app = express();
app.use(express.json());

app.use("/user", userRouter);

app.get("/goldrate", authenticate, (req, res) => {
  res.send("Now you can see the gold rates");
});

app.get("/userstats", authenticate, authorize(["manager"]), (req, res) => {
  res.send("All the stats are here");
});

app.listen(4567, async () => {
  try {
    await connection;
    console.log("Running at 4567");
  } catch (error) {
    console.log("something went wrong while connecting db");
    console.log(error);
  }
});
