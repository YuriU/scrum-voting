import React, { Component } from "react";
import _ from 'lodash';
import WSClient from '../../api/wsclient'
import VotersStatusesControl from './VotersStatusesControl'
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
            connected: false,
            users: [],
            activeVoting: null,
            lastVotingResult: null
        }

        this.onMessage = this.onMessage.bind(this);
        this.onStartVoteClicked = this.onStartVoteClicked.bind(this);
        this.onNextVoteClicked = this.onNextVoteClicked.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);

        this.socket = new WSClient(this.props.sessionId, "chairman")
        this.socket.onMessage(this.onMessage)
        this.socket.onConnect(() => {
            this.setState({ connected: true })
        })

        this.socket.onDisconnect(() => {
            this.setState({ connected: false })
        })
    }

    render() {

        if (this.state.lastVotingResult) {
            return (
                <div className="sessionScreen">
                    <VotingResult results={this.state.lastVotingResult} />
                </div>
            )
        }
        else if (this.state.activeVoting) {
            return (<ActiveVotingAnimation users={this.state.users} activeVoting={this.state.activeVoting} votedUsers={this.state.votedUsers} />)
        }
        else {
            return (
                <div className="sessionScreen">
                    <h1>Hello from session {this.props.sessionId}</h1>                    
                    <div>
                        <VotersStatusesControl users={this.state.users} getStatus={this.getUserOnlineStatus} sessionId={this.props.sessionId} />
                    </div>
                </div>
            )
        }
    }

    getUserOnlineStatus(user) 
    {
        return user.online ? "online" : "offline";
    }

    async componentDidMount() {
        document.addEventListener('keypress', this.onKeyPress);
        this.socket.connect();
        const users = await this.props.getSessionUsers(this.props.sessionId);
        this.setState({
            sessionId: this.props.sessionId,
            users: users
        });
    }

    componentWillUnmount() {
        document.removeEventListener('keypress', this.onKeyPress)
    }

    async onStartVoteClicked() {
        if(!this.state.connected){
            alert('Please reconnect');
        }
        else {
            const result = await this.props.httpClient.startVoting(this.props.sessionId, true);
        }
    }

    async onNextVoteClicked() {
        this.setState({
            lastVotingResult: null
        })
    }

    async onKeyPress(event){
        if(this.state.lastVotingResult) {
            this.setState({
                lastVotingResult: null
            })
        }
        else if(this.state.activeVoting == null) {
            await this.onStartVoteClicked();
        }
    }

    onMessage(evt) {
        const message = JSON.parse(evt.data);
        if (message.action == 'OnlineStatusUpdate') {
            console.log('Online status updated')
            let users = message.users;
            this.setState({
                sessionId: this.props.sessionId,
                users: users
            })
        } else if (message.action == 'userVoted') {
            console.log('User voted')
            console.log(JSON.stringify(message))
            if(this.state.activeVoting && this.state.activeVoting.votingId === message.details.votingId)
            {
                this.state.activeVoting.votedUserIds.push(message.details.userId);
                this.setState({
                    activeVoting: this.state.activeVoting
                })
            }
        } else if (message.action == 'VoteFinished') {
            const userResults = message.userResults;
            let map = new Map();
            userResults.forEach(result => {
                map.set(result.userId, result.result)
            });
            this.setState({
                lastVotingResult: map,
                activeVoting: null
            })
        }
        else if (message.action == 'VoteStarted') {
            var now = new Date();
            var deadline = new Date();
            console.log(message.timeoutSeconds)
            deadline.setSeconds(deadline.getSeconds() + parseInt(message.timeoutSeconds));

            this.setState({
                activeVoting: {
                    votingId: message.votingId,
                    startTime: now,
                    endTime: deadline,
                    onlineUsersIds: message.onlineUsersIds,
                    votedUserIds: []
                }
            })
        }

        var today = new Date();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        console.log(`${time} : ${JSON.stringify(message)}`);
    }
}

export default SessionScreen;