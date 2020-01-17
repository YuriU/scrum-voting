import React, { Component } from "react";
import _ from 'lodash';
import Config from '../config'
import { getAllUrlParams } from '../utils/urlutils'
import { copyToClipboard } from '../utils/clipboard'
import OnlineIndicator from './OnlineIndicator'
import '../styles/Session.css';

class Session extends Component {

    constructor(props) {
        super(props);
        console.log(JSON.stringify(props));

        let params = getAllUrlParams();
        this.state = {
            sessionId : params.id,
            users: []
        }

        this.initializeWebSocket = this.initializeWebSocket.bind(this);
        this.onStartVoteClicked = this.onStartVoteClicked.bind(this);
    }

    render() {
        return (
            <div>
                <h1>Hello from session {this.state.sessionId}</h1>
                <div>
                    <div className="sessionBoard">
                        { 
                        this.state.users.map((user, index) => {
                            return (<OnlineIndicator 
                                            userId={user.userId}
                                            text = {user.name}
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
        const url = Config.BackendHttpEndpoint + '/startVoting';

        let response = await fetch(url, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
          body: JSON.stringify({ sessionId: this.state.sessionId })
        })
  
        const result = await response.json();
        return result;
    }

    async onUserClick(sessionId, userId) {
        
        let link = `${location.protocol}//${location.host}/vote?sessionid=${sessionId}&userid=${userId}`;
        copyToClipboard(link);
    }

    async componentDidMount() {
        console.log(Config.BackendWebSocketEndpoint)
        console.log(this.state.sessionId)
        
        this.webSocket = this.initializeWebSocket(Config.BackendWebSocketEndpoint, this.state.sessionId, "chairman");
        const users = await this.props.getSessionUsers(this.state.sessionId);
        this.setState({
            sessionId: this.state.sessionId,
            users: users
        });
    }

    initializeWebSocket(webSocketUrl, sessionId, userId) {

        let webSocket = new WebSocket(webSocketUrl + "?sessionid=" + sessionId +"&userid=" + userId);

        let self = this;
        webSocket.onopen = function() {
            console.log('Connected');
          }
  
        webSocket.onclose = function(event) {
            if (event.wasClean) {
            console.log('Clean close');
            } else {
            console.log('connection issue')
            }
            console.log('Code: ' + event.code + ' Reason: ' + event.reason);
        };

        webSocket.onmessage = function(event) {
            const message = JSON.parse(event.data);
            if(message.action == 'OnlineStatusUpdate'){
                console.log('Online status updated')
                let users = message.users;
                self.setState({
                    sessionId: self.state.sessionId,
                    users: users
                })
            }
            var today = new Date();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            console.log(`${time} : ${JSON.stringify(message)}`);
        };

        webSocket.onerror = function(error) {
            console.log("Error: " + error.message);
        };

        return webSocket;
    }
}

export default Session;