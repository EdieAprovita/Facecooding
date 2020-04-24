const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function(req, res, next) {

    //Get token

    const token = req.header("x-auth-token");

    //Verify the token

    if(!token) {
        return res.status(401).json({ msg: "There is no token, I`m calling  911!!!!"});
    }

    //Verify the token

    try {
        const decoded = jwt.verify(token, config.get("jwtSecret"));

        req.user = decoded.user;
        next();
    } catch(err) {
        res.status(401).json({ msg: "This token is not valid, What are you trying to pull???"})
    }
};