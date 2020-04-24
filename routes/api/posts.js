const express = require("express");
const router = express.Router();

//GET api/users/register

router.get("/register", (req, res) => res.json({ msg: "user works"}))

module.exports = router;