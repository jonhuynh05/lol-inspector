import React, { Component } from 'react'
import {withRouter} from "react-router-dom"
import "./edituser.css"
import * as ROUTES from "../constants/routes"

class EditUser extends Component {
    state = {
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        errorMessage: ""
    }

    async componentDidMount () {
        this.setState({
            firstName: this.props.state.firstName,
            lastName: this.props.state.lastName,
            username: this.props.state.username,
            email: this.props.state.email,
        })
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleEdit = async (e) => {
        e.preventDefault()
        console.log("hit 1")
        const editUser = await fetch (`${ROUTES.USER}/${this.props.state.userId}/edit`, {
            method: "PUT",
            credentials: "include",
            body: JSON.stringify({
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                username: this.state.username,
                email: this.state.email,
                password: this.state.password,
            }),
            headers:{
                "Content-Type": "application/json"
            }
        })
        console.log("hit 2")
    }

    render(){
        return(
            <div className="edit-container">
                <h3>Edit Your Profile</h3>
                <form onSubmit={this.handleEdit}>
                    <input pattern="\S+" type="text" placeholder="First Name" name="firstName" onChange={this.onChange} value={this.state.firstName}></input><br/>
                    <input pattern="\S+" type="text" placeholder="Last Name" name="lastName" onChange={this.onChange} value={this.state.lastName}></input><br/>
                    <input pattern="\S+" type="text" placeholder="Username" name="username" onChange={this.onChange} value={this.state.username}></input><br/>
                    <input type="text" placeholder="Email" name="email" onChange={this.onChange} value={this.state.email}></input><br/>
                    <input type="text" placeholder="Password" name="password" onChange={this.onChange} value={this.state.password}></input><br/>
                    <div className="error-message">{this.state.errorMessage}</div>
                    <button type="submit">Submit</button><br/>
                </form>
            </div>
        )
    }
}

export default withRouter(EditUser)