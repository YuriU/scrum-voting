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

    render(){
    return (<div>{
            this.props.voting 
            ?
                this.props.voting.options.map(o => {
                    return (<Option key={o} text={o} online={o==this.state.selected} onClick={(evt) => this.onOptionClick(o)} />)
                })
            : <div>Nothing ...</div>
        }</div>)
    }

    onOptionClick(option){
        this.setState({
            selected: option
        })

        if(this.props.onOptionSelected){
            this.props.onOptionSelected(option);
        }
    }
}

export default VoteControl;