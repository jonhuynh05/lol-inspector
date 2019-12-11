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
        if(this.state.query === ""){
            setTimeout(() =>
                this.setState({
                    found: false,
                    foundMessage: "Summoner not found. Please try again.",
                    isLoading: false
            }), 2000)
            return null
        }
        const summoner = await fetch (`/api/v1/${this.state.query}`)
        console.log(summoner, "1")
        if(summoner.status === 404){
            setTimeout(() =>
                this.setState({
                    found: false,
                    foundMessage: "Summoner not found. Please try again.",
                    isLoading: false
            }), 2000)
            return null
        }
        const summonerJson = await summoner.json()
        console.log(summonerJson, "2")
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
                <div className="welcome-container">
                    <div className="welcome-row">
                        <div className="welcome-col" id="welcome-header">
                            LoL Inspector
                        </div>
                    </div>
                    <div className="welcome-row">
                        <div className="welcome-col" id="welcome-description">
                            Welcome to LoL Inspector. This is your tool to help improve your League of Legends gameplay. Use the search bar below to look for your yourself and other players. Receive deep insights against your lane opponents through statistical comparisons and tips based on your match performances.
                            
                            Note that searches are restricted to classic-mode matches in North America.
                        </div>   
                    </div>
                </div>
                <div id="player-search-header">Player Search</div>
                <form id="search-form" onSubmit={this.handleSubmit}>
                    <div className="search-row">
                        <input id="player-search-input" type="text" name="query" value={this.state.query} onChange={this.handleChange}/>
                        <button id="search-button" type="submit">Inspect</button>
                    </div>
                </form>
                <div id="search-spinner-row">
                    <div id="search-spinner-col">
                        <MoonLoader 
                            sizeUnit={"px"}
                            size={20}
                            color={'#123abc'}
                            loading={this.state.isLoading}/>
                    </div>
                </div>
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