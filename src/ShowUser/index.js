import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

class User extends Component {
    render(){
        return(
            <div className="container">
                this is user/favorites
            </div>
        )
    }
}

export default withRouter(User)