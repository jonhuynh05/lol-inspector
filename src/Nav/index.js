import React, { Component } from 'react'
import {Link} from "react-router-dom"
import "./nav.css"
import * as ROUTES from "../constants/routes"

class Nav extends Component{
    render(){
        return(
            <div className="nav-container">
                <div className="nav-row">
                    <div className="nav-col" id="logo-col">
                        <Link className="nav-anchor" id="home-anchor" to={ROUTES.HOME}>
                            LoL Inspector
                        </Link>
                    </div>
                    {
                        this.props.isLoggedIn
                        ?
                        <>
                        <div className="nav-col" id="profile-col">
                            <Link className="nav-anchor"  to={`${ROUTES.USER}/${this.props.userId}/edit`}>
                                Profile
                            </Link>
                        </div>
                        <div className="nav-col" id="profile-col">
                            <Link className="nav-anchor"  to={`${ROUTES.USER}/${this.props.userId}`}>
                                Favorites
                            </Link>
                        </div>
                        <div className="nav-col" id="logout-col">
                            <div className="nav-anchor" onClick={this.props.logout}>
                                Logout
                            </div>
                        </div>
                        </>
                        :
                        <div className="nav-col" id="login-col">
                            <Link className="nav-anchor"  to={ROUTES.USER}>
                                Login
                            </Link>
                        </div>
                    }
                </div>
            </div>
        )
    }
}

export default Nav