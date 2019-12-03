import React, { Component } from 'react'
import './App.css';
import {Route, Switch} from "react-router-dom"
import Footer from "./Footer"
import * as ROUTES from "./constants/routes"


class App extends Component{
  state = {
    summoner: []
  }
  async componentDidMount(){
    try{
      const message = await fetch("/api/v1/champions")
      const messageJson = await message.json()
      console.log(messageJson)
      this.setState({
        summoner: messageJson
      })
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
