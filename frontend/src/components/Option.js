import React, { Component } from "react";
import '../styles/Option.css';

class Option extends Component {

    constructor(props) {
        super(props);
        this.processClick = this.processClick.bind(this);
        this.state = {
            flipped: false
        }
    }

    processClick(evt) {
        this.setState({
            flipped: !this.state.flipped
        })
    }

    render() {
        return (
            <div className="flipCard"> 
                <div className= {this.state.flipped ? "card flipped" : "card" }  onClick={(evt) => this.processClick(evt)}> 
                    <div className="side front">{this.props.value}</div> 
                    <div className="side back">Done</div> 
                </div> 
            </div> 
        );
    }
}

export default Option;