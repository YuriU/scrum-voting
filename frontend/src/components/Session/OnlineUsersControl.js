import React, { Component } from "react";
import OnlineIndicator from './OnlineIndicator'
import { copyToClipboard } from '../../utils/clipboard'

class OnlineUsersControl extends Component {

    constructor(props) {
        super(props);

        this.renderRow = this.renderRow.bind(this);
    }

    renderRow(items, rowIndex) {
        return (<div key={rowIndex} className="row">
            <div className="rowContent">
                {
                items.map((user, index) => {
                    return (<OnlineIndicator
                                userId = {user.userId}
                                text = {user.name}
                                key = {user.userId}
                                online = {user.online}
                                onClick={(evt) => this.onUserClick(this.props.sessionId, user.userId)}/>)
                    //return (<div key = {user.userId} className="box"></div>)
                 })
                }
            </div>
        </div>);
    }

    render() {
        const rows = OnlineUsersControl.getBoxesByRows(this.props.users.slice());
        return (<div className="sessionBoard">
                { 
                    rows.map((row, index) => {
                       return this.renderRow(row, index)
                    })
                }
                </div>)
    }

    async onUserClick(sessionId, userId) {
        let link = `${location.protocol}//${location.host}/vote/${sessionId}/${userId}`;
        copyToClipboard(link);
    }

    static getBoxesByRows(items) {
        let result = [];
        let rowSize = 2;
        
        while(items.length > 0) {
            let i = 0;
            const rowItems = [];
            while(i++ < rowSize && items.length > 0){
                let item = items.pop();
                rowItems.push(item)
            }
            result.push(rowItems)
            rowSize+=2;
        }

        return result;
    }
}

export default OnlineUsersControl;