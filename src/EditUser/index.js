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
        profileIconUrl: "",
        newPassword:"",
        errorMessage: "",
        champList: []
    }

    async componentDidMount () {
        const champList = (await (await fetch("http://ddragon.leagueoflegends.com/cdn/9.23.1/data/en_US/champion.json")).json()).data
        const champListNames = Object.keys(champList)
        this.setState({
            champList: champListNames
        })
        this.setState({
            firstName: this.props.state.firstName,
            lastName: this.props.state.lastName,
            username: this.props.state.username,
            email: this.props.state.email,
            profileIconUrl: this.props.state.profileIconUrl,
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
                profileIconUrl: this.state.profileIconUrl,
                newPassword: this.state.newPassword,
            }),
            headers:{
                "Content-Type": "application/json"
            }
        })
            .then(async res => {
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
                profileIconUrl: this.state.profileIconUrl,
                newPassword: this.state.newPassword,
            }),
            headers:{
                "Content-Type": "application/json"
            }
        })
            .then(async(res) => {
                this.props.handleUserDelete()
                this.props.history.push("/");
            })

    }

    render(){
        const champs = this.state.champList.map((champ, i) => {
            if(this.state.profileIconUrl === `http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champ}_0.jpg`){
                return(
                    <option key={i} value={`http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champ}_0.jpg`} selected>{champ}</option>
                )
            }
            else{
                return(
                    <option key={i} value={`http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champ}_0.jpg`}>{champ}</option>
                )
            }
        })
        return(
            <div className="edit-container">
                <div className="edit-header">Edit Your Profile</div>
                <form onSubmit={this.handleEdit}>
                    <input className="edit-input" pattern="\S+" type="text" placeholder="First Name" name="firstName" onChange={this.onChange} value={this.state.firstName}></input><br/>
                    <input className="edit-input"  pattern="\S+" type="text" placeholder="Last Name" name="lastName" onChange={this.onChange} value={this.state.lastName}></input><br/>
                    <input className="edit-input"  pattern="\S+" type="text" placeholder="Username" name="username" onChange={this.onChange} value={this.state.username}></input><br/>
                    <input className="edit-input"  type="text" placeholder="Email" name="email" onChange={this.onChange} value={this.state.email}></input><br/>
                    <input className="edit-input"  type="text" placeholder="Confirm Password" name="password" onChange={this.onChange} value={this.state.password} required></input><br/>
                    <input className="edit-input"  type="text" placeholder="New Password" name="newPassword" onChange={this.onChange} value={this.state.newPassword}></input><br/>
                    <div id="main-question">Who's your main?</div>
                    <select id="main-selection" name="profileIconUrl" onChange={this.onChange}>
                        {champs}
                    </select>
                    <div className="error-message">{this.state.errorMessage}</div>
                    <button className="submit-button" type="submit">Submit</button><br/>
                </form>
                <button className="delete-button" onClick={this.handleDelete}>Delete</button>
            </div>
        )
    }
}

export default withRouter(EditUser)