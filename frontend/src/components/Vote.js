import React, { Component } from "react";
import WSClient from '../api/wsclient'
import OnlineIndicator from './OnlineIndicator';
import VotingControl from './VotingControl'

class Vote extends Component {
    constructor(props) {
        super(props);
        console.log(JSON.stringify(props));
        this.state = {
            online: false
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
        
    }

    render() {
        return(<div>
                <OnlineIndicator online={this.state.online} text={this.state.online ? "Online" : "Offline" } />
                {
                    this.state.activeVoting ? (<VotingControl voting={this.state.activeVoting} onOptionSelected={this.optionSelected} />) : null
                }
                <h1>Hello User {this.props.userId} from Session {this.props.sessionId}</h1>
            </div>)
    }

    componentDidMount() {
        this.socket.connect()
    }

    componentWillUnmount() {
        this.socket.disconnect()
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
            this.setState({
                    activeVoting : {
                        votingId: message.votingId,
                        options: message.possibleOptions
                }
            })
        }
        else if(action == 'VoteFinished') {
            this.setState({
                activeVoting : null
            })
        }
    }
}

export default Vote;