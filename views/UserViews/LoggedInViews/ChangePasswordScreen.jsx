/** @jsx React.DOM */
'use strict';
var React = require('react');
var Router = require('react-router');

var app = require('../../../app.js');
var Background = require('../../../components/Background.jsx');
var t = require('../../../translate.js');
var Users = require('../../../model/Users.js');

var ChangePasswordScreen = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    this.setState({ error: undefined });
    Users.changeUserPassword(app.getCurrentUser().getId(), this.state.oldPassword, this.state.newPassword,
                             this.renderAlert.bind(null, t("Password changed")),
                             this.renderAlert, this.renderAlert);
  },
  getInitialState: function() {
    return {};
  },
  isValidForm: function() {
    return (
      this.state.newPassword &&
      this.passwordsMatch()
    );
  },
  passwordsMatch: function() {
    return this.state.newPassword === this.state.repeatedPassword;
  },
  saveInStateHandler: function(field, event) {
    var obj = {};
    obj[field] = event.target.value;
    this.setState(obj);
  },
  renderAlert: function(error) {
    this.setState({ error: error });
  },
  renderInput: function(fieldName, fieldDescription) {
    return (
      <div>
        <label className="sr-only" htmlFor={fieldName}>{fieldDescription}</label>
        <div className="input-group">
          <span className="input-group-addon">
            <span className="glyphicon glyphicon-certificate" aria-hidden="true"></span>
          </span>
          <input className="form-control" onChange={this.saveInStateHandler.bind(null, fieldName)} placeholder={fieldDescription} required={true} type="password"/>
        </div>
      </div>
    );
  },
  render: function() {
    var error = null;
    if(!this.passwordsMatch()) {
      error = <div className="alert alert-warning" role="alert">{t("Passwords do not match!")}</div>;
    } else if(this.state.error) {
      error = <div className="alert alert-warning" role="alert">{this.state.error}</div>;
    }
    var submitButton = null;
    if(this.isValidForm()) {
      submitButton = <button type="submit" className="btn btn-default">{t("Change password")}</button>;
    } else {
      submitButton = <button type="submit" className="btn btn-default disabled">{t("Change password")}</button>;
    }
    return (
      <div className="fullscreen">
        <Background/>
        {error}
        <div className="panel panel-default menu-panel">
          <div className="panel-heading">
            <h3 className="panel-title">{t("Change password")}</h3>
          </div>
          <div className="panel-body centered">
            <form onSubmit={this.handleSubmit}>
              {this.renderInput('oldPassword', t('Old password'))}
              {this.renderInput('newPassword', t('New password'))}
              {this.renderInput('repeatedPassword', t('Repeat password'))}
              {submitButton}
            </form>
            <br/>
            <Router.Link className="btn btn-default btn-block" to="menu">{t("Back to menu")}</Router.Link>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = ChangePasswordScreen;
