require('dotenv').config()
const express = require("express")
const path = require("path")
const app = express()
const methodOverride = require("method-override")
const bodyParser = require("body-parser")
const session = require("express-session")
const fetch = require("node-fetch")
const userController = require("./controllers/user")
const PORT = process.env.PORT || 8000
const key = process.env.LOL_API_KEY
const User = require("./models/Users")
const Favorite = require("./models/Favorites")
const bcrypt = require("bcryptjs");

require("./config/db")

app.use(express.static(path.join(__dirname, "build")))
app.use(session({
    secret: "lol is best",
    resave: false,
    saveUninitialized: false
}))
app.use(methodOverride("_method"));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));
app.use("/user", userController)

//API CALLS
app.get("/api/v1/:query", async (req, res) => {
    try{
        const data = await fetch(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${req.params.query}?api_key=${key}`,
            {
                "Origin": "https://developer.riotgames.com",
                "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
                "X-Riot-Token": "RGAPI-b6ac37f9-a7d0-44f4-b167-62d30f8b358d",
                "Accept-Language": "en-US,en;q=0.9",
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
            }
        )
        const dataJson = await data.json()
        // res.set({
        //     "X-App-Rate-Limit-Count": "1:1,1:120",
        //     "Content-Encoding": "gzip",
        //     "X-Method-Rate-Limit-Count": "1:60",
        //     "Vary": "Accept-Encoding",
        //     "X-App-Rate-Limit": "20:1,100:120",
        //     "X-Method-Rate-Limit": "2000:60",
        //     "transfer-encoding": "chunked",
        //     "Connection": "keep-alive",
        //     "Date": "Tue, 3 Dec 2019  23:04:59 GMT",
        //     "X-Riot-Edge-Trace-Id": "058a7e58-0915-4d04-bb4a-5211e64dc04c",
        //     "Content-Type": "application/json;charset=utf-8"
        // })
        res.send(dataJson)
    }
    catch(err){
        console.log(err)
        res.send(err)
    }
})

app.get("/api/v1/search/:summonerName/matches", async (req, res) => {
    try{
        console.log(req.params.summonerName)
        const summoner = await fetch(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${req.params.summonerName}?api_key=${key}`,
            {
                "Origin": "https://developer.riotgames.com",
                "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
                "X-Riot-Token": "RGAPI-b6ac37f9-a7d0-44f4-b167-62d30f8b358d",
                "Accept-Language": "en-US,en;q=0.9",
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
            }
        )
        const summonerJson = await summoner.json()
        const matchList = await(await fetch (`https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/${summonerJson.accountId}?api_key=${key}`, {
            "Origin": "https://developer.riotgames.com",
            "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
            "X-Riot-Token": "RGAPI-b6ac37f9-a7d0-44f4-b167-62d30f8b358d",
            "Accept-Language": "en-US,en;q=0.9",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
        })).json()
        if(matchList.matches){
            let recentMatches = []
            for(let i = 0; i < 5; i++){
                let matchStats = await(await fetch (`https://na1.api.riotgames.com/lol/match/v4/matches/${matchList.matches[i].gameId}?api_key=${key}`, {
                    "Origin": "https://developer.riotgames.com",
                    "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
                    "X-Riot-Token": "RGAPI-b6ac37f9-a7d0-44f4-b167-62d30f8b358d",
                    "Accept-Language": "en-US,en;q=0.9",
                    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
                })).json()
                recentMatches.push(matchStats)
            }
            let classicOnlyMatches = recentMatches.filter((match) => {
                return match.gameMode === "CLASSIC"
            })
            let recentMatchStats = []
            for (let i=0; i < classicOnlyMatches.length; i++){
                let filteredIds = classicOnlyMatches[i].participantIdentities.filter((id) => id.player.summonerName.toLowerCase() === req.params.summonerName.toLowerCase())[0]
                filteredIds.participantId
                let filteredStats = classicOnlyMatches[i].participants.filter((id) => id.participantId === filteredIds.participantId)[0]
                filteredStats.queriedSummoner = true
                filteredStats.gameId = classicOnlyMatches[i].gameId
                recentMatchStats.push(filteredStats)
            }
            let laneOpponent = []
            for(let i = 0; i < classicOnlyMatches.length; i++){
                for(let j = 0; j < classicOnlyMatches[i].participants.length; j++){
                    if(recentMatchStats[i].timeline.lane === "NONE" && (recentMatchStats[i].timeline.role === "DUO_CARRY" || recentMatchStats[i].timeline.role === "DUO_SUPPORT" || recentMatchStats[i].timeline.role === "DUO")){
                        recentMatchStats[i].timeline.lane = "BOTTOM"
                    }
                    if(classicOnlyMatches[i].participants[j].timeline.lane === "NONE" && (classicOnlyMatches[i].participants[j].timeline.role === "DUO_CARRY" || classicOnlyMatches[i].participants[j].timeline.lane === "DUO_SUPPORT" || classicOnlyMatches[i].participants[j].timeline.lane === "DUO")){
                        classicOnlyMatches[i].participants[j].timeline.lane = "BOTTOM"
                    }
                    if(//last game mightnow be hitting
                        recentMatchStats[i].timeline.lane === classicOnlyMatches[i].participants[j].timeline.lane //this makes sure we are pushing same lane
                        && 
                        recentMatchStats[i].teamId !== classicOnlyMatches[i].participants[j].teamId //this makes sure we aren't pushing teammates
                        )
                        {
                        classicOnlyMatches[i].participants[j].gameId = classicOnlyMatches[i].gameId //this gives the found participants a gameId
                        laneOpponent.push(classicOnlyMatches[i].participants[j])
                    }
                }
            }
            let matchup = {}
            let matchupArr = []
            for(let i = 0; i < recentMatchStats.length; i++){
                matchup = {}
                let filteredMatchups = laneOpponent.filter((id) => id.gameId === recentMatchStats[i].gameId)
                matchup.user = recentMatchStats[i]
                matchup.opponents = filteredMatchups
                matchupArr.push(matchup)
            }
            for(let i = 0; i < matchupArr.length; i++){
                if(matchupArr[i].opponents.length === 0){
                    matchupArr[i].opponents.push({message:"no opponent"})
                }
            }
            res.send({
                summoner: summonerJson,
                matches: classicOnlyMatches,
                stats: recentMatchStats,
                opponents: laneOpponent,
                matchups: matchupArr
            })
        }
        else{
            summonerJson.noMatches = true
            res.send({
                summoner: summonerJson
            })
        }
    }
    catch(err){
        console.log(err)
        res.send(err)
    }
})


app.post("/search/:summonerName/follow", async (req, res) => {
    try{
        User.findById(req.session.userId, async (err, foundUser) => {
            console.log(foundUser, "this is in follow route")
            const foundFavorite = await Favorite.findOne({summonerName: req.params.summonerName})
            if(foundFavorite){
                foundUser.favorites.push(foundFavorite)
                foundUser.save((err, data) => {
                    console.log(foundUser, "found existing fave")
                    res.json("added favorite")
                })
            }
            else{
                Favorite.create(req.body, (err, createdFavorite) => {
                    if(err){
                        console.log("not created")
                        res.send(err)
                    }
                    else{
                        foundUser.favorites.push(createdFavorite)
                        foundUser.save((err, data) => {
                            console.log("created")
                            res.json("added favorite")
                        })
                    }
                })
            }
        })
    }
    catch(err){
        console.log(err)
    }
})

app.put("/search/:summonerName/unfollow", async (req, res) => {
    try{
        console.log(req.session, "SESSION")
        const foundUser = await User.findById(req.session.userId)
        const foundFavorite = await Favorite.findOne({summonerName: req.params.summonerName})
        console.log(foundUser, "FOUND USER")
        foundUser.favorites.remove(foundFavorite._id)
        // for(let i = 0; i < foundUser.favorites.length; i++) {
        //     if(foundUser.favorites[i].toString() === foundFavorite._id.toString()){
        //         console.log(foundUser, "preremove")
        //         foundUser.favorites[i].splice(i, 1)
        //         console.log(foundUser, "postremove")
        //     }
        // }
        console.log(foundUser, "post remove")


        // const userFavorites = await Promise.all(foundUsername.favorites.map((favorite) => {
        //     let foundFavorite = Favorite.findById(favorite)
        //     return foundFavorite
        // }))   


        // User.findById(req.session.userId, (err, foundUser) => {
        //     console.log(foundUser, "foundUser")
        //     const foundFavorite = Favorite.findOne({"summonerName": req.params.summonerName})
        //     console.log(foundFavorite, "foundFave")
        //     console.log(foundFavorite._id, "id?????")
        //     console.log(foundUser.favorites, "user faves")
        //     console.log(foundUser.favorites.id(foundFavorite), "id?")
        // })
    }
    catch(err){
        console.log(err)
        res.send(err)
    }
})



app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"))
})

app.listen(PORT, () => {
    console.log(`Running on PORT ${PORT}.`)
})