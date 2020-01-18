import React, { Component } from "react";
import OnlineIndicator from './OnlineIndicator'

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
        console.log('----' + JSON.stringify(this.props))
        return (<div>
                <h1>Put your option here ...</h1>
                {
                    this.props.voting.options.map(o => {
                        return (<OnlineIndicator key={o} text={o} online={o==this.state.selected} onClick={(evt) => this.onOptionClick(o)} />)
                    })
                }
            </div>)
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