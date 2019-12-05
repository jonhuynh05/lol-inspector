import React, { Component } from 'react'
import {withRouter} from "react-router-dom"
import "./showplayer.css"

class ShowPlayer extends Component {
    state = {
        name: "",
        level: "",
        id: "",
        recentMatches: [],
        summonerMatchStats: [],
        championsUsed: [],
        opponents: [],
        opposingChampionsUsed: [],
        matchups: [],
        matchup1: [],
        matchup2: [],
        matchup3: [],
        matchup4: [],
        matchup5: []
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

        const summonerChamps = []
        summoner.matchups.forEach((matchup) => {
            summonerChamps.push(matchup.user)
        })
        console.log(summonerChamps, "summoner stats")
        const summonerChampsUsed = []
        for(let i = 0; i < summoner.stats.length; i++){
            for(let j = 0; j < champListNames.length; j++){
                if(summoner.stats[i].championId === Number(champList[champListNames[j]].key)){
                    summonerChampsUsed.push(champListNames[j])
                }
            }
        }
        console.log(summonerChampsUsed, "CHAMPS USED")


        summoner.matchups.forEach((matchup) => {
            if(matchup.opponents.length > 1){
                for(let i = 0; i < matchup.opponents.length; i++){
                    if(matchup.user.timeline.role === matchup.opponents[i].timeline.role){
                        matchup.opponents.splice(i+1, 1)
                    }
                    else if(matchup.user.timeline.role.includes("SUPPORT") && matchup.opponents[i].timeline.role.includes("SUPPORT")){
                        matchup.opponents.splice(i+1, 1)
                    }
                    else if(matchup.user.timeline.role.includes("CARRY") && matchup.opponents[i].timeline.role.includes("CARRY")){
                        matchup.opponents.splice(i+1, 1)
                    }
                    else if(
                        (matchup.user.timeline.role.includes("SUPPORT") && matchup.opponents[i].timeline.role.includes("CARRY"))
                        ||(matchup.user.timeline.role.includes("CARRY") && matchup.opponents[i].timeline.role.includes("SUPPORT"))
                        )
                        {
                        matchup.opponents.splice(i, 1)
                    }
                    else{
                        matchup.opponents.splice(i+1, 1)
                    }
                }
            }
        })

        const opponents = []
        summoner.matchups.forEach((matchup) => {
            opponents.push(matchup.opponents[0])
        })
        console.log(opponents, "Opponents")

        const opponentChampsUsed = []
        for(let i = 0; i < opponents.length; i++){
            for(let j = 0; j < champListNames.length; j++){
                if(opponents[i].championId === Number(champList[champListNames[j]].key)){
                    opponentChampsUsed.push(champListNames[j])
                }
            }
        }
        console.log(opponentChampsUsed, "OPPOSING CHAMPS USED")

        this.setState({
            level: summoner.summoner.summonerLevel,
            id: summoner.summoner.id,
            recentMatches: summoner.matches,
            summonerMatchStats: summonerChamps,
            championsUsed: summonerChampsUsed,
            opponents: opponents,
            opposingChampionsUsed: opponentChampsUsed,
            matchups: summoner.matchups,
            matchup1: summoner.matchups[0],
            matchup2: summoner.matchups[1],
            matchup3: summoner.matchups[2],
            matchup4: summoner.matchups[3],
            matchup5: summoner.matchups[4],
        })
    }
    render(){
        const summonerStats = this.state.summonerMatchStats.map((stat, i) => {
            return(
                <div className="match-stats" key={i}>
                    <img className="match-history-champs" src={`http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${this.state.championsUsed[i]}_0.jpg`}/><br/>
                    {this.state.championsUsed[i]}<br/>
                    <div>Role: {stat.timeline.role}</div>
                    <div>Lane: {stat.timeline.lane}</div>
                    <div
                    
                    className="kills"

                    >Kills: {stat.stats.kills}</div>
                    
                    
                    
                    
                    
                    
                    
                    <div>Deaths: {stat.stats.deaths}</div>
                    <div>Assists: {stat.stats.assists}</div>
                    <div>Gold: {stat.stats.goldEarned}</div>
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
                    <div>Role: {stat.timeline.role}</div>
                    <div>Lane: {stat.timeline.lane}</div>
                    <div>Kills: {stat.stats.kills}</div>
                    <div>Deaths: {stat.stats.deaths}</div>
                    <div>Assists: {stat.stats.assists}</div>
                    <div>Gold: {stat.stats.goldEarned}</div>
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

        const analysis = "abc"

        return(
            <div id="show-player-container">
                <div className="row"></div>
                    {this.state.name}<br/>
                    {this.state.level}
                    <h3>Last 5 Matches</h3>
                <div className="row" id="matches-row">
                    <div className="col" id="matches-summoner-col">
                        <h3>Your Performance</h3>
                        {summonerStats}
                    </div>
                    <div className="col" id="matches-opponents-col">
                        <h3>Opponents</h3>
                        {opponents}
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(ShowPlayer)