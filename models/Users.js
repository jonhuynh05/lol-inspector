const mongoose = require("mongoose")
const Schema = mongoose.Schema
const userSchema = new Schema ({
    firstName: String,
    lastName: String,
    username: String,
    email: String,
    profileIconUrl: String,
    password: String,
    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Favorite"
    }]
})

const User = mongoose.model("User", userSchema)
module.exports = User