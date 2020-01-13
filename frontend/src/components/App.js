import React, { Component } from "react";
import Option from './Option'
import CreateSession from './CreateSession'
import Session from './Session'
import FullScreenSwitch from './FullscreenSwitch'
import '../styles/App.css';
import { getAllUrlParams } from '../utils/urlutils'
import { createBrowserHistory } from "history";
import {
    Router as Router,
    Switch,
    Route,
    Link
  } 
  from "react-router-dom";


class App extends Component {

    constructor(props) {
        super(props)
        this.urlParams = getAllUrlParams();

        console.log(JSON.stringify(this.props.config))

        this.BackendHttpEndpoint = this.props.config.BackendHttpEndpoint;
        this.BackendWebSocketEndpoint = this.props.config.BackendWebSocketEndpoint;

        this.onCreateSession = this.onCreateSession.bind(this);
        this.history = createBrowserHistory();
    }

    async onCreateSession(items) {
        var url = this.BackendHttpEndpoint + '/startSession';
        console.log(url)

        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
              },
            body: JSON.stringify(items)
        })

        let result = await response.json();
        console.log(result.SessionId);
        this.history.push('/session/' + result.SessionId)        
    }

    render() {
        return (
            <Router history={this.history}>
              <div>
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
              </div>
              <Switch>
                <Route path="/startSession">
                  <CreateSession onCreateSession={this.onCreateSession}/>
                </Route>
                <Route path="/session/:sessionId" render={
                    ({match}) => (
                      <Session sessionId={match.params.sessionId}/>
                    )
                } />
                <Route path="/">
                  <h1>Hello</h1>
                </Route>
              </Switch>
            </Router>
            /*{<div>
                <FullScreenSwitch />
                <h1>My React App!</h1>
                
                <Option value="3" />
                <Option value="5" />
            </div>}*/
        );
    }

    
}

export default App;