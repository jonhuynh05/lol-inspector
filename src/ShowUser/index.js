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
                    <img id="fave-profile-icon" src={this.props.profileIconUrl} alt="Champion Icon"/>
                    <div className="favorite-greeting">Hi, {this.props.username}!</div>
                    <div className="favorite-header">Favorites:</div>
                </div>
                <div className="favorite-row">
                    {
                        this.props.favorites.length > 0
                        ?
                        favorites
                        :
                        <div id="add-favorites-message">No favorites! Find and follow summoners to add them to your favorites list.</div>
                    }
                </div>
            </div>
        )
    }
}

export default withRouter(User)