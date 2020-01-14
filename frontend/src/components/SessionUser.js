import React, { Component } from "react";

class SessionUser extends Component {
    constructor(props) {
        super(props)
    }

    render() {
            return (<div className="flipCard"> 
                <div className= "card"> 
                    <div className="side front">User</div> 
                    <div className="side back">Done</div> 
                </div> 
            </div> )
    }
}

export default SessionUser;