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
import EditUser from "./EditUser"
import Page404 from "./Page404"


class App extends Component{
  state = {
    userId: "",
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    profileIconUrl: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Aatrox_0.jpg",
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

handleFavoritesUpdate = async (e) => {
    try{
        const user = await(await fetch(`${ROUTES.USER}`)).json()
        this.setState({
            favorites: user.favorites
        })
    }
    catch(err){
        console.log(err)
    }
}

handleUserDelete = async(e) => {
    try{
        this.setState({
            userId: "",
            firstName: "",
            lastName: "",
            username: "",
            email: "",
            password: "",
            profileIconUrl: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Aatrox_0.jpg",
            errorMessage: "",
            isLoggedIn: false,
            loginUsername: "",
            loginPassword: "",
            loginErrorMessage: "",
            favorites: []
        })
    }
    catch(err){
        console.log(err)
    }
}

handleUserEdit = async(e) => {
    try{
        const user = await(await fetch(`${ROUTES.USER}`)).json()
        this.setState({
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            email: user.email,
            profileIconUrl: user.profileIconUrl
        })
    }
    catch(err){
        console.log(err)
    }
}

handleRegister = async (e) => {
    e.preventDefault()
    try{
        await fetch(`${ROUTES.USER}/register`, {
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
        await fetch(`${ROUTES.USER}/login`, {
            method: "POST",
            credentials: "include",
            body: JSON.stringify(this.state),
            headers:{
                "Content-Type": "application/json"
            }
        })
            .then(async res => {
                const response = await res.json()
                if(response.message === "Incorrect username or password."){
                    this.setState({
                        loginErrorMessage: response.message
                    })
                }
                else if(response.firstName){
                    this.setState({
                        firstName: response.firstName,
                        lastName: response.lastName,
                        username: response.username,
                        email: response.email,
                        profileIconUrl: response.profileIconUrl,
                        isLoggedIn: true,
                        errorMessage: "",
                        password: "",
                        loginUsername: "",
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
        favorites: []
    })
    this.props.history.push("/");
    await fetch(`${ROUTES.USER}/logout`)
}

  render(){
    return (
      <div className="App">
        <Nav isLoggedIn={this.state.isLoggedIn} username={this.state.username} userId={this.state.userId} logout={this.handleLogout}/>
        <Switch>
            <Route exact path={ROUTES.HOME} render={() => <PlayerSearch isLoggedIn={this.state.isLoggedIn}/>} username={this.state.username} userId={this.state.userId}/>
            <Route exact path={ROUTES.SEARCH} render={() => <PlayerSearch isLoggedIn={this.state.isLoggedIn}/>} username={this.state.username} userId={this.state.userId}/>
            <Route exact path={`${ROUTES.SEARCH}/:summoner`} render={() => <ShowPlayer isLoggedIn={this.state.isLoggedIn} username={this.state.username} userId={this.state.userId} favorites={this.state.favorites} handleFavoritesUpdate={this.handleFavoritesUpdate}/>}/>
            <Route exact path={ROUTES.USER} render={() => <Login onChange={this.onChange} handleLoginReset={this.handleLoginReset} handleLogin={this.handleLogin} handleRegister={this.handleRegister} state={this.state}/>}/>
            <Route exact path={`${ROUTES.USER}/:userId`} render={() => <User favorites={this.state.favorites} isLoggedIn={this.state.isLoggedIn} username={this.state.username} userId={this.state.userId} profileIconUrl={this.state.profileIconUrl}/>}/>
            <Route exact path={`${ROUTES.USER}/:userId/edit`} render={() => <EditUser onChange={this.onChange} state={this.state} handleUserEdit={this.handleUserEdit} handleUserDelete={this.handleUserDelete}/>}/>
            <Route render={() => <Page404 />}/>
        </Switch>
        <Footer />
      </div>
    )
  }
}

export default withRouter(App);
