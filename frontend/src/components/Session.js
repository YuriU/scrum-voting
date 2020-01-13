import React, { Component } from "react";
import _ from 'lodash';
import Config from '../config'

class Session extends Component {

    constructor(props) {
        super(props);
        console.log(JSON.stringify(props));
        this.state = {
            sessionId : props.sessionId
        }
    }

    render() {
        return (<h1>Hello from session {this.props.sessionId}</h1>)
    }

    componentDidMount() {
        console.log(Config.BackendWebSocketEndpoint)
        console.log(this.state.sessionId)

        this.webSocket = this.initializeWebSocket(Config.BackendWebSocketEndpoint, this.state.sessionId, "chairman");
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