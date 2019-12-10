const express = require("express")
const router = express.Router();
const User = require("../models/Users")
const Favorite = require("../models/Favorites")
const bcrypt = require("bcryptjs");


router.get("/", async (req, res) => {
    try{
        console.log("this hits")
        const foundUser = await User.findById(req.session.userId)
        console.log(foundUser, "USER")
        const userFavorites = await Promise.all(foundUser.favorites.map((favorite) => {
            let foundFavorite = Favorite.findById(favorite)
            return foundFavorite
        }))
        res.json({ 
            firstName: foundUser.firstName,
            lastName: foundUser.lastName,
            email: foundUser.email,
            username: foundUser.username,
            userId: foundUser.userId,
            favorites: userFavorites
        })
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
                const userFavorites = await Promise.all(foundUsername.favorites.map((favorite) => {
                    let foundFavorite = Favorite.findById(favorite)
                    return foundFavorite
                }))                
                res.json({ 
                    firstName: req.session.firstName,
                    lastName: foundUsername.lastName,
                    email: req.session.email,
                    username: req.session.username,
                    userId: req.session.userId,
                    favorites: userFavorites
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

router.put("/:id/edit", async (req, res) => {
    try{
        const foundUser = await User.findById(req.session.userId)
        const foundEmail = await User.findOne({
            email: req.body.email
        })
        const foundUsername = await User.findOne({
            username: req.body.username
        })
        if(foundUser){
            if(bcrypt.compareSync(req.body.password, foundUser.password)){
                if(req.session.email !== req.body.email){
                    if(foundEmail){
                        res.json({
                            message: "Email already exists."
                        })
                    }
                }
                if(req.session.username !== req.body.username){
                    if(foundUsername){
                        res.json({
                            message: "Username already exists."
                        })
                    }
                }
                const userDbEntry = {}
                if(req.body.newPassword){
                    const password = req.body.newPassword
                    const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
                    userDbEntry.firstName = req.body.firstName
                    userDbEntry.lastName = req.body.lastName
                    userDbEntry.username = req.body.username
                    userDbEntry.email = req.body.email
                    userDbEntry.password = passwordHash
                    const editUser = await User.findByIdAndUpdate(req.session.userId, userDbEntry, {new: true})
                    res.json({
                        message: "Success."
                    })
                }
                else{
                    userDbEntry.firstName = req.body.firstName
                    userDbEntry.lastName = req.body.lastName
                    userDbEntry.username = req.body.username
                    userDbEntry.email = req.body.email
                    const editUser = await User.findByIdAndUpdate(req.session.userId, userDbEntry, {new: true})
                    res.json({
                        message: "Success."
                    })
                }
            }
            else {
                res.json({
                    message: "Incorrect password."
                })
            }
        }
        else{
            res.json({
                message: "Something went wrong. Please try again later."
            })
        }
    }
    catch(err){
        console.log(err)
        res.send(err)
    }
})

router.delete("/:id/delete", async (req, res) => {
    try{
        const user = await User.findByIdAndRemove(req.session.userId)
        req.session.destroy()
        res.json({message: "Success."})
    }
    catch(err){
        console.log(err)
        res.send(err)
    }
})


module.exports = router