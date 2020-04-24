const express = require("express");
const connectDB = require("./config/db");
const path = require("path");

const app = express();

//Connect MongoDB Database

connectDB();

//Middleware
app.use(express.json());

//Routes for the API

app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static("cliend/build"));

  app.get("*", (req, res) => {
    res.sendfile(path.resolve(_dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
