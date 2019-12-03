import React, { Component } from 'react'
import {withRouter} from "react-router-dom"

class ShowPlayer extends Component {
    state = {
        name: ""
    }
    async componentDidMount(){
        const summonerName = this.props.match.params.summoner
        console.log(summonerName)
    }
    render(){
        return(
            <div>
                this is player page
            </div>
        )
    }
}

export default withRouter(ShowPlayer)