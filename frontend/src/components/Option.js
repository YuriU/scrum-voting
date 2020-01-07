import React, { Component } from "react";
import '../styles/Option.css';

class Option extends React.Component {

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
                    <div className="side front">Keyword</div> 
                    <div className="side back">Definition<br/>Explanation</div> 
                </div> 
            </div> 
        );
    }
}

export default Option;