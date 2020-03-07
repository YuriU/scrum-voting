import React, { Component } from 'react';
import { Auth } from 'aws-amplify';

class Login extends Component {

    constructor(props) {
        super(props);
  
        this.state = {
          userName: null,
          password: null,
          message: null
        };
  
        this.login = this.login.bind(this);
        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.clearMessage = this.clearMessage.bind(this);
    }

    async login() {
      try 
      {
        const user = await Auth.signIn(this.state.userName, this.state.password);
        console.log(user)
        await this.props.updateLoginState();
        if(user.username) {
            this.props.history.push('/');
        }
      }
      catch (err) 
      {
        if (err.code === 'UserNotConfirmedException') {
            // The error happens if the user didn't finish the confirmation step when signing up
            // In this case you need to resend the code and confirm the user
            // About how to resend the code and confirm the user, please check the signUp part
            this.setState({
              message: 'User is not confirmed'
            })
        } else if (err.code === 'PasswordResetRequiredException') {
            // The error happens when the password is reset in the Cognito console
            // In this case you need to call forgotPassword to reset the password
            // Please check the Forgot Password part.
            this.setState({
              message: 'Password reset is required'
            })
        } else if (err.code === 'NotAuthorizedException') {
            // The error happens when the incorrect password is provided
            this.setState({
              message: 'Invalid login or password'
            })
        } else if (err.code === 'UserNotFoundException') {
            // The error happens when the supplied username/email does not exist in the Cognito user pool
            this.setState({
              message: 'Invalid login or password'
            })
        } else {
          this.setState({
            message: err
          })
        }
      }
    }

    handleChangeName(event){
        this.setState({
          userName: event.target.value
        });
    }
  
    handleChangePassword(event){
      this.setState({
        password: event.target.value
      });
    }

    clearMessage(event){
      this.setState({
        message: undefined
      })
    }

    render() {
        return (<div className="loginScreen" >
            <div className="loginformContainer">
              {this.state.message && <div className ="errorBox">
                {this.state.message}
                <button onClick={this.clearMessage}>&times;</button>
              </div>}
              <div className="loginBox">
                <div>
                    <label><b>UserName:</b><input type="text" onChange={this.handleChangeName}></input></label>
                </div>
                <div>
                <label><b>Password:</b><input type="password" onChange={this.handleChangePassword}></input></label>
                </div>
                    <button onClick={(evt) => this.login()}>Login</button>
                </div>
            </div>
          </div>)
    }
}

export default Login;