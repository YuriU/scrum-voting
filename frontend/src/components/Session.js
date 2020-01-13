import React, { Component } from "react";
import UserInput from './UserInput'
import _ from 'lodash';

class Session extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (<h1>Hello from session {this.props.sessionId}</h1>)
    }

    componentDidMount() {
        //this.webSocket = this.initializeWebSocket(this.BackendWebSocketEndpoint, this.urlParams);
    }

    initializeWebSocket(webSocketUrl, urlParams) {
        let webSocket = new WebSocket(webSocketUrl + "?sessionid=" + urlParams.sessionid +"&userid=" + urlParams.userid);

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