import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Auth } from 'aws-amplify';

class MainScreen extends Component {

    constructor(props) {
      super(props);

      this.state = {
        authenticated: false
      };
    }


    async componentDidMount() {
      try{
        const currentSession = await Auth.currentSession();
        console.log(currentSession);
        if(currentSession) {
          this.setState({
            authenticated: true
          })
        }
      }
      catch(err){
        console.log(err)
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
        </div>)
      }
      else {
        return (<div>Login please</div>)
      }
    }
}

export default MainScreen;