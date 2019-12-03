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
        res.send(dataJson)
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