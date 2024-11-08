const express = require("express");
const app = express();

app.use(express.json());
app.use("/user", require("./routes"));

app.listen(8000, () => console.log("server started"));
