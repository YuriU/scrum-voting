import React, { Component } from "react";
import Option from './Option'

class VotingControl extends Component {

    static getRowSize() {
        return 3;
    };

    constructor(props) {
        super(props);
        console.log(JSON.stringify(props));
        this.state = {
            selected: null
        }
        this.onOptionClick = this.onOptionClick.bind(this);
    }

    render() {
        if(this.props.voting && this.props.voting.options) {
            const rows = VotingControl.getBoxesByRows(this.props.voting.options.slice());
            console.log(JSON.stringify(rows))
            return (
                <div> 
                { 
                 rows.map(row => (
                    <div key={row} className="optionRow">
                        {
                            row.map(option => {
                                return (<Option key={option} text={option} online={option==this.state.selected} onClick={(evt) => this.onOptionClick(option)} />)
                            })
                        }
                        {
                            // Added rest of items as inactive
                            row.length < VotingControl.getRowSize() && VotingControl.makeArray(VotingControl.getRowSize() - row.length).map(i => {
                                return (<Option disabled={true} key={i} text="" />)
                            })
                        }
                    </div>)) 
                }
                </div>);
        }
        else {
            return (<div>Nothing ...</div>)
        }
    }

    onOptionClick(option){
        this.setState({
            selected: option
        })

        if(this.props.onOptionSelected){
            this.props.onOptionSelected(option);
        }
    }

    static makeArray(length){
        let array = [];
        for (let index = 0; index < length; index++) {
            array.push(`na-${index}`);
        }
        return array;
    }

    static getBoxesByRows(items) {
        let result = [];
        let rowSize = VotingControl.getRowSize();
        
        while(items.length > 0) {
            let i = 0;
            const rowItems = [];
            while(i++ < rowSize && items.length > 0) {
                let item = items.shift();
                rowItems.push(item)
            }

            result.push(rowItems)
        }

        return result;
    }
}

export default VotingControl;