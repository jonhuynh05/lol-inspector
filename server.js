require('dotenv').config()
const express = require("express")
const path = require("path")
const app = express()
const fetch = require("node-fetch")
const PORT = process.env.PORT || 8000
const key = process.env.LOL_API_KEY
app.use(express.static(path.join(__dirname, "build")))

app.get("/api/v1/champions", async (req, res) => {
    try{
        const data = await fetch(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/wearydisciple?api_key=${key}`)
        const dataJson = await data.json()
        res.send(dataJson)
    }
    catch(err){
        console.log(err)
        res.send(err)
    }
})

app.get("/api/v1/search/:query", async (req, res) => {
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
            //UPDATE THE THIS TO MAYBE TOP 5 MATCHES
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
                    // if(recentMatchStats[i].timeline.lane === "NONE" && (recentMatchStats[i].timeline.role === "DUO_CARRY" || recentMatchStats[i].timeline.role === "DUO_SUPPORT" || recentMatchStats[i].timeline.role === "DUO")){
                    //     recentMatchStats[i].timeline.lane = "BOTTOM"
                    // }
                    // if(classicOnlyMatches[i].participants[j].timeline.lane === "NONE" && (classicOnlyMatches[i].participants[j].timeline.role === "DUO_CARRY" || classicOnlyMatches[i].participants[j].timeline.lane === "DUO_SUPPORT" || classicOnlyMatches[i].participants[j].timeline.lane === "DUO")){
                    //     classicOnlyMatches[i].participants[j].timeline.lane = "BOTTOM"
                    // }
                    console.log(classicOnlyMatches[i].participants[j].teamId, classicOnlyMatches[i].participants[j].timeline.lane, classicOnlyMatches[i].participants[j].timeline.role, "OPP", recentMatchStats[i].teamId, recentMatchStats[i].timeline.lane, recentMatchStats[i].timeline.role, "USER", i, "I")
                    if(//last game mightnow be hitting
                        recentMatchStats[i].timeline.lane === classicOnlyMatches[i].participants[j].timeline.lane //this makes sure we are pushing same lane
                        && 
                        recentMatchStats[i].teamId !== classicOnlyMatches[i].participants[j].teamId //this makes sure we aren't pushing teammates
                        )
                        {
                            console.log(i)
                        classicOnlyMatches[i].participants[j].gameId = classicOnlyMatches[i].gameId //this gives the found participants a gameId
                        laneOpponent.push(classicOnlyMatches[i].participants[j])
                    }
                }
            }
            let matchup = {}
            let matchupArr = []
            for (let i = 0; i< laneOpponent.length; i++){
                console.log(laneOpponent[i].timeline.role, "role", laneOpponent[i].timeline.lane, "lane", laneOpponent[i].gameId, "id")
            }
            console.log(laneOpponent.length)
            for (let i = 0; i< recentMatchStats.length; i++){
                console.log(recentMatchStats[i].timeline.role, "role", recentMatchStats[i].timeline.lane, "lane", recentMatchStats[i].gameId, "id")
            }
            for(let i = 0; i < recentMatchStats.length; i++){
                matchup = {}
                let filteredMatchups = laneOpponent.filter((id) => id.gameId === recentMatchStats[i].gameId)
                matchup.user = recentMatchStats[i]
                matchup.opponents = filteredMatchups
                matchupArr.push(matchup)
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

app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"))
})

app.listen(PORT, () => {
    console.log(`Running on PORT ${PORT}.`)
})