const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    title: {type: String, required: true},
    content: {type: String, required: true},
    author: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
    likes: {type: Number, default: 0}, // we should create a user model later to link tracking likes to users also add unlike options 
    comments: [{
        username: {type: String, required: true},
        content: {type: String, required: true},
        createdAt: {type: Date, default: Date.now},
    }]
});

module.exports = mongoose.model("Blog", blogSchema);
