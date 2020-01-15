import React, { Component } from "react";
import '../styles/SessionUser.css';

class SessionUser extends Component {
    constructor(props) {
        super(props)
    }

    render() {
            return (<div className="userCard"> 
                <div className= "card"> 
                    <div className= {this.props.online ? "side online" : "side offline"} >{this.props.name}</div> 
                </div> 
            </div> )
    }
}

export default SessionUser;