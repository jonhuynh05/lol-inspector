import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import "./login.css"

class Login extends Component {
    state = {
        champList: []
    }
    async componentDidMount () {
        const champList = (await (await fetch("https://ddragon.leagueoflegends.com/cdn/9.23.1/data/en_US/champion.json")).json()).data
        const champListNames = Object.keys(champList)
        this.setState({
            champList: champListNames
        })
        this.props.handleLoginReset()
    }
    
    render(){

        const champs = this.state.champList.map((champ, i) => {
            return(
                <option key={i} value={`https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champ}_0.jpg`}>{champ}</option>
            )
        })
        return(
            <div>
                <div id="login-container">
                    <div className="login-header">Login</div>
                    <form onSubmit={this.props.handleLogin}>
                        <input className="login-input" type="text" placeholder="Username" name="loginUsername" onChange={this.props.onChange} value={this.props.state.loginUsername} required></input><br/>
                        <input className="login-input" type="password" placeholder="Password" name="loginPassword" onChange={this.props.onChange} value={this.props.state.loginPassword} required></input><br/>
                        <div className="error-message">{this.props.state.loginErrorMessage}</div>
                        <button className="submit-button" type="submit">Submit</button><br/>
                    </form>
                </div>
                <div id="register-container">
                    <div className="login-header">Register</div>
                    <form onSubmit={this.props.handleRegister}>
                        <input className="login-input" pattern="\S+" title="No spaces." type="text" placeholder="First Name" name="firstName" onChange={this.props.onChange} value={this.props.state.firstName} required></input><br/>
                        <input className="login-input" pattern="\S+" title="No spaces." type="text" placeholder="Last Name" name="lastName" onChange={this.props.onChange} value={this.props.state.lastName} required></input><br/>
                        <input className="login-input" pattern="\S+" title="No spaces." type="text" placeholder="Username" name="username" onChange={this.props.onChange} value={this.props.state.username} required></input><br/>
                        <input className="login-input" type="text" placeholder="Email" name="email" pattern="\S+" title="No spaces." onChange={this.props.onChange} value={this.props.state.email} required></input><br/>
                        <input pattern="\S+" title="No spaces." className="login-input" type="password" placeholder="Password" name="password" onChange={this.props.onChange} value={this.props.state.password} required></input><br/>
                        <div id="main-question">Who's your main?</div>
                        <select id="main-selection" name="profileIconUrl" onChange={this.props.onChange}>
                            {champs}
                        </select>
                        <div className="error-message">{this.props.state.errorMessage}</div>
                        <button className="submit-button" type="submit">Submit</button><br/>
                    </form>
                </div>
            
            </div>
        )
    }
}

export default withRouter(Login)