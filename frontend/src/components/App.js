import React, { Component } from "react";
import CreateSession from './EditSession/CreateSession'
import SessionScreen from './Session/SessionScreen'
import VotingScreen from './Voting/VotingScreen'
import '../styles/App.css';
import { getAllUrlParams } from '../utils/urlutils'
import { createBrowserHistory } from "history";
import HttpClient from '../api/httpclient'
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

        this.httpClient = new HttpClient();
        this.onCreateSession = this.onCreateSession.bind(this);
        this.getSessionUsers = this.getSessionUsers.bind(this);
        this.history = createBrowserHistory();
    }

    async onCreateSession(items) {
        const result = await this.httpClient.startSession(items);
        console.log(result.SessionId);
        this.history.push('/session/' + result.SessionId)        
    }

    async getSessionUsers(sessionId) {
      const result = await this.httpClient.getSession(sessionId);
      return result;
    }

    render() {
      let urlParams = getAllUrlParams();
        return (
            <Router history={this.history}>
              <Switch>
                <Route path="/startSession">
                  <CreateSession onCreateSession={this.onCreateSession}/>
                </Route>
                <Route path="/session/:sessionId" render={
                  ({match}) => (
                    <SessionScreen getSessionUsers={this.getSessionUsers} httpClient={this.httpClient} sessionId={match.params.sessionId} />
                  )
                }>
                </Route>
                <Route path="/vote/:sessionId/:userId" render={
                  ({match}) => (
                      <VotingScreen sessionId={match.params.sessionId} userId={match.params.userId} />
                  )
                }>  
                </Route>
                <Route path="/">
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
                </Route>
              </Switch>
            </Router>
        );
    }   
}

export default App;