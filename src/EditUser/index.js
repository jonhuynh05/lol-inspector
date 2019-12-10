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
        newPassword:"",
        errorMessage: ""
    }

    async componentDidMount () {
        this.setState({
            firstName: this.props.state.firstName,
            lastName: this.props.state.lastName,
            username: this.props.state.username,
            email: this.props.state.email,
            password: "",
            newPassword:"",
            errorMessage: ""
        })
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleEdit = async (e) => {
        e.preventDefault()
        const editUser = await fetch (`${ROUTES.USER}/${this.props.state.userId}/edit`, {
            method: "PUT",
            credentials: "include",
            body: JSON.stringify({
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                username: this.state.username,
                email: this.state.email,
                password: this.state.password,
                newPassword: this.state.newPassword,
            }),
            headers:{
                "Content-Type": "application/json"
            }
        })
            .then(async res => {
                console.log("this hits")
                const response = await res.json()
                if(response.message === "Incorrect password." || response.message === "Something went wrong. Please try again later." || response.message === "Email already exists." || response.message === "Username already exists."){
                    this.setState({
                        errorMessage: response.message
                    })
                }
                else if(response.message === "Success."){
                    console.log(response)
                    this.setState({
                        errorMessage: "",
                        password: "",
                        newPassword: "",
                    })
                    this.props.handleUserEdit()
                    this.props.history.push("/");
                }
            })
    }

    handleDelete = async (e) => {
        const deleteUser = await fetch (`${ROUTES.USER}/${this.props.state.userId}/delete`, {
            method: "DELETE",
            credentials: "include",
            body: JSON.stringify({
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                username: this.state.username,
                email: this.state.email,
                password: this.state.password,
                newPassword: this.state.newPassword,
            }),
            headers:{
                "Content-Type": "application/json"
            }
        })
            .then(
                console.log("this hits")
            )
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
                    <input type="text" placeholder="Confirm Password" name="password" onChange={this.onChange} value={this.state.password} required></input><br/>
                    <input type="text" placeholder="New Password" name="newPassword" onChange={this.onChange} value={this.state.newPassword}></input><br/>
                    <div className="error-message">{this.state.errorMessage}</div>
                    <button type="submit">Submit</button><br/>
                </form>
                <button onClick={this.handleDelete}>Delete</button>
            </div>
        )
    }
}

export default withRouter(EditUser)