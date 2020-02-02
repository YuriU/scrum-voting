import React, { Component } from "react";
import '../../styles/ActiveVotingAnimation.css'
import OnlineIndicator from './OnlineIndicator'

class ActiveVotingAnimation extends Component {
    
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="animationScreen row">
                <div className="animationProgress column"></div>
                <div className="animationScreenContent column">
                    <h1>Active voting</h1>
                    <div className="votingUsersStatusesBox">
                        { 
                            this.props.users.map((user, index) => {
                                                        return (<OnlineIndicator 
                                                                    userId={user.userId}
                                                                    text = { user.name }
                                                                    key={user.userId}
                                                                    online={user.online}/>)
                            })
                        }
                    </div>
                </div>
                <div className="animationProgress column" id="rightProgress"></div>
            </div>
        )
    }
}

export default ActiveVotingAnimation;