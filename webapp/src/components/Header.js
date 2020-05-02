import React from "react";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { LOGOUT } from "../constants/actionTypes";

const mapStateToProps = (state) => ({ ...state.common });
const mapDispatchToProps = (dispatch) => ({
  onClickLogout: () => {
    console.log("reaching here");
    return dispatch({ type: LOGOUT });
  },
});

const LoggedOutView = (props) => {
  if (!props.currentUser) {
    return (
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link to="/" className="nav-link">
            Home
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/login" eventkey="1" className="nav-link">
            Sign in
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/register" eventkey="2" className="nav-link">
            Sign up
          </Link>
        </li>
      </ul>
    );
  }
  return null;
};

const LoggedInView = (props) => {
  if (props.currentUser) {
    return (
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link to="/" className="nav-link">
            Home
          </Link>
        </li>
        <li className="nav-item">
          <Link to="#" onClick={props.onClickLogout} className="nav-link">
            Logout
          </Link>
        </li>
      </ul>
    );
  }

  return null;
};

class Header extends React.Component {
  render() {
    console.log(this.props);
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-5">
        <Link to="/" className="navbar-brand">
          {this.props.appName.toLowerCase()}
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <LoggedOutView {...this.props} />
          <LoggedInView {...this.props} />
        </div>
      </nav>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
