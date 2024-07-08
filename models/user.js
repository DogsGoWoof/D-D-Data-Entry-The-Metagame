const mongoose = require("mongoose");

const characterSchema = new mongoose.Schema({
    // properties of applications
    name: {
        type: String,
        required: true,
    },
    class: {
        type: String,
        required: true,
    },
    level: {
        type: Number,
        required: true,
    },
    background: {
        type: String,
        required: true,
    },
    race: {
        type: String,
        required: true,
    },
    alignment: {
        type: String,
        required: true,
    },
    experience: {
        type: Number,
    },
    image: {
        type: String,
    },
    notes: {
        type: String,
    },
    // stats: [statSchema],
    // status: {
    //     type: String,
    //     enum: ['interested', 'applied', 'interviewing', 'rejected', 'accepted'],
    // },
});

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    characters: [characterSchema],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
