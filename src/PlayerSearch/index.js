import React, { Component } from 'react'
import {Redirect} from "react-router-dom"
import {MoonLoader} from "react-spinners"

class PlayerSearch extends Component {
    state = {
        query: "",
        name: "",
        level: "",
        found: false,
        foundMessage: "",
        redirect: false,
        isLoading: false
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
        this.setState({
            loading: true
        })
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
                foundMessage: "",
                loading: false,
                redirect: true
            })
        }
    }

    routeChange() {
        this.setState({
            redirect: true
        })
    }

    render(){
        if(this.state.redirect) {
            return <Redirect to={`/search/${this.state.name}`}/>
        }
        return(
            <div>
                <h1>Player Search</h1>
                <form onSubmit={this.handleSubmit}>
                    <input type="text" name="query" value={this.state.query} onChange={this.handleChange}/>
                    <button type="submit">Submit</button>
                </form>
                <MoonLoader 
                    sizeUnit={"px"}
                    size={150}
                    color={'#123abc'}
                    loading={this.state.loading}/>
                {/* {
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
                } */}
            </div>
        )
    }
}

export default PlayerSearch