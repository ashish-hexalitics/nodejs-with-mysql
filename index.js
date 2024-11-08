const express = require("express");
const app = express();
require("dotenv").config()
app.use(express.json());
app.use("/user", require("./routes"));

app.listen(process.env.PORT, () => console.log("server started"));
