import React, { Component } from "react";
import Option from './Option'
import FullScreenSwitch from './FullscreenSwitch'
import '../styles/App.css';
import { getAllUrlParams } from '../utils/urlutils'

class App extends Component {

    constructor(props) {
        super(props)
        this.urlParams = getAllUrlParams();
        console.log(this.urlParams);
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

    componentDidMount() {
        this.webSocket = this.initializeWebSocket(this.props.config.BackendWebSocketEndpoint, this.urlParams);
    }

    render() {
        return (
            <div>
                <FullScreenSwitch />
                <h1>My React App!</h1>
                <Option value="3" />
                <Option value="5" />
            </div>
        );
    }
}

export default App;