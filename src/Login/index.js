import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import "./login.css"
import * as ROUTES from "../constants/routes"
import {Redirect} from "react-router-dom"



class Login extends Component {
    async componentDidMount () {
        this.props.handleLoginReset()
    }
    
    render(){
        if(this.props.state.goHome) {
            return <Redirect to={`${ROUTES.HOME}`}/>
        }
        return(
            <div className="container">
                <div id="register-container">
                    <h3>Register</h3>
                    <form onSubmit={this.props.handleRegister}>
                        <input pattern="\S+" type="text" placeholder="First Name" name="firstName" onChange={this.props.onChange} value={this.props.state.firstName}></input><br/>
                        <input pattern="\S+" type="text" placeholder="Last Name" name="lastName" onChange={this.props.onChange} value={this.props.state.lastName}></input><br/>
                        <input pattern="\S+" type="text" placeholder="Username" name="username" onChange={this.props.onChange} value={this.props.state.username}></input><br/>
                        <input type="text" placeholder="Email" name="email" onChange={this.props.onChange} value={this.props.state.email}></input><br/>
                        <input type="text" placeholder="Password" name="password" onChange={this.props.onChange} value={this.props.state.password}></input><br/>
                        <div className="error-message">{this.props.state.errorMessage}</div>
                        <button type="submit">Submit</button><br/>
                    </form>
                </div>
                <div id="login-container">
                    <h3>Login</h3>
                    <form onSubmit={this.props.handleLogin}>
                        <input pattern="\S+" type="text" placeholder="Username" name="loginUsername" onChange={this.props.onChange} value={this.props.state.loginUsername}></input><br/>
                        <input type="text" placeholder="Password" name="loginPassword" onChange={this.props.onChange} value={this.props.state.loginPassword}></input><br/>
                        <div className="error-message">{this.props.state.loginErrorMessage}</div>
                        <button type="submit">Submit</button><br/>
                    </form>
                </div>
            </div>
        )
    }
}

export default withRouter(Login)