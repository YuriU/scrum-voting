import React, { Component } from "react";
import '../../styles/ActiveVotingAnimation.css'
import VotersStatusesControl from './VotersStatusesControl'

class ActiveVotingAnimation extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            progress: 0
        }

        this.getUserOnlineStatus = this.getUserOnlineStatus.bind(this);
    }

    componentDidMount() {
        this.timer = setInterval(() => {

            const now = new Date();
            const totalInterval = this.props.activeVoting.endTime.getTime() - this.props.activeVoting.startTime.getTime();
            const completedInterval =  now.getTime() - this.props.activeVoting.startTime.getTime();

            const progress = completedInterval*100 / totalInterval;
            let secondsLeft = parseInt((this.props.activeVoting.endTime.getTime() - now.getTime()) / 1000);
            secondsLeft = secondsLeft < 0 ? 0 : secondsLeft;

            this.setState(prevState => ({
                    progress: progress > 100 ? 100 : progress,
                    secondsLeft: secondsLeft
                }))
        }, 10)
    }

    componentWillUnmount() {
        clearInterval(this.timer)
    }

    render() {
        const height = this.state.progress + "%";
        return (
            <div className="sessionScreen row">
                <div className="animationProgress column">
                    <div className="progressBar" style={{height: height}}>
                    </div>
                    <div className="progressBarLabel"><span className="black"><h1>{this.state.secondsLeft}</h1></span></div>
                </div>
                <div className="animationScreenContent column">
                    <h1>Active voting</h1>
                    <VotersStatusesControl users={this.props.users} getStatus={this.getUserOnlineStatus} sessionId={this.props.sessionId}/>
                </div>
                <div className="animationProgress column" id="rightProgress">
                    <div className="progressBar" style={{height: height}}>
                    </div>
                    <div className="progressBarLabel"><span className="black"><h1>{this.state.secondsLeft}</h1></span></div>
                </div>
            </div>
        )
    }

    getUserOnlineStatus(user) 
    {
        if(this.props.activeVoting.onlineUsersIds.includes(user.userId))
        {
            console.log(JSON.stringify(this.props.votedUsers));
            if(this.props.activeVoting.votedUserIds.includes(user.userId)){
                return "online";
            }
            else{
                return "empty";    
            }
        }
        else 
        {
            return "inactive";
        }
    }
}

export default ActiveVotingAnimation;