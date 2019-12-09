const express = require("express")
const router = express.Router();
const User = require("../models/Users")
const Favorite = require("../models/Favorites")
const bcrypt = require("bcryptjs");


router.get("/", async (req, res) => {
    try{
        res.json("hi")
        console.log("hi")
        // const foundUser = await User.findOne({
        //     username: req.params.id
        // })
        // res.json(foundUser)
        
    }
    catch(err){
        res.send(err)
        console.log(err)
    }
})

router.post("/register", async (req, res) => {
    try{
        res.json("hits")
        console.log("hello")
        // const foundEmail = await User.findOne({
        //     email: req.params.email
        // })
        // if(foundEmail){
        //     res.json({
        //         emailExists: true
        //     })
        // }
        // const foundUsername = await User.findOne({
        //     username: req.params.username
        // })
        // if(foundUsername){
        //     res.json({
        //         usernameExists: true
        //     })
        // }


    }
    catch(err){
        res.send(err)
        console.log(err)
    }
})

module.exports = router