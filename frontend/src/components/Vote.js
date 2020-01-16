import React, { Component } from "react";
import Config from '../config'
import { getAllUrlParams } from '../utils/urlutils'
import OnlineIndicator from "./OnlineIndicator";

class Vote extends Component {
    constructor(props) {
        super(props);
        console.log(JSON.stringify(props));

        let params = getAllUrlParams();
        this.state = {
            sessionId : params.sessionid,
            userId:  params.userid,
            online: false
        }

        console.log(JSON.stringify(this.state))
    }

    render() {
        console.log('------' + JSON.stringify(this.state))
        return(<div>
            <OnlineIndicator online={this.state.online} text={this.state.online ? "Online" : "Offline" } />
            <h1>Hello User {this.state.userId} from Session {this.state.sessionId}</h1>
        </div>)
    }

    async componentDidMount() {
        this.webSocket = this.initializeWebSocket(Config.BackendWebSocketEndpoint, this.state.sessionId, this.state.userId);
    }

    initializeWebSocket(webSocketUrl, sessionId, userId) {

        let webSocket = new WebSocket(webSocketUrl + "?sessionid=" + sessionId +"&userid=" + userId);

        let self = this;
        webSocket.onopen = function() {
            console.log('Connected');
            self.setState({
                online: true
            })
          }
  
        webSocket.onclose = function(event) {
            if (event.wasClean) {
            console.log('Clean close');
            } else {
            console.log('connection issue')
            }
            console.log('Code: ' + event.code + ' Reason: ' + event.reason);
            self.setState({
                online: false
            })
        };

        webSocket.onmessage = function(event) {
            const message = JSON.parse(event.data);
            if(message.action == 'OnlineStatusUpdate'){

            }
            console.log(message);
        };

        webSocket.onerror = function(error) {
            console.log("Error: " + error.message);
        };

        return webSocket;
    }
}

export default Vote;