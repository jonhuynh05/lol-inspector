import React, { Component } from 'react'
import {withRouter} from "react-router-dom"
import "./showplayer.css"

class ShowPlayer extends Component {
    state = {
        name: "",
        level: "",
        id: "",
        recentMatches: [],
        recentMatchStats: [],
        championsUsed: []
    }
    async componentDidMount(){
        const summonerName = this.props.match.params.summoner
        this.setState({
            name: this.props.match.params.summoner
        })
        const summoner = await (await fetch (`/api/v1/search/${summonerName}/matches`)).json()
        console.log(summoner, "FROM BACKEND")
        const champList = (await (await fetch("http://ddragon.leagueoflegends.com/cdn/9.23.1/data/en_US/champion.json")).json()).data
        console.log(champList, "CHAMP LIST")
        const champListNames = Object.keys(champList)
        const champsUsed = []
        for(let i = 0; i < summoner.stats.length; i++){
            for(let j = 0; j < champListNames.length; j++){
                if(summoner.stats[i].championId === Number(champList[champListNames[j]].key)){
                    champsUsed.push(champListNames[j])
                }
            }
        }
        console.log(champsUsed, "CHAMPS USED")
        this.setState({
            level: summoner.summoner.summonerLevel,
            id: summoner.summoner.id,
            recentMatches: summoner.matches,
            recentMatchStats: summoner.stats,
            championsUsed: champsUsed
        })
    }
    render(){
        const lastFiveMatches = this.state.recentMatchStats.map((stat, i) => {
            return(
                <div className="match-stats" key={i}>
                    <img id="match-history-champs" src={`http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${this.state.championsUsed[i]}_0.jpg`}/><br/>
                    {this.state.championsUsed[i]}<br/>
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