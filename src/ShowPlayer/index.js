import React, { Component } from 'react'
import {withRouter} from "react-router-dom"

class ShowPlayer extends Component {
    state = {
        name: "",
        level: "",
        id: "",
        matches: []
    }
    async componentDidMount(){
        const summonerName = this.props.match.params.summoner
        this.setState({
            name: this.props.match.params.summoner
        })
        const summoner = await (await fetch (`/api/v1/search/${summonerName}`)).json()
        console.log(summoner)
        this.setState({
            level: summoner.summonerLevel,
            id: summoner.id
        })
        const matches = await (await fetch (`/api/v1/search/${summonerName}/matches`)).json()
        console.log(matches)
        this.setState({
            matches: matches.matches
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