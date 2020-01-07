import React, { Component } from "react";
import Option from './Option'
import FullScreenSwitch from './FullscreenSwitch'
import '../styles/App.css';

class App extends Component {
    render() {
        return (
            <div>
                <FullScreenSwitch />
                <h1>My React App!</h1>
                <Option value="3" />
                <Option value="5" />
            </div>
        );
    }
}

export default App;