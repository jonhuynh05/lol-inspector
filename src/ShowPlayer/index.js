import React, { Component } from 'react'
import {withRouter} from "react-router-dom"

class ShowPlayer extends Component {
    state = {
        name: "",
        level: ""
    }
    async componentDidMount(){
        const summonerName = this.props.match.params.summoner
        this.setState({
            name: this.props.match.params.summoner
        })
        const summoner = await (await fetch (`/api/v1/search/${summonerName}`)).json()
        console.log(summoner)
        this.setState({
            level: summoner.summonerLevel
        })
    }
    render(){
        return(
            <div>
                {this.state.name}<br/>
                {this.state.level}
            </div>
        )
    }
}

export default withRouter(ShowPlayer)