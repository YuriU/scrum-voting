import React, { Component } from "react";
import UserInput from './UserInput'
import _ from 'lodash';

class CreateSession extends Component {

    constructor(props) {
        super(props)

        this.onCreateSession = props.onCreateSession;

        this.state = {
            lastAddedUserId: 1 ,
            itemsToAdd: []
        }

        for(let i = 1; i <= 10; i++){
            this.state.itemsToAdd.push({ userId : `${this.state.lastAddedUserId++}`, alias: `u${i}`, name: `User ${i}` });
        }
        
        this.addUser = this.addUser.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
        this.startSession = this.startSession.bind(this);
    }

    addUser(){
        this.setState({
            itemsToAdd: this.state.itemsToAdd.concat({
                userId: `${this.state.lastAddedUserId++}`,
            })
        });
    }

    deleteUser(userId) {
        console.log(userId);
        this.setState({
            itemsToAdd: _.remove(this.state.itemsToAdd, (item) => item.userId != userId)
        });        
    }

    startSession(){
        this.onCreateSession(this.state.itemsToAdd);
    }

    render() {
        return (<div>
            <h1>Select participants:</h1>
            <ul>
                {this.state.itemsToAdd.map((item, index) => {
                    return (<UserInput key={item.userId} item={item} deleteUser={this.deleteUser}></UserInput>)
                })}
            </ul>
            <button onClick={this.addUser}>Add</button>
            <button onClick={this.startSession}>Start</button>
        </div>)
    }
}

export default CreateSession;