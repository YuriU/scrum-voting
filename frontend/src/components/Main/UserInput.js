import React, { Component } from "react";

class UserInput extends Component {
    constructor(props) {
        super(props)
        this.state = {
            item: props.item,
            deleteUser: props.deleteUser
        }

        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleChangeAlias = this.handleChangeAlias.bind(this);
    }

    handleChangeName(event){
        this.state.item.name = event.target.value;
        this.setState(this.state);
    }

    handleChangeAlias(event){
        this.state.item.alias = event.target.value;
        this.setState(this.state);
    }

    render(){
        return (
        <div>
            <label>Alias: <input type="text" value={this.props.item.alias} onChange={this.handleChangeAlias}></input></label>
            <label>Name: <input type="text" value={this.props.item.name} onChange={this.handleChangeName}></input></label>
            <button onClick={(evt) => this.state.deleteUser(this.state.item.userId)}>Delete</button>
        </div>)
    }
}

export default UserInput;