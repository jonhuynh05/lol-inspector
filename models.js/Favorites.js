const mongoose = require("mongoose")
const Schema = mongoose.Schema
const favoriteSchema = new Schema ({
    summonerName: String,
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
})

const Favorite = mongoose.model("Favorite", favoriteSchema)
module.exports = Favorite