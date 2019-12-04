const express = require("express")
const path = require("path")
const app = express()
const fetch = require("node-fetch")
const PORT = process.env.PORT || 8000
const key = "RGAPI-1ea803f8-b621-42da-a92d-833152031362"

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
        let recentMatches = []
        //UPDATE THE THIS TO MAYBE TOP 5 MATCHES
        for(let i = 0; i < 2; i++){
            let matchStats = await(await fetch (`https://na1.api.riotgames.com/lol/match/v4/matches/${matchList.matches[i].gameId}?api_key=${key}`, {
                "Origin": "https://developer.riotgames.com",
                "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
                "X-Riot-Token": "RGAPI-b6ac37f9-a7d0-44f4-b167-62d30f8b358d",
                "Accept-Language": "en-US,en;q=0.9",
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
            })).json()
            recentMatches.push(matchStats)
        }
        let recentMatchStats = []
        for (let i=0; i < recentMatches.length; i++){
            let filteredIds = recentMatches[i].participantIdentities.filter((id) => id.player.summonerName === req.params.summonerName)[0]
            filteredIds.participantId
            let filteredStats = recentMatches[i].participants.filter((id) => id.participantId === filteredIds.participantId)[0]
            recentMatchStats.push(filteredStats)
        }
        
        // console.log(recentMatchStats[0].timeline.role)
        // console.log(recentMatchStats[0].timeline.lane)
        // console.log(recentMatches[0].participants[0].timeline.role)
        // console.log(recentMatches[0].participants[0].timeline.lane)
        let laneOpponent = []
        for(let i = 0; i < recentMatches.length; i++){
            for(let j = 0; j < recentMatches[i].participants.length; j++){
                if(
                    recentMatchStats[i].timeline.lane === recentMatches[i].participants[j].timeline.lane 
                    && 
                    recentMatchStats[i].teamId !== recentMatches[i].participants[j].teamId
                    )
                    {
                    recentMatches[i].participants[j].gameId = recentMatches[i].gameId
                    laneOpponent.push(recentMatches[i].participants[j])
                }
            }
        }
        console.log(laneOpponent, "LANE OPP")
        for(let i = 0; i < laneOpponent.length; i++){
            if(laneOpponent[i+1] && (laneOpponent[i].gameId === laneOpponent[i+1].gameId)){
                console.log("this hit")
                console.log(laneOpponent[i])
                laneOpponent[i+1].duplicate = true
                laneOpponent[i].duplicate = false
            }
            else if(laneOpponent[i+1] && laneOpponent[i].gameId !== laneOpponent[i+1].gameId){
                laneOpponent[i].duplicate = false
            }
        }
        let laneOpponentNoDupes = []
        for (let i = 0; i < laneOpponent.length; i++){
            if(laneOpponent[i].duplicate === false){
                laneOpponentNoDupes.push(laneOpponent[i])
            }
        }
        console.log(laneOpponentNoDupes, "LANE OPP REVISED")
        res.send({
            summoner: summonerJson,
            matches: recentMatches,
            stats: recentMatchStats,
            opponents: laneOpponentNoDupes
        })
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