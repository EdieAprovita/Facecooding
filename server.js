const express = require("express");
const connectDB = require("./config/db");

const app = express();

//Connect MongoDB Database

connectDB();

app.get("/", (req, res) => res.send("API Running"));

//Routes for the API

app.use("/api/users", require("./routes/api/user"))
app.use("/api/auth", require("./routes/api/auth"))
app.use("/api/profile", require("./routes/api/profile"))
app.use("/api/posts", require("./routes/api/post"))

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));