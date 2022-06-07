const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ratingSchema = new Schema({
    prof: {
        type: Number,
        required: true
    },
    module:{
        type: Number,
        required: true
    },
    title:{
        type: String,
        required: false
    },
    comment: {
        type: String,
        required: false
    },
    anonymous: {
        type: Boolean,
        required: false
    },
    stars: {
        type: Object,
        required: true
    },
    date: {
        type: Number,
        required: true
    },
    authorEmail: {
        type: String,
        required: true
    },
    authorName: {
        type: String,
        required: false
    }

});

const Rating = mongoose.model("rating", ratingSchema);

module.exports = Rating;