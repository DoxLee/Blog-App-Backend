require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const cookieParser = require("cookie-parser");

const app = express();

// For blogposts i make the request limit 50mb
app.use(express.json({ limit: "50mb" }));
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());

mongoose.connect(
  process.env.MONGO_DB,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  (err) => {
    if (err) throw err;
    console.log("mongodb connection established");
  }
);

app.use("/users", require("./routes/userRouter"));
app.use("/blog", require("./routes/blogRouter"));

app.listen(3000);
