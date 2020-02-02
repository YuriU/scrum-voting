import React, { Component } from "react";
import '../../styles/ActiveVotingAnimation.css'
import OnlineIndicator from './OnlineIndicator'

class ActiveVotingAnimation extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            progress: 0
        }
    }

    componentDidMount() {

        console.log('Props ' + JSON.stringify(this.props.activeVoting))
        this.timer = setInterval(() => {

            const now = new Date();
            const totalInterval = this.props.activeVoting.endTime.getTime() - this.props.activeVoting.startTime.getTime();
            const completedInterval =  now.getTime() - this.props.activeVoting.startTime.getTime();

            const progress = completedInterval*100 / totalInterval;

            this.setState(prevState => ({
                    progress: progress > 100 ? 100 : progress
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
                    <div className="progressBar" style={{height: height}}></div>
                </div>
                <div className="animationScreenContent column">
                    <h1>Active voting</h1>
                    <h1>Progress is {this.state.progress}</h1>
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
                <div className="animationProgress column" id="rightProgress">
                    <div className="progressBar" style={{height: height}}></div>
                </div>
            </div>
        )
    }
}

export default ActiveVotingAnimation;