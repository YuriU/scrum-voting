import React, { Component } from "react";
import StatusBox from './StatusBox'
import { copyToClipboard } from '../../utils/clipboard'

class VotersStatusesControl extends Component {

    constructor(props) {
        super(props);

        this.renderRow = this.renderRow.bind(this);
    }

    renderRow(items, rowIndex) {
        return (<div key={rowIndex} className="row">
            <div className="rowContent">
                {
                items.map((user, index) => {
                    return (<StatusBox
                                userId = {user.userId}
                                text = {user.name}
                                key = {user.userId}
                                online = {user.online}
                                onClick={(evt) => this.onUserClick(this.props.sessionId, user.userId)}/>)
                 })
                }
            </div>
        </div>);
    }

    render() {
        const rows = VotersStatusesControl.getBoxesByRows(this.props.users.slice());
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

export default VotersStatusesControl;