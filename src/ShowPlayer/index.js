import React, { Component } from 'react'
import {withRouter} from "react-router-dom"
import {MoonLoader} from "react-spinners"
import "./showplayer.css"

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
        matchups: [],
        // matchup1: [],
        // matchup2: [],
        // matchup3: [],
        // matchup4: [],
        // matchup5: []
    }
    async componentDidMount(){
        this.setState({
            name: this.props.match.params.summoner,
            isLoading: true
        })
        const summonerName = this.props.match.params.summoner
        const summoner = await (await fetch (`/api/v1/search/${summonerName}/matches`)).json()
        console.log(summoner, "FROM BACKEND")
        if(summoner.summoner.noMatches){
            this.setState({
                noMatchesMessage: "This summoner does not have any recent matches. Please try a different summoner.",
                isLoading: false
            })
        }
        else{
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
                isLoading: false,
                level: summoner.summoner.summonerLevel,
                id: summoner.summoner.id,
                noMatchesMessage: "",
                recentMatches: summoner.matches,
                summonerMatchStats: summonerChamps,
                championsUsed: summonerChampsUsed,
                opponents: opponents,
                opposingChampionsUsed: opponentChampsUsed,
                matchups: summoner.matchups,
                // matchup1: summoner.matchups[0],
                // matchup2: summoner.matchups[1],
                // matchup3: summoner.matchups[2],
                // matchup4: summoner.matchups[3],
                // matchup5: summoner.matchups[4],
            })
        }
    }
    render(){
        const analysis = this.state.matchups.map((matchup, i) => {
            return(
                <div className="match-stats" key={i}>
                    <div className="row" id={`matchup${i}`}>
                        <div className="col" id={`summoner-col-${i}`}>
                            <div className="col match-category" id="col-category-summoner">
                                <h3>Your Performance</h3>
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
                                <h3>Opponents</h3>
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
                                    <strong>Kills:</strong> You and your opponent had the same number of kills. Nice work -- you kept up in gold advantage on this end.
                                </div>
                                :
                                matchup.user.stats.kills > matchup.opponents[0].stats.kills
                                ?
                                <div className="advice-note" id="kills-comparison">
                                    <strong>Kills:</strong> You slayed more champions than your lane opponent. Keep it up to retain a gold/item advantage over your opponent.
                                </div>
                                :
                                <div className="advice-note" id="kills-comparison">
                                    <strong>Kills:</strong> Your opponent gained the upperhand by gaining more kills. Keep an eye out for champions with low health for easy pickings.
                                </div>
                            }
                            </div>
                            <div className="advice" id="deaths-analysis">
                            {
                                matchup.user.stats.deaths === matchup.opponents[0].stats.deaths
                                ?
                                <div className="advice-note" id="deaths-comparison">
                                    <strong>Deaths:</strong> You and your opponent died the same number of times. No gold advantage or disadvantage given to the enemy team for this stat. 
                                </div>
                                :
                                matchup.user.stats.deaths < matchup.opponents[0].stats.deaths
                                ?
                                <div className="advice-note" id="deaths-comparison">
                                    <strong>Deaths:</strong> Your opponent died more often than you. Nice -- they gave your team an advantage in gold compared to you.
                                </div>
                                :
                                <div className="advice-note" id="deaths-comparison">
                                    <strong>Deaths:</strong> You died more often than your opponent. Keep an eye on your minimap to avoid getting outflanked, base when necessary, and listen to ally pings to avoid giving the enemy a gold advantage.
                                </div>
                            }
                            </div>
                            <div className="advice" id="assist-analysis">
                            {
                                matchup.user.stats.assists === matchup.opponents[0].stats.assists
                                ?
                                <div className="advice-note" id="assists-comparison">
                                    <strong>Assists:</strong> You and your opponent helped your respective teams equally. Great job keeping up with your lane opponent. 
                                </div>
                                :
                                matchup.user.stats.assists > matchup.opponents[0].stats.assists
                                ?
                                <div className="advice-note" id="assists-comparison">
                                    <strong>Assists:</strong> You contributed to your team more than your lane opponent. Awesome! Keep participating in team fights and lane ganks when you can to secure team kills.
                                </div>
                                :
                                <div className="advice-note" id="assists-comparison">
                                    <strong>Assists:</strong> Your opponent took part in more team fights than you did. Look at your map often to see when you're able to jump into team fights or gank a lane. More team kills means more gold and a higher chance to win!
                                </div>
                            }
                            </div>
                            <div className="advice" id="cs-analysis">
                            {
                                matchup.user.stats.totalMinionsKilled === matchup.opponents[0].stats.totalMinionsKilled
                                ?
                                <div className="advice-note" id="cs-comparison">
                                    <strong>CS:</strong> You and your opponent killed the same amount of minions. Great job keeping up with your lane opponent. 
                                </div>
                                :
                                matchup.user.stats.totalMinionsKilled > matchup.opponents[0].stats.totalMinionsKilled
                                ?
                                <div className="advice-note" id="cs-comparison">
                                    <strong>CS:</strong> Your cs is on point. You beat your opponent in minion kills, giving you a game advantage with more gold to spend on items.
                                </div>
                                :
                                <div className="advice-note" id="cs-comparison">
                                    <strong>CS:</strong> Your opponent out-cs'd you. Try to poke your opponent if they are going in to last hit a minion, making them pay for the gold gained. Focus on wave control, so you know when to base without missing out on too many minions.
                                </div>
                            }
                            </div>
                            <div className="advice" id="vision-analysis">
                            {
                                matchup.user.stats.visionScore === matchup.opponents[0].stats.visionScore
                                ?
                                <div className="advice-note" id="vision-comparison">
                                    <strong>Vision:</strong> Equal vision score. You and your lane opponent kept the map lit up equally.
                                </div>
                                :
                                matchup.user.stats.visionScore > matchup.opponents[0].stats.visionScore
                                ?
                                <div className="advice-note" id="vision-comparison">
                                    <strong>Vision:</strong> Your warding skills this match were strong. You beat your opponent in keeping vision on the map for your team. Keep it up to maintain an advantage.
                                </div>
                                :
                                <div className="advice-note" id="vision-comparison">
                                    <strong>Vision:</strong> Your opponent beat you in keeping the fog of war away. Consider buying more pinks, placing more wards, and destroying more enemy wards to ensure your team has sight of the enemy at all times.
                                </div>
                            }
                            </div>
                            <div className="advice" id="gold-analysis">
                            {
                                matchup.user.stats.goldEarned === matchup.opponents[0].stats.goldEarned
                                ?
                                <div className="advice-note" id="gold-comparison">
                                    <strong>Gold:</strong> You and your opponent matched each other in gold. No advantage or disadvantage to your respective teams. 
                                </div>
                                :
                                matchup.user.stats.goldEarned > matchup.opponents[0].stats.goldEarned
                                ?
                                <div className="advice-note" id="gold-comparison">
                                    <strong>Gold:</strong> You outearned your lane opponent in gold. Nice work. Keep doing this to ensure you have an item advantage, giving you the edge in skirmishes and lanes.
                                </div>
                                :
                                <div className="advice-note" id="gold-comparison">
                                    <strong>Gold:</strong> Your opponent earned more gold than you, giving themselves and their team an advantage. Try to look for more opportunities to secure kills, participate in team fights, and cs more efficiently to gain the advantage.
                                </div>
                            }
                            </div>
                        </div>
                    </div>
                </div>
            )
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
                    </div>
                </div>
                <div className="row">
                    <h3>Last 5 Matches</h3>
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