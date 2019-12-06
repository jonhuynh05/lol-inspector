import React, { Component } from 'react'
import './App.css';
import {Route, Switch} from "react-router-dom"
import Footer from "./Footer"
import * as ROUTES from "./constants/routes"
import PlayerSearch from "./PlayerSearch"
import ShowPlayer from "./ShowPlayer"
import Nav from "./Nav"
import User from "./ShowUser"
import Login from "./Login"


class App extends Component{
  state = {
    summoner: [],
    isLoggedIn: false,
    username: "",
    userId: ""
  }
  async componentDidMount(){
    try{
      const message = await fetch("/api/v1/champions")
      const messageJson = await message.json()
      // console.log(messageJson)
      this.setState({
        summoner: messageJson
      })
      // const matchHistory = await fetch(`https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/${this.state.accountId}?api_key=RGAPI-b6ac37f9-a7d0-44f4-b167-62d30f8b358d`)
      // const matchHistoryJson = await matchHistory.json()
      // console.log(matchHistoryJson)
    }
    catch(err){
      console.log(err)
    }
  }

  render(){
    return (
      <div className="App">
        <Nav isLoggedIn={this.state.isLoggedIn} username={this.state.username} userId={this.state.userId}/>
        <Switch>
          <Route exact path={ROUTES.HOME} render={() => <PlayerSearch isLoggedIn={this.state.isLoggedIn}/>} username={this.state.username} userId={this.state.userId}/>
          <Route exact path={`${ROUTES.USER}/:userId`} render={() => <User isLoggedIn={this.state.isLoggedIn}/>} username={this.state.username} userId={this.state.userId}/>}/>
          <Route exact path={`${ROUTES.SEARCH}/:summoner`} render={() => <ShowPlayer isLoggedIn={this.state.isLoggedIn} username={this.state.username} userId={this.state.userId}/>}/>
          <Route exact path={ROUTES.USER} render={() => <Login isLoggedIn={this.state.isLoggedIn}/>} username={this.state.username} userId={this.state.userId}/>}/>
        </Switch>
        <Footer />
      </div>
    )
  }
}

export default App;
