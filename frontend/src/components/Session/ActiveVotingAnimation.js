import React, { Component } from "react";
import '../../styles/ActiveVotingAnimation.css'

class ActiveVotingAnimation extends Component {
    
    constructor(props) {
        super(props);
    }

    render(){
        return (
            <div className="animationScreen">
                <div className="animationProgress" id="letfProgress"></div>
                <div className="animationScreenContent">
                    <h1>Active voting</h1>
                </div>
                <div className="animationProgress right" id="rightProgress"></div>
            </div>
        )
    }
}

export default ActiveVotingAnimation;