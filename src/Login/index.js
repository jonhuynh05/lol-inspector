import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import "./login.css"


class Login extends Component {
    state = {
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

    }
    async componentDidMount () {
        this.setState({
            errorMessage: "",
            loginErrorMessage: ""
        })
        const foundUser = await(await fetch (`/user`)).json()
        console.log(foundUser)
    }
    
    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleRegister = async (e) => {
        e.preventDefault()
        try{
            const registerResponse = await fetch(`/user/register`, {
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
                            loginPassword: ""
                        })
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
            const login = await fetch(`/user/login`, {
                method: "POST",
                credentials: "include",
                body: JSON.stringify(this.state),
                headers:{
                    "Content-Type": "application/json"
                }
            })
                .then(async res => {
                    const response = await res.json()
                    console.log(response)
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
                            isLoggedIn: true,
                            errorMessage: "",
                            password: "",
                            loginErrorMessage: "",
                            loginPassword: ""
                        })
                    }
                })
            }
        catch (err) {
                console.log(err)
            }
    }

    render(){
        return(
            <div className="container">
                <div id="register-container">
                    <h3>Register</h3>
                    <form onSubmit={this.handleRegister}>
                        <input pattern="\S+" type="text" placeholder="First Name" name="firstName" onChange={this.onChange} value={this.state.firstName}></input><br/>
                        <input pattern="\S+" type="text" placeholder="Last Name" name="lastName" onChange={this.onChange} value={this.state.lastName}></input><br/>
                        <input pattern="\S+" type="text" placeholder="Username" name="username" onChange={this.onChange} value={this.state.username}></input><br/>
                        <input type="text" placeholder="Email" name="email" onChange={this.onChange} value={this.state.email}></input><br/>
                        <input type="text" placeholder="Password" name="password" onChange={this.onChange} value={this.state.password}></input><br/>
                        <div className="error-message">{this.state.errorMessage}</div>
                        <button type="submit">Submit</button><br/>
                    </form>
                </div>
                <div id="login-container">
                    <h3>Login</h3>
                    <form onSubmit={this.handleLogin}>
                        <input pattern="\S+" type="text" placeholder="Username" name="loginUsername" onChange={this.onChange} value={this.state.loginUsername}></input><br/>
                        <input type="text" placeholder="Password" name="loginPassword" onChange={this.onChange} value={this.state.loginPassword}></input><br/>
                        <div className="error-message">{this.state.loginErrorMessage}</div>
                        <button type="submit">Submit</button><br/>
                    </form>
                </div>
            </div>
        )
    }
}

export default withRouter(Login)