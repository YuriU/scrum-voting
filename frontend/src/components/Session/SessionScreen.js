import React, { Component } from "react";
import _ from 'lodash';
import WSClient from '../../api/wsclient'
import OnlineUsersControl from './OnlineUsersControl'
import '../../styles/Session.css';

class SessionScreen extends Component {

    constructor(props) {
        super(props);

        console.log('SessionScreen Ctor ..')
        console.log('SessionScreen props ..')
        console.log(props)

        this.state = {
            users: [],
            votedUsers : new Set(),
            userVoteResults: new Map(),
            activeVoting: null
        }

        this.onMessage = this.onMessage.bind(this);
        this.onStartVoteClicked = this.onStartVoteClicked.bind(this);
        this.socket = new WSClient(this.props.sessionId, "chairman")
        this.socket.onMessage(this.onMessage)
    }

    render() {
        const self = this;
        return (
            <div>
                <h1>Hello from session {this.props.sessionId}</h1>
                {
                    

                }
                <OnlineUsersControl users={this.state.users} sessionId={this.props.sessionId}/>
                <div>
                    <button onClick={this.onStartVoteClicked}>Start vote</button>
                </div>
            </div>
        )
    }

    async onStartVoteClicked() {
        this.state.votedUsers.clear();
        this.setState({
            votedUsers: this.state.votedUsers,
            userVoteResults: new Map()
        })
        const result = await this.props.httpClient.startVoting(this.props.sessionId, true);
    }

    async componentDidMount() {
        this.socket.connect();
        const users = await this.props.getSessionUsers(this.props.sessionId);
        this.setState({
            sessionId: this.props.sessionId,
            users: users
        });
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
            this.state.votedUsers.add(message.details.userId);
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
                userVoteResults : map,
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