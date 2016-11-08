import React from 'react';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { browserHistory } from 'react-router';
import cookie from 'react-cookie';
import globalStyles from '../styles.css';


const styles = {
  loginContainer: {
    minWidth: 320,
    maxWidth: 400,
    height: 'auto',
    position: 'absolute',
    top: '20%',
    left: 0,
    right: 0,
    margin: 'auto'
  },
  paper: {
    padding: 20,
    overflow: 'auto'
  },

  textHead: {
    fontSize: "35px",
    paddingBottom: "15px",
    textAlign: "center"
  }

};

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
    };

    this.handleLogin = this.handleLogin.bind(this);
  }


  handleLogin() {

    if (this.state.username == "" || this.state.password == "") {
      alert("Please fill all fields");
    } else {

      $.post('/api/login', {
        username: this.state.username,
        password: this.state.password
      }).
        success((res) => {
          // console.log(res)
          cookie.save('user', res, { path: '/' });
          browserHistory.push("/app/");

        })
        .error((err) => {
          // console.log("Error", err)
          if (err.readyState == 0) {
            alert("Server unreachable")
          } else {
            alert("Invalid username/password combination. Try again")
          }
        });
    }
  }


  handleUsernameInput(event) {
    this.setState({
      username: event.target.value
    });
    event.preventDefault();
  }

  handlePasswordInput(event) {
    this.setState({
      password: event.target.value
    });
    event.preventDefault();
  }

  render() {
    return (
      <div  >
        <div style={styles.loginContainer}>
          <h1 style={styles.textHead}>AppBundler LogIn   </h1>
          <Paper style={styles.paper}>

            <form>
              <TextField
                hintText="Username"
                floatingLabelText="Username"
                fullWidth={true}
                value={this.state.username}
                onChange={this.handleUsernameInput.bind(this) } />
              <TextField
                hintText="Password"
                floatingLabelText="Password"
                fullWidth={true}
                type="password"
                value={this.state.password}
                onChange={this.handlePasswordInput.bind(this) }/>

              <div>
                <RaisedButton label="Login"
                  primary={true}
                  style={styles.loginBtn}
                  onClick={this.handleLogin}/>
              </div>

            </form>
          </Paper>
        </div >
      </div >
    );
  }
}


export default LoginPage;
