const mongoose = require("mongoose")
const Schema = mongoose.Schema
const favoriteSchema = new Schema ({
    summonerName: String,
    summonerUrl: String,
})

const Favorite = mongoose.model("Favorite", favoriteSchema)
module.exports = Favorite