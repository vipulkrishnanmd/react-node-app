//import agent from '../agent';
import Header from "./Header";
import React from "react";
import { connect } from "react-redux";
import { APP_LOAD, REDIRECT } from "../constants/actionTypes";
import { Redirect, Switch, Route } from "react-router-dom";
import Register from "./Register";
import { withRouter } from "react-router";
import agent from "../agent";
import Login from "./Login";
import MessageForm from "./MessageForm";

const mapStateToProps = (state) => {
  return {
    appLoaded: state.common.appLoaded,
    appName: state.common.appName,
    currentUser: state.common.currentUser,
    redirectTo: state.common.redirectTo,
  };
};

const mapDispatchToProps = (dispatch) => ({
  onLoad: (payload, token) =>
    dispatch({ type: APP_LOAD, payload, token, skipTracking: true }),
  onRedirect: () => dispatch({ type: REDIRECT }),
});

class App extends React.Component {
  componentDidMount() {
    const token = window.localStorage.getItem("jwt");
    const username = window.localStorage.getItem("username");
    if (token) {
      agent.setToken(token);
      agent.setUsername(username);
    }
    this.props.onLoad(token ? agent.Auth.current() : null, token);
  }

  render() {
    if (this.props.redirectTo) {
      this.props.onRedirect();
      return (
        <Redirect
          to={{
            pathname: this.props.redirectTo,
          }}
        />
      );
    }
    if (this.props.appLoaded) {
      return (
        <div>
          <Header />
          <Switch>
            <Route exact path="/" component={MessageForm} />
            <Route path="/register" component={Register} />
            <Route path="/login" component={Login} />
          </Switch>
        </div>
      );
    }
    return (
      <div>
        <Header />
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
