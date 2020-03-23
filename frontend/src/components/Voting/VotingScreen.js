import React, { Component } from "react";
import WSClient from '../../api/wsclient'
import VotingControl from './VotingControl'
import FullScreenSwitch from './FullscreenSwitch'
import OnlineIndicatorMobile from './OnlineIndicatorMobile'
import '../../styles/FlipCard.css';

class VotingScreen extends Component {
    constructor(props) {
        super(props);
        console.log(JSON.stringify(props));
        this.state = {
            online: false,
            activeVoting : null //this.makeActiveVoting("dsd", ["1", "2", "3", "4"]),
        }

        this.optionSelected = this.optionSelected.bind(this);
        console.log(JSON.stringify(this.state))
        this.socket = new WSClient(this.props.sessionId, this.props.userId)

        this.socket.onConnect(() => {
            this.setState({ online: true })
        })

        this.socket.onDisconnect(() => {
            this.setState({ online: false })
        })

        this.onMessage = this.onMessage.bind(this);
        this.socket.onMessage(this.onMessage)
        this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    }

    render() {
        return(<div className="flexBox votescreen">
                <div className="row header">
                    <OnlineIndicatorMobile online={this.state.online} text={this.state.online ? "Online" : "Offline" } />
                    <FullScreenSwitch />
                </div>
                <div className="row content">
                    <div className="flipCard"> 
                        <div className= {this.state.activeVoting ? "card" : "card flipped" }> 
                            <div className="side front"><VotingControl voting={this.state.activeVoting} onOptionSelected={this.optionSelected} /></div> 
                            <div className="side back">Wait for the vote</div> 
                        </div> 
                    </div>
                </div>
            </div>)
    }

    componentDidMount() {
        this.socket.connect()
        document.addEventListener('visibilitychange', this.handleVisibilityChange, false);
    }

    componentWillUnmount() {
        this.socket.disconnect()
    }

    handleVisibilityChange() {
        if (document.visibilityState == "hidden") {
            this.socket.disconnect()
        } else {
            this.socket.connect()
        }
      }

    optionSelected(option){
        console.log(option)
        this.socket.send({ 
            action: 'vote',
            details : {
                sessionId: this.props.sessionId,
                userId: this.props.userId,
                votingId: this.state.activeVoting.votingId,
                votingResult: option
             }});
    }

    onMessage(event){

        const message = JSON.parse(event.data);
        const today = new Date();
        const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        console.log(`${time} : ${JSON.stringify(message)}`)

        const action = message.action;
        if(action == 'VoteStarted') {
            this.setState({ activeVoting :  this.makeActiveVoting(message.votingId, message.possibleOptions)})
        }
        else if(action == 'VoteFinished') {
            this.setState({ activeVoting : null })
        }
    }

    makeActiveVoting(votingId, possibleOptions){
        return {
            votingId: votingId,
            options: possibleOptions
        }
    }
}

export default VotingScreen;