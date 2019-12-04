import React, { Component } from 'react'
import {withRouter} from "react-router-dom"

class ShowPlayer extends Component {
    state = {
        name: "",
        level: "",
        id: "",
        recentMatches: [],
        recentMatchStats: []
    }
    async componentDidMount(){
        const summonerName = this.props.match.params.summoner
        this.setState({
            name: this.props.match.params.summoner
        })
        const summoner = await (await fetch (`/api/v1/search/${summonerName}/matches`)).json()
        console.log(summoner)
        this.setState({
            level: summoner.summoner.summonerLevel,
            id: summoner.summoner.id,
            recentMatches: summoner.matches,
            recentMatchStats: summoner.stats
        })
    }
    render(){
        const lastFiveMatches = this.state.recentMatchStats.map((stat, i) => {
            return(
                <div className="match-stats" key={i}>
                    Champion: {stat.championId}<br/>
                    Kills: {stat.stats.kills}<br/>
                    Deaths: {stat.stats.deaths}<br/>
                    Assists: {stat.stats.assists}<br/>
                    Gold: {stat.stats.goldEarned}<br/>
                </div>
            )
        })
        return(
            <div>
                {this.state.name}<br/>
                {this.state.level}
                <h3>Last 5 Matches</h3>
                {lastFiveMatches}
            </div>
        )
    }
}

export default withRouter(ShowPlayer)