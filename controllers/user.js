const express = require("express")
const router = express.Router();
const User = require("../models/Users")
const Favorite = require("../models/Favorites")

router.get("/:id", async (req, res) => {
    try{
        const foundUser = await User.findOne({
            username: req.params.id
        })
        res.json(foundUser)
        
    }
    catch(err){
        res.send(err)
        console.log(err)
    }
})