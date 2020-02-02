import React, { Component } from "react";
import _ from 'lodash';
import WSClient from '../../api/wsclient'
import OnlineUsersControl from './OnlineUsersControl'
import ActiveVotingAnimation from './ActiveVotingAnimation'
import VotingResult from './VotingResult'
import '../../styles/Session.css';


class SessionScreen extends Component {

    constructor(props) {
        super(props);

        console.log('SessionScreen Ctor ..')
        console.log('SessionScreen props ..')
        console.log(props)

        this.state = {
            users: [],
            activeVoting: {},
            lastVotingResult: null
        }

        this.onMessage = this.onMessage.bind(this);
        this.onStartVoteClicked = this.onStartVoteClicked.bind(this);
        this.onNextVoteClicked = this.onNextVoteClicked.bind(this);

        this.socket = new WSClient(this.props.sessionId, "chairman")
        this.socket.onMessage(this.onMessage)
    }

    render() {

        if(this.state.lastVotingResult) {
            return (
                <div>
                    <VotingResult />
                    <div>
                        <button onClick={this.onNextVoteClicked}>Next vote</button>
                    </div>
                </div>
            )
        }
        else if(this.state.activeVoting) {
            return (<ActiveVotingAnimation users={this.state.users} />)
        }
        else {
            return (
                <div>
                    <h1>Hello from session {this.props.sessionId}</h1>
                    <div>
                        <OnlineUsersControl users={this.state.users} sessionId={this.props.sessionId}/>
                        <div>
                            <button onClick={this.onStartVoteClicked}>Start vote</button>
                        </div>
                    </div>
                </div>
            )    
        }
    }

    async componentDidMount() {
        this.socket.connect();
        const users = await this.props.getSessionUsers(this.props.sessionId);
        this.setState({
            sessionId: this.props.sessionId,
            users: users
        });
    }

    async onStartVoteClicked() {
        const result = await this.props.httpClient.startVoting(this.props.sessionId, true);
    }

    async onNextVoteClicked() {
        this.setState({
            lastVotingResult: null
        })
    }

    onMessage(evt) {
        const message = JSON.parse(evt.data);
        if(message.action == 'OnlineStatusUpdate') {
            console.log('Online status updated')
            let users = message.users;
            this.setState({
                sessionId: this.props.sessionId,
                users: users
            })
        } else if(message.action == 'userVoted') {
            //this.state.votedUsers.add(message.details.userId);
            this.setState({
                votedUsers : this.state.votedUsers
            })
        } else if(message.action == 'VoteFinished') {
           
            const userResults = message.userResults;
            let map = new Map();
            userResults.forEach(result => {
                map.set(result.userId, result.result)
            });
            this.setState({
                lastVotingResult : map,
                activeVoting : null
            })
        }
        else if(message.action == 'VoteStarted') {
            this.setState({
                activeVoting : {}
            })
        }
        
        var today = new Date();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        console.log(`${time} : ${JSON.stringify(message)}`);
    }
}

export default SessionScreen;