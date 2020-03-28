import React, { Component } from "react";
import Option from './Option'

class VoteControl extends Component {
    

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
            const rows = VoteControl.getBoxesByRows(this.props.voting.options.slice());
            console.log(JSON.stringify(rows))
            return (
                <div> 
                { 
                 rows.map(row => (
                    <div key={row} className="optionRow">
                        { row.map(option => {
                            return (<Option key={option} text={option} online={option==this.state.selected} onClick={(evt) => this.onOptionClick(o)} />)
                        })}
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

    static getBoxesByRows(items) {
        let result = [];
        let rowSize = 3;
        
        while(items.length > 0) {
            let i = 0;
            const rowItems = [];
            while(i++ < rowSize && items.length > 0){
                let item = items.shift();
                rowItems.push(item)
            }

            if(rowItems.length < 3){
                let itemsToAdd = 3 - rowItems.length;
                while(itemsToAdd-- > 0)
                    rowItems.push('-');
            }
            result.push(rowItems)
        }

        return result;
    }
}

export default VoteControl;