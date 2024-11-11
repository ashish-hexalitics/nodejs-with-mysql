const express = require("express");
const app = express();
require("dotenv").config()
app.use(express.json());
app.use("/auth", require("./routes/authRoutes"));
app.use("/user", require("./routes/userRoutes"));
app.use("/post", require("./routes/userPostRoutes"));


app.listen(process.env.PORT, () => console.log("server started"));
