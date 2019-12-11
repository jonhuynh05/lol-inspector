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
        champList: [],
        deleteModal: false
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
            errorMessage: "",
            deleteModal: false
        })
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleEdit = async (e) => {
        e.preventDefault()
        await fetch (`${ROUTES.USER}/${this.props.state.userId}/edit`, {
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

    openDeleteModal = () => {
        this.setState({
            deleteModal: true
        })
    }

    closeDeleteModal = () => {
        this.setState({
            deleteModal: false
        })
    }

    handleDelete = async (e) => {
        await fetch (`${ROUTES.USER}/${this.props.state.userId}/delete`, {
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
                this.setState({
                    deleteModal: false
                })
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
                <img id="edit-profile-icon" src={this.state.profileIconUrl} alt="Champion Icon"/>
                <form onSubmit={this.handleEdit}>
                    <input className="edit-input" pattern="\S+" title="No spaces." type="text" placeholder="First Name" name="firstName" onChange={this.onChange} value={this.state.firstName} required></input><br/>
                    <input className="edit-input"  pattern="\S+" title="No spaces." type="text" placeholder="Last Name" name="lastName" onChange={this.onChange} value={this.state.lastName} required></input><br/>
                    <input className="edit-input"  pattern="\S+" title="No spaces." type="text" placeholder="Username" name="username" onChange={this.onChange} value={this.state.username} required></input><br/>
                    <input className="edit-input" pattern="\S+" title="No spaces."  type="text" placeholder="Email" name="email" onChange={this.onChange} value={this.state.email} required></input><br/>
                    <input className="edit-input" pattern="\S+" title="No spaces."  type="password" placeholder="Confirm Password" name="password" onChange={this.onChange} value={this.state.password} required></input><br/>
                    <input className="edit-input" pattern="\S+" title="No spaces."  type="password" placeholder="New Password" name="newPassword" onChange={this.onChange} value={this.state.newPassword}></input><br/>
                    <div id="main-question">Who's your main?</div>
                    <select id="main-selection" name="profileIconUrl" onChange={this.onChange}>
                        {champs}
                    </select>
                    <div className="error-message">{this.state.errorMessage}</div>
                    <button className="submit-button" type="submit">Submit</button><br/>
                </form>
                <button className="delete-button" id="delete-button-edit" onClick={this.openDeleteModal}>Delete Account</button>
                {
                    this.state.deleteModal
                    ?
                    <div className="modal">
                        <div className="modal-content">
                            <div className="confirm-delete">
                                Are you sure?
                            </div>
                            <button className="delete-button" id="delete-button-modal" onClick={this.handleDelete}>Delete</button>
                            <button className="cancel-button" id="cancel-button-modal" onClick={this.closeDeleteModal}>Cancel</button>
                        </div>
                    </div>
                    :
                    null
                }
            </div>
        )
    }
}

export default withRouter(EditUser)