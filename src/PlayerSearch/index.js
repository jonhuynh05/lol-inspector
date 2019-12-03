import React, { Component } from 'react'

class PlayerSearch extends Component {
    state = {
        query: "",
        name: "",
        level: "",
        found: false,
        foundMessage: ""
    }
    handleChange = (e) => {
        this.setState({
            [e.currentTarget.name]: e.currentTarget.value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault()
        this.getSummoner()
    }

    getSummoner = async () => {
        const summoner = await fetch (`/api/v1/search/${this.state.query}`)
        console.log(summoner)
        const summonerJson = await summoner.json()
        console.log(summonerJson)
        if(summonerJson.status){
            this.setState({
                found: false,
                foundMessage: "Summoner not found."
            })
            return null
        }
        else{
            this.setState({
                name: summonerJson.name,
                level: summonerJson.summonerLevel,
                found: true,
                foundMessage: ""
            })
        }
    }

    render(){
        return(
            <div>
                <h1>Player Search</h1>
                <form onSubmit={this.handleSubmit}>
                    <input type="text" name="query" value={this.state.query} onChange={this.handleChange}/>
                    <button type="submit">Submit</button>
                </form>
                {
                    this.state.found === true
                    ?
                    <div>
                        Found: {this.state.name}<br/>
                        Level: {this.state.level}
                    </div>
                    :
                    <div>
                        {this.state.foundMessage}
                    </div>
                }
            </div>
        )
    }
}

export default PlayerSearch