const express = require("express")
const path = require("path")
const app = express()
const fetch = require("node-fetch")
const PORT = process.env.PORT || 8000
const key = "RGAPI-b6ac37f9-a7d0-44f4-b167-62d30f8b358d"

app.use(express.static(path.join(__dirname, "build")))

app.get("/api/v1/champions", async (req, res) => {
    try{
        const data = await fetch(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/wearydisciple?api_key=${key}`)
        const dataJson = await data.json()
        console.log(dataJson)
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
        console.log(dataJson)
        console.log(dataJson.accountId)

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
        const matches = await(await fetch (`https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/${summonerJson.accountId}?api_key=${key}`)).json()
        console.log(matches)
        res.send(matches)
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