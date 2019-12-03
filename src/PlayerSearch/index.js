import React, { Component } from 'react'

class PlayerSearch extends Component {
    state = {
        query: ""
    }
    handleChange = (e) => {
        this.setState({
            [e.currentTarget.name]: e.currentTarget.value
        })
    }
    render(){
        return(
            <div>
                <h1>Player Search</h1>
                <form>
                    <input type="text" name="query" value={this.state.query} onChange={this.handleChange}/>
                    <button type="submit">Submit</button>
                </form>
            </div>
        )
    }
}

export default PlayerSearch