import React, { Component } from "react";
import UserInput from './UserInput'
import _ from 'lodash';

class CreateSession extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (<h1>Hello from session {this.props.sessionId}</h1>)
    }
}