import React, { Component } from "react";

class UserInput extends Component {
    constructor(props) {
        super(props)

        console.log(props)
        this.state = {
            //key: props.key,
            item: props.item,
            deleteUser: props.deleteUser
        }
    }

    render(){
        return (
        <div>
            <label>Alias: <input type="text" value={this.props.item.alias}></input></label>
            <label>Name: <input type="text" value={this.props.item.name}></input></label>
            <button onClick={(evt) => this.state.deleteUser(this.state.item.id)}>Delete</button>
        </div>)
    }
}

export default UserInput;