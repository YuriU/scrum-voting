import React, { Component } from "react";
import Option from './Option'
import CreateSession from './CreateSession'
import FullScreenSwitch from './FullscreenSwitch'
import '../styles/App.css';
import { getAllUrlParams } from '../utils/urlutils'

class App extends Component {

    constructor(props) {
        super(props)
        this.urlParams = getAllUrlParams();

        console.log(JSON.stringify(this.props.config))

        this.BackendHttpEndpoint = this.props.config.BackendHttpEndpoint;
        this.BackendWebSocketEndpoint = this.props.config.BackendWebSocketEndpoint;

        this.onCreateSession = this.onCreateSession.bind(this);
    }

    componentDidMount() {
        this.webSocket = this.initializeWebSocket(this.BackendWebSocketEndpoint, this.urlParams);
    }

    async onCreateSession(items) {
        var url = this.BackendHttpEndpoint + '/startSession';
        console.log(url)
        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
              },
            body: JSON.stringify(items)
        })

        console.log(JSON.stringify(response));
    }

    render() {
        return (
            <div>
                <FullScreenSwitch />
                <h1>My React App!</h1>
                <CreateSession onCreateSession={this.onCreateSession}/>
                {/*<Option value="3" />
                <Option value="5" />*/}
            </div>
        );
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

export default App;