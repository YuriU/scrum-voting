import React, { Component } from "react";
import '../../styles/Option.css'

class Option extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="option" onClick={this.props.onClick}> 
                <div className="inner">{this.props.text}</div>
            </div> 
        );
    }
}

export default Option;