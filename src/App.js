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
