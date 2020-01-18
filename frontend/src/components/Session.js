import React, { Component } from "react";
import _ from 'lodash';
import { getAllUrlParams } from '../utils/urlutils'
import { copyToClipboard } from '../utils/clipboard'
import OnlineIndicator from './OnlineIndicator'
import WSClient from '../api/wsclient'
import '../styles/Session.css';

class Session extends Component {

    constructor(props) {
        super(props);
        
        let params = getAllUrlParams();
        this.state = {
            sessionId : params.id,
            users: [],
            votedUsers : new Set()
        }

        this.onMessage = this.onMessage.bind(this);
        this.onStartVoteClicked = this.onStartVoteClicked.bind(this);
        this.socket = new WSClient(this.state.sessionId, "chairman")
        this.socket.onMessage(this.onMessage)
    }

    render() {
        const self = this;
        return (
            <div>
                <h1>Hello from session {this.state.sessionId}</h1>
                <div>
                    <div className="sessionBoard">
                        { 
                        this.state.users.map((user, index) => {
                            const voted = self.state.votedUsers.has(user.userId);
                            return (<OnlineIndicator 
                                            userId={user.userId}
                                            text = {voted ? ' + ' + user.name : user.name }
                                            key={user.userId}
                                            online={user.online}
                                            onClick={(evt) => this.onUserClick(this.state.sessionId, user.userId)}/>)
                        })
                        }
                    </div>
                </div>
                <div>
                    <button onClick={this.onStartVoteClicked}>Start vote</button>
                </div>
            </div>
        )
    }

    async onStartVoteClicked() {
        this.state.votedUsers.clear();
        this.setState({
            votedUsers: this.state.votedUsers
        })
        const result = await this.props.httpClient.startVoting(this.state.sessionId);
    }

    async onUserClick(sessionId, userId) {
        let link = `${location.protocol}//${location.host}/vote?sessionid=${sessionId}&userid=${userId}`;
        copyToClipboard(link);
    }

    async componentDidMount() {
        this.socket.connect();
        const users = await this.props.getSessionUsers(this.state.sessionId);
        this.setState({
            sessionId: this.state.sessionId,
            users: users
        });
    }

    onMessage(evt) {
        const message = JSON.parse(event.data);
        if(message.action == 'OnlineStatusUpdate') {
            console.log('Online status updated')
            let users = message.users;
            this.setState({
                sessionId: this.state.sessionId,
                users: users
            })
        } else if(message.action == 'userVoted') {
            this.state.votedUsers.add(message.details.userId);
            this.setState({
                votedUsers : this.state.votedUsers
            })
        }
        var today = new Date();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        console.log(`${time} : ${JSON.stringify(message)}`);
    }
}

export default Session;