import React, { Component } from "react";
import '../styles/SessionUser.css';

class SessionUser extends Component 
{
    constructor(props) {
        super(props)

        this.onclick = this.onclick.bind(this);
    }

    onclick(){

        const sessionId = this.props.sessionId;
        const userId = this.props.userId;

        let userUrl = `${location.protocol}//${location.host}/vote?sessionId=${sessionId}&userId=${userId}`;
        console.log(userUrl);
        
    }

    render() {
            return (<div className="userCard"> 
                <div className= "card"> 
                    <div className= {this.props.online ? "side online" : "side offline"} onClick={this.onclick} >{this.props.name}</div> 
                </div> 
            </div> )
    }
}

export default SessionUser;