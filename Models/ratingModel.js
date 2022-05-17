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
    }

});

const Rating = mongoose.model("rating", ratingSchema);

module.exports = Rating;