const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    Email: {
        type: String,
        required: true
    },
    Password: {
        type: String,
        required: true
    },
    Name: {
        type: String,
        required: true
    }
});

const User = mongoose.model("user", userSchema);

module.exports = User;