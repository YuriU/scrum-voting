import React, { Component } from "react";
import _ from 'lodash';
import Config from '../config'
import { getAllUrlParams } from '../utils/urlutils'
import SessionUser from './SessionUser'

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
    }

    render() {
        return (
            <div>
                <h1>Hello from session {this.state.sessionId}</h1>
                { 
                    this.state.users.map((user, index) => {
                        return (<SessionUser name={user.name} key={user.userId} online={user.online}/>)
                    })
                }
                
            </div>
        )
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
            console.log(message);
        };

        webSocket.onerror = function(error) {
            console.log("Error: " + error.message);
        };

        return webSocket;
    }
}

export default Session;