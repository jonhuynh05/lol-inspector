const express = require("express")
const path = require("path")
const app = express()
const fetch = require("node-fetch")
const PORT = process.env.PORT || 8000

app.use(express.static(path.join(__dirname, "build")))

// app.get("/api/v1/hello", (req, res) => {
//     res.json({message: "hi"})
// })

app.get("/api/v1/champions", async (req, res) => {
    try{
        const data = await fetch("https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/wearydisciple?api_key=RGAPI-b6ac37f9-a7d0-44f4-b167-62d30f8b358d")
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