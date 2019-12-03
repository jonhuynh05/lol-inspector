import React, { Component } from 'react'

class PlayerSearch extends Component {
    state = {
        query: "",
        name: "",
        level: ""
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
        this.setState({
            name: summonerJson.name,
            level: summonerJson.summonerLevel
        })
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
                    this.state.name !== ""
                    ?
                    <div>
                        Found: {this.state.name}<br/>
                        Level: {this.state.level}
                    </div>
                    :
                    null
                }
            </div>
        )
    }
}

export default PlayerSearch