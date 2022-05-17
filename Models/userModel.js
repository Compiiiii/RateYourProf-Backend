const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    forename: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    id:{
        type: Number,
        required: false
    },
    title: {
        type: String,
        required: false
    },
    modules: {
        type: Array,
        required: false
    }
});

const User = mongoose.model("user", userSchema);

module.exports = User;