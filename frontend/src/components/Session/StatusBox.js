import React, { Component } from "react";
import '../../styles/SessionScreen.css';

class StatusBox extends Component 
{
    constructor(props) {
        super(props)

        this.onclick = this.onclick.bind(this);
    }

    onclick(){
        let onClick = this.props.onClick;
        if(onClick){
            onClick();
        }
    }

    render() {
        return (<div className="statusBox"> 
                    <div className= {this.props.online ? "indicator online" : "indicator offline"} onClick={this.onclick} >{this.props.text}</div> 
                </div>)
    }
}

export default StatusBox;