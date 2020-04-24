const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator/check");
const gravatar = require("gravatar");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("config");
const User = require("../../models/User");

//GET api/users/register

router.post("/", [
    check("username","Username is required").not().isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a password with 8 or more characters please").isLength({ min: 8 })
], async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
        let user = await 
        User.findOne({ email });

        if(user) {
            return res.status(400).json({ errors : [{ msg: "Username is already in use"}]})
        }

        const avatar = gravatar.url(email, {
            s:"200",
            r: "pg",
            d: "mm"
        })

        user = new User ({
            username,
            email,
            avatar,
            password
        });

        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password,salt);

        await user.save();

        const payload = {
            user: {
                id: user.id
            }
        }
        
        jwt.sign(
            payload, 
            config.get("jwtSecret"),
            { expiresIn: 360000 },
            (err, token) => {
                if(err) throw err;
                res.json({ token });
            });

    } catch(err) {
        console.error(err.message);
        res.status(500).send("Server error")
    }

    

});



module.exports = router;