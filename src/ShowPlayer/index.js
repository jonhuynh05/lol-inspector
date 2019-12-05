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
        championsUsed: [],
        opponents: [],
        opposingChampionsUsed: []
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
        const opponentChampsUsed = []
        for(let i = 0; i < summoner.opponents.length; i++){
            for(let j = 0; j < champListNames.length; j++){
                if(summoner.opponents[i].championId === Number(champList[champListNames[j]].key)){
                    opponentChampsUsed.push(champListNames[j])
                }
            }
        }
        console.log(opponentChampsUsed, "OPPOSING CHAMPS USED")
        this.setState({
            level: summoner.summoner.summonerLevel,
            id: summoner.summoner.id,
            recentMatches: summoner.matches,
            recentMatchStats: summoner.stats,
            championsUsed: champsUsed,
            opponents: summoner.opponents,
            opposingChampionsUsed: opponentChampsUsed
        })
    }
    render(){
        const lastFiveMatches = this.state.recentMatchStats.map((stat, i) => {
            return(
                <div className="match-stats" key={i}>
                    <img className="match-history-champs" src={`http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${this.state.championsUsed[i]}_0.jpg`}/><br/>
                    {this.state.championsUsed[i]}<br/>
                    Role: {stat.timeline.role}<br/>
                    Lane: {stat.timeline.lane}<br/>
                    Kills: {stat.stats.kills}<br/>
                    Deaths: {stat.stats.deaths}<br/>
                    Assists: {stat.stats.assists}<br/>
                    Gold: {stat.stats.goldEarned}<br/>
                    {
                        stat.stats.win === true
                        ?
                        "Result: Won"
                        :
                        "Result: Loss"
                    }
                </div>
            )
        })
        const opponents = this.state.opponents.map((stat, i) => {
            return(
                <div className="match-stats" key={i}>
                    <img className="match-history-champs" src={`http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${this.state.opposingChampionsUsed[i]}_0.jpg`}/><br/>
                    {this.state.opposingChampionsUsed[i]}<br/>
                    Role: {stat.timeline.role}<br/>
                    Lane: {stat.timeline.lane}<br/>
                    Kills: {stat.stats.kills}<br/>
                    Deaths: {stat.stats.deaths}<br/>
                    Assists: {stat.stats.assists}<br/>
                    Gold: {stat.stats.goldEarned}<br/>
                    {
                        stat.stats.win === true
                        ?
                        "Result: Won"
                        :
                        "Result: Loss"
                    }
                </div>
            )
        })
        return(
            <div id="show-player-container">
                <div className="col">
                    {this.state.name}<br/>
                    {this.state.level}
                    <h3>Last 5 Matches</h3>
                    {lastFiveMatches}
                </div>
                <div className="col">
                    <h3>Opponents</h3>
                    {opponents}
                </div>
            </div>
        )
    }
}

export default withRouter(ShowPlayer)