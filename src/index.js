const express = require("express");
const cors = require("cors");
const app = express();

require("dotenv").config();

app.use(express.json());
app.use(cors());

const authRoute = require('./routes/jwtAuth');

app.get("/", async (req, res) => {
  res.send("it's working!");
});

app.use('/auth', authRoute)
app.listen("8080", () => {
  console.log("Listening at: http://localhost:8080");
});

