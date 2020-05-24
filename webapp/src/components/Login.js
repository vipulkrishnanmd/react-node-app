import { Link } from "react-router-dom";
import ListErrors from "./ListErrors";
import React from "react";
import agent from "../agent";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { LOGIN, LOGIN_PAGE_UNLOADED } from "../constants/actionTypes";

const mapStateToProps = (state) => ({ ...state.auth });

const mapDispatchToProps = (dispatch) => ({
  onSubmit: (username, password) => {
    const payload = agent.Auth.login(username, password);
    dispatch({ type: LOGIN, payload });
  },
  onUnload: () => dispatch({ type: LOGIN_PAGE_UNLOADED }),
});

class Login extends React.Component {
  state = {};
  constructor() {
    super();
    this.changePassword = (ev) =>
      this.setState({ ...this.state, password: ev.target.value });
    this.changeUsername = (ev) =>
      this.setState({ ...this.state, username: ev.target.value });
    this.submitForm = (username, password) => (ev) => {
      ev.preventDefault();
      this.props.onSubmit(username, password);
    };
  }

  render() {
    const password = this.state.password;
    const username = this.state.username;

    return (
      <div className="auth-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Sign in</h1>
              <p className="text-xs-center">
                <Link to="/register">Don't Have an account?</Link>
              </p>

              <ListErrors errors={this.props.errors} />

              <form onSubmit={this.submitForm(username, password)}>
                <fieldset>
                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="text"
                      placeholder="Username"
                      value={this.state.username || ""}
                      onChange={this.changeUsername}
                    />
                  </fieldset>

                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="password"
                      placeholder="Password"
                      value={this.state.password || ""}
                      onChange={this.changePassword}
                    />
                  </fieldset>

                  <button
                    className="btn btn-lg btn-primary pull-xs-right"
                    type="submit"
                    disabled={this.props.inProgress}
                  >
                    Login
                  </button>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
