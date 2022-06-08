const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

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

userSchema.pre("save", function(next) {
    
    this.password = bcrypt.hashSync(this.password, 10);
    next();

});


const User = mongoose.model("user", userSchema);

module.exports = User;