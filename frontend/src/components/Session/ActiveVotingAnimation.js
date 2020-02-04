import React, { Component } from "react";
import '../../styles/ActiveVotingAnimation.css'
import OnlineUsersControl from './OnlineUsersControl'

class ActiveVotingAnimation extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            progress: 0
        }
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
            <div className="animationScreen row">
                <div className="animationProgress column">
                    <div className="progressBar" style={{height: height}}>
                        <div className="progressBarLabel">{this.state.secondsLeft}</div>
                    </div>
                </div>
                <div className="animationScreenContent column">
                    <h1>Active voting</h1>
                    <OnlineUsersControl users={this.props.users} sessionId="{this.props.sessionId}"/>
                </div>
                <div className="animationProgress column" id="rightProgress">
                    <div className="progressBar" style={{height: height}}>
                        <div className="progressBarLabel">{this.state.secondsLeft}</div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ActiveVotingAnimation;