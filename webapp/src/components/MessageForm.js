import React from "react";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { SEND_MESSAGE } from "../constants/actionTypes";
import agent from '../agent';

const mapStateToProps = (state) => {
  return state;
};

const mapDispatchToProps = (dispatch) => ({
  onSubmit: (email, message) => dispatch({type: SEND_MESSAGE, payload: agent.Message.send(email, message)})
})

class MessageForm extends React.Component {
  state = {
    messageSent : false
  }
  constructor() {
    super();
    this.emailChanges = (ev) =>
      this.setState({ ...this.state, email: ev.target.value });
    this.messageChanges = (ev) =>
      this.setState({ ...this.state, message: ev.target.value });
    this.submitForm = (email, message) => (ev) => {
        ev.preventDefault();
        this.props.onSubmit(email, message);
        this.setState({...this.state, messageSent: true})
    };
    this.showForm = (ev) => this.setState({...this.state, messageSent: false});
  }
  render() {
    const email = this.state.email;
    const message = this.state.message;
    if (!this.props.common.currentUser) {
      return (
        <Redirect
          to={{
            pathname: "/login",
          }}
        />
      );
    }
    if(this.state.messageSent) {
      return (
        <div className="Container mx-auto pt-5" style={{ width: "70%" }}>
          Message sent! <br/>
          <button className="btn btn-info mt-2" onClick={this.showForm}>
            Back
          </button>
        </div>
      )
    }
    return (
      <div className="Container mx-auto pt-5" style={{ width: "70%" }}>
        <form onSubmit={this.submitForm(email, message)}>
        <div className="form-group">
          <label htmlFor="usr">Email:</label>
          <input
            type="text"
            className="form-control"
            id="usr"
            value={this.state.email || ''}
            onChange={this.emailChanges}
          ></input>
          <label htmlFor="comment" className="mt-2">
            Message:
          </label>
          <textarea
            className="form-control"
            rows="5"
            id="comment"
            value={this.state.message || ''}
            onChange={this.messageChanges}
          ></textarea>
          <button className="btn btn-info mt-2" type="submit">
            Send
          </button>
        </div>
        </form>
      </div>
    );
  }
}

export default withRouter(
  withRouter(connect(mapStateToProps, mapDispatchToProps)(MessageForm))
);
