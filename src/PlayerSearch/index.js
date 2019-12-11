import React, { Component } from 'react'
import {Redirect} from "react-router-dom"
import {MoonLoader} from "react-spinners"
import * as ROUTES from "../constants/routes"
import "./playersearch.css"

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
            isLoading: true
        })
        const summoner = await fetch (`/api/v1/${this.state.query}`)
        console.log(summoner)
        const summonerJson = await summoner.json()
        console.log(summonerJson)
        if(summonerJson.status){
            setTimeout(() =>
                this.setState({
                    found: false,
                    foundMessage: "Summoner not found. Please try again.",
                    isLoading: false
            }), 2000)
            return null
        }
        else{
            setTimeout(() =>
                this.setState({
                    name: summonerJson.name,
                    level: summonerJson.summonerLevel,
                    found: true,
                    foundMessage: "",
                    isLoading: false,
                    redirect: true
            }), 2000)
        }
    }

    routeChange() {
        this.setState({
            redirect: true
        })
    }

    render(){
        if(this.state.redirect) {
            return <Redirect to={`${ROUTES.SEARCH}/${this.state.name}`}/>
        }
        return(
            <div>
                <div id="player-search-header">Player Search</div>
                <form id="search-form" onSubmit={this.handleSubmit}>
                    <div className="search-row">
                        <input id="player-search-input" type="text" name="query" value={this.state.query} onChange={this.handleChange}/>
                        <button id="search-button" type="submit">Inspect</button>
                    </div>
                </form>
                <MoonLoader 
                    sizeUnit={"px"}
                    size={20}
                    color={'#123abc'}
                    loading={this.state.isLoading}/>
                {
                    this.state.found === false
                    ?
                    <div className="error-message">
                        {this.state.foundMessage}
                    </div>
                    :
                    null
                }
            </div>
        )
    }
}

export default PlayerSearch