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
    }

    render() {
        return (
            <div>
                <h1>Hello from session {this.state.sessionId}</h1>
                { 
                    this.state.users.map((user, index) => {
                        return (<SessionUser name={user.name} online={index % 2 == 0}/>)
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
            console.log("Data received: " + event.data);
        };

        webSocket.onerror = function(error) {
            console.log("Error: " + error.message);
        };

        return webSocket;
    }
}

export default Session;