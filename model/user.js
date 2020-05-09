const mongoose = require('mongoose');
const User = new mongoose.Schema({
    fullname: { type: String },
    username: { type: String, unique: true },
    password: { type: String },
    imageUser: { type: String },
});

module.exports = mongoose.model("User", User);