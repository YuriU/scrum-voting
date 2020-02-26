import React, { Component } from "react";
import { Link } from "react-router-dom";
class MainScreen extends Component {

    render() {
        return (<div>
            <nav>
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/startSession">Start Session</Link>
                </li>
                <li>
                  <Link to="/session">Session</Link>
                </li>
              </ul>
            </nav>
          </div>)
    }
}

export default MainScreen;