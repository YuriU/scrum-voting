import React, { Component } from "react";

class UserInput extends Component {
    constructor(props) {
        super(props)

        console.log(props)

        this.state = {
            item: props.item,
            deleteUser: props.deleteUser
        }

        this.handleChangeName = this.handleChangeName.bind(this);
    }

    handleChangeName(event){
        this.state.item.name = event.target.value;
        this.setState(this.state);
    }

    render(){
        return (
        <div>
            <label>Name: <input type="text" value={this.props.item.name} onChange={this.handleChangeName}></input></label>
            <button onClick={(evt) => this.state.deleteUser(this.state.item.userId)}>Delete</button>
        </div>)
    }
}

export default UserInput;