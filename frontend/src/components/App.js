import React, { Component } from "react";
import Option from './Option'

import '../styles/App.css';

class App extends Component {
    render() {
        return (
            <div>
                <h1>My React App!</h1>
                <Option />
                <Option />
            </div>
        );
    }
}

export default App;