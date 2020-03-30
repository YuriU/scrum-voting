import React, { Component } from "react";
import '../../styles/Option.css'

class Option extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <button className= {this.props.disabled ? "option disabledOption" : "option enabledOption"}  onClick={this.props.onClick}> 
                <div className="inner">{this.props.text}</div>
            </button> 
        );
    }
}

export default Option;