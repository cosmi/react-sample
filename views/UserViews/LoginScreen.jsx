/** @jsx React.DOM */
'use strict';
var React = require('react');
var t = require('../../translate.js');

var Background = require('../../components/Background.jsx');
var InfoModalComponent = require('../../components/InfoModalComponent.jsx');
var Users = require('../../model/Users.js');
var app = require('../../app.js');

var LoginScreen = React.createClass({
  getInitialState: function() {
    return {
      username: "",
      password: "",
      loading: false
    };
  },
  handleUsernameChange: function(event) {
    this.setState({ username: event.target.value });
  },
  handlePasswordChange: function(event) {
    this.setState({ password: event.target.value });
  },
  login: function(e) {
    this.setState({error:null, loading:true});
    Users.logIn(this.state.username, this.state.password, function(){}, function() {
      // jeżeli hasło jest złe, czyścimy
      this.setState({error: t("Incorrect username or password"), password: null,  loading:false});
    }.bind(this), function() {
      // jeżeli inny błąd, to nie czyścimy hasła
      this.setState({error: t("Database connection error"),  loading:false});
    }.bind(this));
    e.preventDefault(); 
  },
  logout: function(e) {
    e.preventDefault();
    Users.logOut();
  },
  renderLoginForm: function() {
    return (
      <form className="form-signin" onSubmit={this.login}>
        <h5 className="form-signin-heading centered">{t("Logging in")}</h5>
        <label className="sr-only" htmlFor="inputUsername">{t("Username")}</label>
        <div className="input-group">
          <span className="input-group-addon">
            <span className="glyphicon glyphicon-user" aria-hidden="true"></span>
          </span>
          <input autofocus={true} className="form-control" value={this.state.username} onChange={this.handleUsernameChange} placeholder={t("Username")} required={true}/>
        </div>
        <label className="sr-only" htmlFor="inputPassword">{t("Password")}</label>
        <div className="input-group">
          <span className="input-group-addon">
            <span className="glyphicon glyphicon-certificate" aria-hidden="true"></span>
          </span>
          <input className="form-control" value={this.state.password} onChange={this.handlePasswordChange} placeholder={t("Password")} required={true} type="password"/>
        </div>
        <button className="btn btn-lg btn-primary btn-block btn-confirm" type="submit">{t("Login")}</button>
      </form>
    );
  },
  renderLogoutForm: function() {
    return (
      <form className="form-signin" onSubmit={this.logout}>
        <h5 className="form-signin-heading centered">{t("Logged in as:")} {Users.currentLogin}.</h5>
        <button className="btn btn-lg btn-primary btn-block btn-confirm" type="submit">{t("Logout")}</button>
      </form>
    );
  },
  render: function() {
    if(this.state.loading) return <InfoModalComponent title={t("Logging in")} >{t("Please wait...")}</InfoModalComponent>;
    var error = null;
    if(this.state.error) {
      error = <div className="alert alert-danger" role="alert">{this.state.error}</div>;
    }
    return (
      <div className="fullscreen">
        <Background/>
        {error}
        <div className="container login-form">
          <div className="panel panel-default">
            <div className="panel-body">
              {app.getCurrentUser()?this.renderLogoutForm():this.renderLoginForm()}
              {/*<button className="btn btn-lg btn-primary btn-block btn-register" onClick={this.props.registerFunc}>{t("Register")}</button>*/}
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = LoginScreen;
