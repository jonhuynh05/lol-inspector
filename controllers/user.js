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
        const foundEmail = await User.findOne({
            email: req.body.email
        })
        const foundUsername = await User.findOne({
            username: req.body.username
        })
        if(foundEmail){
            res.json({
                message: "Email already exists."
            })
        }
        else if(foundUsername){
            res.json({
                message: "Username already exists."
            })
        }
        else{
            const userDbEntry = {}
            const password = req.body.password
            const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
            userDbEntry.firstName = req.body.firstName
            userDbEntry.lastName = req.body.lastName
            userDbEntry.username = req.body.username
            userDbEntry.email = req.body.email
            userDbEntry.password = passwordHash
            const newUser = await User.create(userDbEntry)
            res.json({
                message: "Success."
            })
        }
    }
    catch(err){
        res.send(err)
        console.log(err)
    }
})

module.exports = router