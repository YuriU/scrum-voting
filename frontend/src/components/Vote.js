import React, { Component } from "react";
import { getAllUrlParams } from '../utils/urlutils'
import WSClient from '../api/wsclient'
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
        this.socket = new WSClient(this.state.sessionId, this.state.userId)

        this.socket.onConnect(() => {
            this.setState({ online: true })
        })

        this.socket.onDisconnect(() => {
            this.setState({ online: false })
        })

        this.socket.onMessage(this.onMessage)
    }

    render() {
        return(<div>
            <OnlineIndicator online={this.state.online} text={this.state.online ? "Online" : "Offline" } />
            <h1>Hello User {this.state.userId} from Session {this.state.sessionId}</h1>
        </div>)
    }

    componentDidMount() {
        this.socket.connect()
    }

    componentWillUnmount() {
        this.socket.disconnect()
    }

    onMessage(event){

        const message = JSON.parse(event.data);
        var today = new Date();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        console.log(`${time} : ${JSON.stringify(message)}`)
    }
}

export default Vote;