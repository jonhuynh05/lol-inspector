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
            <div className="container">
                <div className="favorite-row">
                    {favorites}
                </div>
            </div>
        )
    }
}

export default withRouter(User)