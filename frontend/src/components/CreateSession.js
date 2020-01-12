import React, { Component } from "react";
import UserInput from './UserInput'

class CreateSession extends Component {

    constructor(props) {
        super(props)

        this.state = {
            itemsToAdd: ["Hello", "World", "Here"]
        }

        this.addUser = this.addUser.bind(this);
    }

    addUser(){
        this.state.itemsToAdd.push('Hello');
        this.setState({
            itemsToAdd: this.state.itemsToAdd
        });
    }

    startSession(){
        
    }

    render() {
        return (<div>
            <h1>Here is the list</h1>
            <ul>
                {this.state.itemsToAdd.map((item, index) => {
                    return (<UserInput key={index}>{item}</UserInput>)
                })}
            </ul>
            <button onClick={this.addUser}>Add</button>
            <button onClick={this.startSession}>Start</button>
        </div>)
    }
}

export default CreateSession;