import React, { Component } from 'react'
import { withRouter, Link} from 'react-router-dom'
import "./showUser.css"

class User extends Component {
    render(){

        const favorites = this.props.favorites.map((favorite, i) => {
            return (
                <Link key={i} to={favorite.summonerUrl} className="favorite-summoner">{favorite.summonerName}</Link>
            )
        })

        return(
            <div className="favorite-container">
                <div className="favorite-header-row">
                    <img id="fave-profile-icon" src={this.props.profileIconUrl}/>
                    <div className="favorite-greeting">Hi, {this.props.username}!</div>
                    <div className="favorite-header">Favorites:</div>
                </div>
                <div className="favorite-row">
                    {favorites}
                </div>
            </div>
        )
    }
}

export default withRouter(User)