const mongoose = require("mongoose");
const Schema = mongoose.Schema

const userSchema = new Schema ({
    username: {
        type: String,
        required:true,
        unique:"This username is already taken"
    },

    password: {
        type: String,
        required:true
    },

    email: {
        type: String,
        required:true,
        unique: "This email is already in use!!"
    },

    avatar: {
        type: String,
        required:true
    },

    date: {
        type: String,
        default: Date.now
    },
});

module.exports = User = mongoose.model("users", userSchema);