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

router.get("/logout", async (req, res) => {
    try{
        req.session.destroy()
        res.json("logout successful")
    }
    catch(err) {
        res.send(err)
    }

})

router.post("/login", async (req, res) => {
    try{
        const foundUsername = await User.findOne({
            username: req.body.loginUsername
        })
        if(foundUsername){
            if(bcrypt.compareSync(req.body.loginPassword, foundUsername.password)){
                req.session.firstName = foundUsername.firstName
                req.session.email = foundUsername.email
                req.session.username = foundUsername.username
                req.session.userId = foundUsername._id
                res.json({
                    firstName: req.session.firstName,
                    email: req.session.email,
                    username: req.session.username,
                    userId: req.session.userId
                })
            }
            else {
                res.json({
                    message: "Incorrect username or password."
                })
            }
        }
        else{
            res.json({
                message: "Incorrect username or password."
            })
        }
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
            req.session.firstName = newUser.firstName
            req.session.email = newUser.email
            req.session.username = newUser.username
            req.session.userId = newUser._id
            res.json({
                firstName: req.session.firstName,
                email: req.session.email,
                username: req.session.username,
                userId: req.session.userId,
                message: "Success.",
            })
        }
    }
    catch(err){
        res.send(err)
        console.log(err)
    }
})

module.exports = router