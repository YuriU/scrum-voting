import React, { Component } from "react";
import UserInput from './UserInput'
import _ from 'lodash';

class CreateSession extends Component {

    constructor(props) {
        super(props)

        this.state = {
            lastAddedUser: 1 ,
            itemsToAdd: []
        }

        this.state.itemsToAdd.push({ id : this.state.lastAddedUser++, alias: "u1", name: "User 1" });
        this.state.itemsToAdd.push({ id : this.state.lastAddedUser++, alias: "u2", name: "User 2" });
        this.state.itemsToAdd.push({ id : this.state.lastAddedUser++, alias: "u3", name: "User 3" });       

        this.addUser = this.addUser.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
    }

    addUser(){
        this.setState({
            itemsToAdd: this.state.itemsToAdd.concat({
                id: this.state.lastAddedUser++,
            })
        });
    }

    deleteUser(key) {
        console.log(key);
        this.setState({
            itemsToAdd: _.remove(this.state.itemsToAdd, (item) => item.id != key)
        });        
    }

    startSession(){
        
    }

    render() {
        return (<div>
            <h1>Here is the list</h1>
            <ul>
                {this.state.itemsToAdd.map((item, index) => {
                    return (<UserInput key={item.id} item={item} deleteUser={this.deleteUser}></UserInput>)
                })}
            </ul>
            <button onClick={this.addUser}>Add</button>
            <button onClick={this.startSession}>Start</button>
        </div>)
    }
}

export default CreateSession;