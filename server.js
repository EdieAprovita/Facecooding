const express = require("express");
const app = express();

app.get("/", () => res.send("hello"));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Listening on ${PORT}`));