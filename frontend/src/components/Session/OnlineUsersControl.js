import React, { Component } from "react";
import OnlineIndicator from './OnlineIndicator'
import { copyToClipboard } from '../../utils/clipboard'

class OnlineUsersControl extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (<div className="sessionBoard">
                { 
                    this.props.users.map((user, index) => {
                                                return (<OnlineIndicator 
                                                            userId={user.userId}
                                                            text = { user.name }
                                                            key={user.userId}
                                                            online={user.online}
                                                            onClick={(evt) => this.onUserClick(this.props.sessionId, user.userId)}/>)
                    })
                }
                </div>)
    }

    async onUserClick(sessionId, userId) {
        let link = `${location.protocol}//${location.host}/vote/${sessionId}/${userId}`;
        copyToClipboard(link);
    }
}

export default OnlineUsersControl;