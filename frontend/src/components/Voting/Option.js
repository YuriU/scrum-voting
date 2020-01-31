import React, { Component } from "react";
import '../../styles/Option.css'

class Option extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="option" onClick={this.props.onClick}> 
                {this.props.text}
            </div> 
        );
    }
}

export default Option;