import React, { Component } from 'react'
import {withRouter} from "react-router-dom"
import {MoonLoader} from "react-spinners"
import "./showplayer.css"
import { thisExpression } from '@babel/types'

class ShowPlayer extends Component {
    state = {
        name: "",
        level: "",
        id: "",
        isLoading: false,
        noMatchesMessage: "",
        recentMatches: [],
        summonerMatchStats: [],
        championsUsed: [],
        opponents: [],
        opposingChampionsUsed: [],
        noOpponentError: "No opponent found.",
        matchups: [],
        followed: false
    }
    async componentDidMount(){
        this.setState({
            name: this.props.match.params.summoner,
            isLoading: true
        })
        const summonerName = this.props.match.params.summoner
        const summoner = await (await fetch (`/api/v1/search/${summonerName}/matches`)).json()
        console.log(summoner, "FROM BACKEND")
        console.log(summonerName)
        for (let i = 0; i < this.props.favorites.length; i++){
            if(this.props.favorites[i].summonerName === summonerName){
                this.setState({
                    followed: true
                })
            }
        }
        if(summoner.summoner.noMatches){
            this.setState({
                noMatchesMessage: "This summoner does not have any recent matches. Please try a different summoner.",
                isLoading: false
            })
        }
        else{
            const champList = (await (await fetch("http://ddragon.leagueoflegends.com/cdn/9.23.1/data/en_US/champion.json")).json()).data
            const champListNames = Object.keys(champList)

            const summonerChamps = []
            summoner.matchups.forEach((matchup) => {
                summonerChamps.push(matchup.user)
            })
            const summonerChampsUsed = []
            for(let i = 0; i < summoner.stats.length; i++){
                for(let j = 0; j < champListNames.length; j++){
                    if(summoner.stats[i].championId === Number(champList[champListNames[j]].key)){
                        summonerChampsUsed.push(champListNames[j])
                    }
                }
            }
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
            const opponentChampsUsed = []
            for(let i = 0; i < opponents.length; i++){
                if(opponents[i].message){
                    opponentChampsUsed.push("None")
                }
                for(let j = 0; j < champListNames.length; j++){
                    if (opponents[i].championId === Number(champList[champListNames[j]].key)){
                        opponentChampsUsed.push(champListNames[j])
                    }
                }
            }
            this.setState({
                isLoading: false,
                level: summoner.summoner.summonerLevel,
                id: summoner.summoner.id,
                noMatchesMessage: "",   
                recentMatches: summoner.matches,
                summonerMatchStats: summonerChamps,
                championsUsed: summonerChampsUsed,
                opponents: opponents,
                opposingChampionsUsed: opponentChampsUsed,
                matchups: summoner.matchups
            })
        }
    }

    handleFollow = async () => {
        const follow = await fetch(`/search/${this.state.name}/follow`, {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({
                summonerName: this.state.name,
                summonerUrl: `/search/${this.state.name}`,
            }),
            headers:{
                "Content-Type": "application/json"
            }
        })
        this.props.handleFavoritesUpdate()
        this.setState({
            followed: true
        })
    }

    handleUnfollow = async () => {
        const unfollow = await fetch(`/search/${this.state.name}/unfollow`, {
            method: "PUT",
            credentials: "include",
            body: JSON.stringify({
                summonerName: this.state.name,
                summonerUrl: `/search/${this.state.name}`,
            }),
            headers:{
                "Content-Type": "application/json"
            }
        })
            .then(
                this.props.handleFavoritesUpdate()
            )
            .then(
                this.setState({
                    followed: false
                })
            )
    }

    render(){

        let favoriteButton
        if(this.state.followed === true){
            favoriteButton = <button className = "button" id="unfollow-button" onClick={this.handleUnfollow}>Unfollow</button>
        }
        else{
            favoriteButton = <button className = "button" id="follow-button" onClick={this.handleFollow}>Follow</button>
        }

        const analysis = this.state.matchups.map((matchup, i) => {
            if(matchup.opponents[0].message){
                return(
                <div className="match-stats" key={i}>
                    <div className="row" id={`matchup${i}`}>
                        <div className="col" id={`summoner-col-${i}`}>
                            <div className="col match-category" id="col-category-summoner">
                                <h3>{this.state.name}</h3>
                            </div>
                            <img className="match-history-champs" src={`http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${this.state.championsUsed[i]}_0.jpg`}/><br/>
                            {this.state.championsUsed[i]}<br/>
                            <div>Role: {matchup.user.timeline.role}</div>
                            <div>Lane: {matchup.user.timeline.lane}</div>
                            <div>Kills: {matchup.user.stats.kills}</div>
                            <div>Deaths: {matchup.user.stats.deaths}</div>
                            <div>Assists: {matchup.user.stats.assists}</div>
                            <div>Minions Killed: {matchup.user.stats.totalMinionsKilled}</div>
                            <div>Vision Score: {matchup.user.stats.visionScore}</div>
                            <div>Gold: {matchup.user.stats.goldEarned}</div>
                            {
                                matchup.user.stats.win === true
                                ?
                                <div className="won">Result: Won</div>
                                :
                                <div className="lost">Result: Loss</div>
                            }
                        </div>
                        <div className="col no-opponent" id={`opponent-col-${i}`}>
                            <div className="col match-category" id="col-category-opponent">
                                <h3>Opponents</h3>
                            </div>
                            <div>No Opponents Identified</div>
                        </div>
                        <div className="col no-analysis" id={`analysis${i}`}>
                            <div className="col" id="col-category-analysis">
                                <h3>Analysis</h3>
                            </div>
                            <div>No Analysis</div>
                        </div>
                    </div>
                </div>
                )
            }
            else{
            return(
                <div className="match-stats" key={i}>
                    <div className="row" id={`matchup${i}`}>
                        <div className="col" id={`summoner-col-${i}`}>
                            <div className="col match-category" id="col-category-summoner">
                                <h3>{this.state.name}</h3>
                            </div>
                            <img className="match-history-champs" src={`http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${this.state.championsUsed[i]}_0.jpg`}/><br/>
                            {this.state.championsUsed[i]}<br/>
                            <div>Role: {matchup.user.timeline.role}</div>
                            <div>Lane: {matchup.user.timeline.lane}</div>
                            {
                                matchup.user.stats.kills === matchup.opponents[0].stats.kills
                                ?
                                <div>Kills: {matchup.user.stats.kills}</div>
                                :
                                matchup.user.stats.kills > matchup.opponents[0].stats.kills
                                ?
                                <div className="won">Kills: {matchup.user.stats.kills}</div>
                                :
                                <div className="lost">Kills: {matchup.user.stats.kills}</div>
                            }
                            {
                                matchup.user.stats.deaths === matchup.opponents[0].stats.deaths
                                ?
                                <div>Deaths: {matchup.user.stats.deaths}</div>
                                :
                                matchup.user.stats.deaths < matchup.opponents[0].stats.deaths
                                ?
                                <div className="won">Deaths: {matchup.user.stats.deaths}</div>
                                :
                                <div className="lost">Deaths: {matchup.user.stats.deaths}</div>
                            }
                            {
                                matchup.user.stats.assists === matchup.opponents[0].stats.assists
                                ?
                                <div>Assists: {matchup.user.stats.assists}</div>
                                :
                                matchup.user.stats.assists > matchup.opponents[0].stats.assists
                                ?
                                <div className="won">Assists: {matchup.user.stats.assists}</div>
                                :
                                <div className="lost">Assists: {matchup.user.stats.assists}</div>
                            }
                            {
                                matchup.user.stats.totalMinionsKilled === matchup.opponents[0].stats.totalMinionsKilled
                                ?
                                <div>Minions Killed: {matchup.user.stats.totalMinionsKilled}</div>
                                :
                                matchup.user.stats.totalMinionsKilled > matchup.opponents[0].stats.totalMinionsKilled
                                ?
                                <div className="won">Minions Killed: {matchup.user.stats.totalMinionsKilled}</div>
                                :
                                <div className="lost">Minions Killed: {matchup.user.stats.totalMinionsKilled}</div>
                            }
                            {
                                matchup.user.stats.visionScore === matchup.opponents[0].stats.visionScore
                                ?
                                <div>Vision Score: {matchup.user.stats.visionScore}</div>
                                :
                                matchup.user.stats.visionScore > matchup.opponents[0].stats.visionScore
                                ?
                                <div className="won">Vision Score: {matchup.user.stats.visionScore}</div>

                                :
                                <div className="lost">Vision Score: {matchup.user.stats.visionScore}</div>

                            }
                            {
                                matchup.user.stats.goldEarned === matchup.opponents[0].stats.goldEarned
                                ?
                                <div>Gold: {matchup.user.stats.goldEarned}</div>
                                :
                                matchup.user.stats.goldEarned > matchup.opponents[0].stats.goldEarned
                                ?
                                <div className="won">Gold: {matchup.user.stats.goldEarned}</div>
                                :
                                <div className="lost">Gold: {matchup.user.stats.goldEarned}</div>
                            }
                            {
                                matchup.user.stats.win === true
                                ?
                                <div className="won">Result: Won</div>
                                :
                                <div className="lost">Result: Loss</div>
                            }
                        </div>
                        <div className="col" id={`opponent-col-${i}`}>
                            <div className="col match-category" id="col-category-opponent">
                                <h3>Opponent</h3>
                            </div>
                            <img className="match-history-champs" src={`http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${this.state.opposingChampionsUsed[i]}_0.jpg`}/><br/>
                            {this.state.opposingChampionsUsed[i]}<br/>
                            <div>Role: {matchup.opponents[0].timeline.role}</div>
                            <div>Lane: {matchup.opponents[0].timeline.lane}</div>
                            {
                                matchup.user.stats.kills === matchup.opponents[0].stats.kills
                                ?
                                <div>Kills: {matchup.opponents[0].stats.kills}</div>
                                :
                                matchup.user.stats.kills < matchup.opponents[0].stats.kills
                                ?
                                <div className="won">Kills: {matchup.opponents[0].stats.kills}</div>
                                :
                                <div className="lost">Kills: {matchup.opponents[0].stats.kills}</div>
                            }
                            {
                                matchup.user.stats.deaths === matchup.opponents[0].stats.deaths
                                ?
                                <div>Deaths: {matchup.opponents[0].stats.deaths}</div>
                                :
                                matchup.user.stats.deaths > matchup.opponents[0].stats.deaths
                                ?
                                <div className="won">Deaths: {matchup.opponents[0].stats.deaths}</div>
                                :
                                <div className="lost">Deaths: {matchup.opponents[0].stats.deaths}</div>
                            }
                            {
                                matchup.user.stats.assists === matchup.opponents[0].stats.assists
                                ?
                                <div>Assists: {matchup.opponents[0].stats.assists}</div>
                                :
                                matchup.user.stats.assists < matchup.opponents[0].stats.assists
                                ?
                                <div className="won">Assists: {matchup.opponents[0].stats.assists}</div>
                                :
                                <div className="lost">Assists: {matchup.opponents[0].stats.assists}</div>
                            }
                            {
                                matchup.user.stats.totalMinionsKilled === matchup.opponents[0].stats.totalMinionsKilled
                                ?
                                <div>Minions Killed: {matchup.opponents[0].stats.totalMinionsKilled}</div>
                                :
                                matchup.user.stats.totalMinionsKilled < matchup.opponents[0].stats.totalMinionsKilled
                                ?
                                <div className="won">Minions Killed: {matchup.opponents[0].stats.totalMinionsKilled}</div>
                                :
                                <div className="lost">Minions Killed: {matchup.opponents[0].stats.totalMinionsKilled}</div>
                            }
                            {
                                matchup.user.stats.visionScore === matchup.opponents[0].stats.visionScore
                                ?
                                <div>Vision Score: {matchup.opponents[0].stats.visionScore}</div>
                                :
                                matchup.user.stats.visionScore < matchup.opponents[0].stats.visionScore
                                ?
                                <div className="won">Vision Score: {matchup.opponents[0].stats.visionScore}</div>

                                :
                                <div className="lost">Vision Score: {matchup.opponents[0].stats.visionScore}</div>

                            }
                            {
                                matchup.user.stats.goldEarned === matchup.opponents[0].stats.goldEarned
                                ?
                                <div>Gold: {matchup.opponents[0].stats.goldEarned}</div>
                                :
                                matchup.user.stats.goldEarned < matchup.opponents[0].stats.goldEarned
                                ?
                                <div className="won">Gold: {matchup.opponents[0].stats.goldEarned}</div>
                                :
                                <div className="lost">Gold: {matchup.opponents[0].stats.goldEarned}</div>
                            }
                            {
                                matchup.opponents[0].stats.win === true
                                ?
                                <div className="won">Result: Won</div>
                                :
                                <div className="lost">Result: Loss</div>
                            }
                        </div>
                        <div className="col" id={`analysis${i}`}>
                            <div className="col" id="col-category-analysis">
                                <h3>Analysis</h3>
                            </div>
                            <div className="advice" id="kills-analysis">
                            {
                                matchup.user.stats.kills === matchup.opponents[0].stats.kills
                                ?
                                <div className="advice-note" id="kills-comparison">
                                    <strong>Kills:</strong>{this.state.name} and the opponent had the same number of kills. Nice work -- {this.state.name} kept up in gold advantage on this end.
                                </div>
                                :
                                matchup.user.stats.kills > matchup.opponents[0].stats.kills
                                ?
                                <div className="advice-note" id="kills-comparison">
                                    <strong>Kills:</strong> {this.state.name} slayed more champions than the lane opponent. Keep it up to retain a gold/item advantage over the opponent.
                                </div>
                                :
                                <div className="advice-note" id="kills-comparison">
                                    <strong>Kills:</strong> {this.state.name}'s opponent gained the upperhand by gaining more kills. Keep an eye out for champions with low health for easy pickings.
                                </div>
                            }
                            </div>
                            <div className="advice" id="deaths-analysis">
                            {
                                matchup.user.stats.deaths === matchup.opponents[0].stats.deaths
                                ?
                                <div className="advice-note" id="deaths-comparison">
                                    <strong>Deaths:</strong> {this.state.name} and {this.state.name}'s opponent died the same number of times. No gold advantage or disadvantage given to the enemy team for this stat. 
                                </div>
                                :
                                matchup.user.stats.deaths < matchup.opponents[0].stats.deaths
                                ?
                                <div className="advice-note" id="deaths-comparison">
                                    <strong>Deaths:</strong> The opponent died more often than {this.state.name}. They gave {this.state.name}'s team an advantage in gold.
                                </div>
                                :
                                <div className="advice-note" id="deaths-comparison">
                                    <strong>Deaths:</strong> {this.state.name} died more often than their lane opponent. Keep an eye on the minimap to avoid getting outflanked, base when necessary, and listen to ally pings to avoid giving the enemy a gold advantage.
                                </div>
                            }
                            </div>
                            <div className="advice" id="assist-analysis">
                            {
                                matchup.user.stats.assists === matchup.opponents[0].stats.assists
                                ?
                                <div className="advice-note" id="assists-comparison">
                                    <strong>Assists:</strong> {this.state.name} and {this.state.name}'s opponent helped their respective teams equally. They did a great job keeping up with their lane opponent. 
                                </div>
                                :
                                matchup.user.stats.assists > matchup.opponents[0].stats.assists
                                ?
                                <div className="advice-note" id="assists-comparison">
                                    <strong>Assists:</strong> {this.state.name} contributed to their team more than {this.state.name}'s lane opponent did for theirs. Keep participating in team fights and lane ganks when you can to secure team kills.
                                </div>
                                :
                                <div className="advice-note" id="assists-comparison">
                                    <strong>Assists:</strong> {this.state.name}'s opponent took part in more team fights than {this.state.name} did. Look at the map often to find opportunities to jump into team fights or gank a lane. More team kills means more gold and a higher chance to win!
                                </div>
                            }
                            </div>
                            <div className="advice" id="cs-analysis">
                            {
                                matchup.user.stats.totalMinionsKilled === matchup.opponents[0].stats.totalMinionsKilled
                                ?
                                <div className="advice-note" id="cs-comparison">
                                    <strong>CS:</strong> {this.state.name} and {this.state.name}'s opponent killed the same amount of minions. They did a great job keeping up with their lane opponent. 
                                </div>
                                :
                                matchup.user.stats.totalMinionsKilled > matchup.opponents[0].stats.totalMinionsKilled
                                ?
                                <div className="advice-note" id="cs-comparison">
                                    <strong>CS:</strong> {this.state.name}'s cs is on point. {this.state.name} beat their opponent in minion kills, gaining a game advantage with more gold to spend on items.
                                </div>
                                :
                                <div className="advice-note" id="cs-comparison">
                                    <strong>CS:</strong> {this.state.name}'s opponent out-cs'd {this.state.name}. Try to poke the opponent if they are going in to last hit a minion, making them pay for the gold gained. Focus on wave control, so you know when to base without missing out on too many minions.
                                </div>
                            }
                            </div>
                            <div className="advice" id="vision-analysis">
                            {
                                matchup.user.stats.visionScore === matchup.opponents[0].stats.visionScore
                                ?
                                <div className="advice-note" id="vision-comparison">
                                    <strong>Vision:</strong> Equal vision score. {this.state.name} and {this.state.name}'s opponent kept the map lit up equally.
                                </div>
                                :
                                matchup.user.stats.visionScore > matchup.opponents[0].stats.visionScore
                                ?
                                <div className="advice-note" id="vision-comparison">
                                    <strong>Vision:</strong> {this.state.name}'s warding skills this match were strong. {this.state.name} beat the opponent in keeping vision on the map for {this.state.name}'s team. Keep it up to maintain an advantage.
                                </div>
                                :
                                <div className="advice-note" id="vision-comparison">
                                    <strong>Vision:</strong> {this.state.name}'s opponent beat {this.state.name} in keeping the fog of war away. Consider buying more pinks, placing more wards, and destroying more enemy wards to ensure your team has sight of the enemy at all times.
                                </div>
                            }
                            </div>
                            <div className="advice" id="gold-analysis">
                            {
                                matchup.user.stats.goldEarned === matchup.opponents[0].stats.goldEarned
                                ?
                                <div className="advice-note" id="gold-comparison">
                                    <strong>Gold:</strong> {this.state.name} and {this.state.name}'s opponent matched each other in gold. No advantage or disadvantage to their respective teams. 
                                </div>
                                :
                                matchup.user.stats.goldEarned > matchup.opponents[0].stats.goldEarned
                                ?
                                <div className="advice-note" id="gold-comparison">
                                    <strong>Gold:</strong> {this.state.name} outearned their opponent in gold. Nice work. Keep doing this to ensure an item advantage, giving you the edge in skirmishes and lanes.
                                </div>
                                :
                                <div className="advice-note" id="gold-comparison">
                                    <strong>Gold:</strong> {this.state.name}'s opponent earned more gold than {this.state.name}, giving themselves and their team an advantage. Try to look for more opportunities to secure kills, participate in team fights, and cs more efficiently to gain the advantage.
                                </div>
                            }
                            </div>
                        </div>
                    </div>
                </div>
            )}
        })
        

        return(
            <div id="show-player-container">
                <div className="row">
                    <div className="col" id="matches-header-col">
                        <h2 id="matches-player-name">{this.state.name}</h2>
                        {
                            this.state.noMatchesMessage !== ""
                            ?
                            null
                            :
                            <h4>Level {this.state.level}</h4>
                        }
                        {
                            this.props.isLoggedIn
                            ?
                            favoriteButton
                            :
                            null
                        }
                    </div>
                </div>
                <div className="row">
                    <h3>Recent Matches</h3>
                </div>
                <div id="spinner-row">
                    <div id="spinner-col">
                        <MoonLoader 
                            sizeUnit={"px"}
                            size={40}
                            color={'#123abc'}
                            loading={this.state.isLoading}/>
                    </div>
                </div>
                {
                    this.state.noMatchesMessage !== ""
                    ?
                    <div id="no-matches-message">
                        {this.state.noMatchesMessage}
                    </div>
                    :
                    <div>
                        {analysis}
                    </div>
                }
            </div>
        )
    }
}

export default withRouter(ShowPlayer)