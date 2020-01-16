import React, { Component } from "react";
import '../styles/OnlineIndicator.css';

class OnlineIndicator extends Component 
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
            return (<div className="onlineStatus"> 
                <div className= "card"> 
                    <div className= {this.props.online ? "indicator online" : "indicator offline"} onClick={this.onclick} >{this.props.text}</div> 
                </div> 
            </div> )
    }
}

export default OnlineIndicator;