import React, { Component } from 'react'
import './App.css';
import {Route, Switch, withRouter} from "react-router-dom"
import Footer from "./Footer"
import * as ROUTES from "./constants/routes"
import PlayerSearch from "./PlayerSearch"
import ShowPlayer from "./ShowPlayer"
import Nav from "./Nav"
import User from "./ShowUser"
import Login from "./Login"


class App extends Component{
  state = {
    userId: "",
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    errorMessage: "",
    isLoggedIn: false,
    loginUsername: "",
    loginPassword: "",
    loginErrorMessage: "",
    favorites: []
  }

  onChange = (e) => {
    this.setState({
        [e.target.name]: e.target.value
    })
}

handleLoginReset = () => {
    this.setState({
      errorMessage: "",
      loginErrorMessage: ""
  })
}

handleRegister = async (e) => {
    e.preventDefault()
    try{
        const registerResponse = await fetch(`${ROUTES.USER}/register`, {
            method: "POST",
            credentials: "include",
            body: JSON.stringify(this.state),
            headers:{
                "Content-Type": "application/json"
            }
        })
            .then(async res => {
                const response = await res.json()
                if(response.message === "Email already exists."){
                    this.setState({
                        errorMessage: response.message
                    })
                }
                else if(response.message === "Username already exists."){
                    this.setState({
                        errorMessage: response.message
                    })
                }
                else if(response.message === "Success."){
                    console.log(response)
                    this.setState({
                        isLoggedIn: true,
                        errorMessage: "",
                        password: "",
                        loginErrorMessage: "",
                        loginPassword: "",
                        userId: response.userId,
                    })
                    this.props.history.push("/");
                }
            })
        }
    catch (err) {
            console.log(err)
        }
}

handleLogin = async (e) => {
    e.preventDefault()
    try{
        const login = await fetch(`${ROUTES.USER}/login`, {
            method: "POST",
            credentials: "include",
            body: JSON.stringify(this.state),
            headers:{
                "Content-Type": "application/json"
            }
        })
            .then(async res => {
                const response = await res.json()
                console.log(response, "login response")
                if(response.message === "Incorrect username or password."){
                    this.setState({
                        loginErrorMessage: response.message
                    })
                }
                else if(response.firstName){
                    this.setState({
                        firstName: response.firstName,
                        lastName: "",
                        username: response.username,
                        email: response.email,
                        isLoggedIn: true,
                        errorMessage: "",
                        password: "",
                        loginErrorMessage: "",
                        loginPassword: "",
                        userId: response.userId,
                        favorites: response.favorites
                    })
                    this.props.history.push("/");
                }
            })
        }
    catch (err) {
            console.log(err)
      }
}

handleLogout = async() => {
    this.setState({
        userId: "",
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        errorMessage: "",
        isLoggedIn: false,
        loginUsername: "",
        loginPassword: "",
        loginErrorMessage: "",
    })
    this.props.history.push("/");
    const logout = await fetch(`${ROUTES.USER}/logout`)
}



  render(){
    return (
      <div className="App">
        <Nav isLoggedIn={this.state.isLoggedIn} username={this.state.username} userId={this.state.userId} logout={this.handleLogout}/>
        <Switch>
            <Route exact path={ROUTES.HOME} render={() => <PlayerSearch isLoggedIn={this.state.isLoggedIn}/>} username={this.state.username} userId={this.state.userId}/>
            <Route exact path={`${ROUTES.SEARCH}/:summoner`} render={() => <ShowPlayer isLoggedIn={this.state.isLoggedIn} username={this.state.username} userId={this.state.userId} favorites={this.state.favorites}/>}/>
            <Route exact path={ROUTES.USER} render={() => <Login onChange={this.onChange} handleLoginReset={this.handleLoginReset} handleLogin={this.handleLogin} handleRegister={this.handleRegister} state={this.state}/>}/>
        {
            this.state.isLoggedIn
            ?
            <Route exact path={`${ROUTES.USER}/:userId`} render={() => <User isLoggedIn={this.state.isLoggedIn}/>} username={this.state.username} userId={this.state.userId}/>
            :
            <Route exact path={`${ROUTES.USER}/:userId`} render={() => <PlayerSearch isLoggedIn={this.state.isLoggedIn}/>} username={this.state.username} userId={this.state.userId}/>
        }
        </Switch>
        <Footer />
      </div>
    )
  }
}

export default withRouter(App);
