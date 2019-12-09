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
        isLoggedIn: false
    }
    async componentDidMount () {
        this.setState({
            errorMessage: ""
        })
        const foundUser = await(await fetch (`/user`)).json()
        console.log(foundUser)
    }
    
    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onSubmit = async (e) => {
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
                            errorMessage: ""
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
                <h3>Register</h3>
                <form onSubmit={this.onSubmit}>
                    <input pattern="\S+" type="text" placeholder="First Name" name="firstName" onChange={this.onChange} value={this.state.firstName}></input><br/>
                    <input pattern="\S+" type="text" placeholder="Last Name" name="lastName" onChange={this.onChange} value={this.state.lastName}></input><br/>
                    <input pattern="\S+" type="text" placeholder="Username" name="username" onChange={this.onChange} value={this.state.username}></input><br/>
                    <input type="text" placeholder="Email" name="email" onChange={this.onChange} value={this.state.email}></input><br/>
                    <input type="text" placeholder="Password" name="password" onChange={this.onChange} value={this.state.password}></input><br/>
                    <div id="login-error-message">{this.state.errorMessage}</div>
                    <button type="submit">Submit</button><br/>
                </form>
            </div>
        )
    }
}

export default withRouter(Login)