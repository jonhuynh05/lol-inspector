import React, { Component } from 'react'
import './App.css';
import {Route, Switch} from "react-router-dom"
import Footer from "./Footer"
import * as ROUTES from "./constants/routes"


class App extends Component{
  async componentDidMount(){
    try{
      console.log(process.env.REACT_APP_LOL_API_KEY)
      // const data = await fetch("https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/wearydisciple", {
      //   method: "GET",
      //   header: {
      //     "Origin": "https://developer.riotgames.com",
      //     "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
      //     "X-Riot-Token": "RGAPI-b6ac37f9-a7d0-44f4-b167-62d30f8b358d",
      //     "Accept-Language": "en-US,en;q=0.9",
      //     "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
      //   }})
      // const data = await fetch("https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/wearydisciple?api_key=RGAPI-b6ac37f9-a7d0-44f4-b167-62d30f8b358d")
      const message = await fetch("https://na1.api.riotgames.com/lol/platform/v3/champion-rotations?api_key=RGAPI-b6ac37f9-a7d0-44f4-b167-62d30f8b358d")
      const messageJson = await message.json()
      console.log(messageJson)
    }
    catch(err){
      console.log(err)
    }
  }

  render(){
    return (
      <div className="App">
        <Switch>
          <Route exact path={ROUTES.HOME} render={() => <div>home</div>}/>
        </Switch>
        <Footer />
      </div>
    )
  }
}

export default App;
