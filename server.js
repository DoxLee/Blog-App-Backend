require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

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
app.use("/admin", require("./routes/adminRouter"));
app.use("/blog", require("./routes/blogRouter"));

app.listen(3000);
