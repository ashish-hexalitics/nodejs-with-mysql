const express = require("express");
const app = express();
require("dotenv").config()

const path = require("path");
app.use("/public", express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use("/auth", require("./routes/authRoutes"));
app.use("/user", require("./routes/userRoutes"));
app.use("/post", require("./routes/userPostRoutes"));
app.use("/items", require("./routes/userItemsRoutes"));


app.listen(process.env.PORT, () => console.log("server started"));
