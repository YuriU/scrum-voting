import React, { Component } from "react";
import '../../styles/OnlineIndicatorMobile.css';

class OnlineIndicatorMobile extends Component 
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
            return (<div className="mobileBar"> 
                <div className= "card"> 
                    <div className= {this.props.online ? "indicator online" : "indicator offline"} onClick={this.onclick} >{this.props.text}</div> 
                </div> 
            </div> )
    }
}

export default OnlineIndicatorMobile;