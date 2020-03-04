import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import Login from './Login';

class MainScreen extends Component {

    constructor(props) {
      super(props);

      this.state = {
        authenticated: false,
        userName: null,
        password: null
      };

      this.updateLoginState = this.updateLoginState.bind(this);
    }

    async componentDidMount() {
      await this.updateLoginState();
    }

    async logout() {
        await Auth.signOut();
        await this.updateLoginState();
    }

    async updateLoginState() {
      try {
        const currentSession = await Auth.currentSession();
        if(currentSession) {
          this.setState({
            authenticated: true
          })
        }
        else {
          this.setState({
            authenticated: false
          })
        }
      }
      catch(error) {
        this.setState({
          authenticated: false
        })
      }
    }

    render() {
      if(this.state.authenticated) {
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
          <button onClick={(evt) => this.logout()}>Logout</button>
        </div>)
      }
      else {
        return (<Login />)
      }
    }
}

export default MainScreen;