import React, { Component } from 'react'
import { withRouter, Link} from 'react-router-dom'

class User extends Component {
    render(){

        const favorites = this.props.favorites.map((favorite, i) => {
            return (
                <div className="favorite-col" key={i}>
                    <Link to={favorite.summonerUrl}>{favorite.summonerName}</Link>
                </div>
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