/** @jsx React.DOM */
'use strict';
var React = require('react');
var t = require('../../translate.js');

var $ = require('../../vendor/jquery.js');
var BirthdayPicker = require('birthday-picker');

var Background = require('../../components/Background.jsx');

var RegisterScreen = React.createClass({
  propTypes: {
    onSubmit: React.PropTypes.func.isRequired,
    error: React.PropTypes.bool
  },
  getInitialState: function() {
    return {};
  },
  componentDidMount: function() {
    $(this.refs.birthdayPicker.getDOMNode()).birthdaypicker({
      dateFormat: 'littleEndian',
    });
  },
  birthdayChangeHandler: function(event) {
    this.saveInStateHandler(event.target.name, event);
  },
  saveInStateHandler: function(field, event) {
    var obj = {};
    obj[field] = event.target.value;
    this.setState(obj);
  },
  handleSubmit: function(e) {
    e.preventDefault();
    this.props.onSubmit(
      this.state.username,
      this.state.password,
      this.state.name,
      this.state.gender,
      new Date(this.state['birth[year]'], this.state['birth[month]'] - 1, this.state['birth[day]']));
  },
  passwordsMatch: function() {
    return this.state.password === this.state.secondPassword;
  },
  isValidForm: function() {
    return (
      this.state.username &&
      this.state.password &&
      this.state.name &&
      this.state.gender &&
      this.state['birth[day]'] &&
      this.state['birth[month]'] &&
      this.state['birth[year]'] &&
      this.passwordsMatch()
    );
  },
  renderInput: function(fieldName, fieldDescription, autofocus, typePassword) {
    return (
      <div>
        <label className="sr-only" htmlFor={fieldName}>{fieldDescription}</label>
        <div className="input-group">
          <span className="input-group-addon">
            <span className={"glyphicon" + (typePassword ? ' glyphicon-certificate' : ' glyphicon-user')} aria-hidden="true"></span>
          </span>
          <input autofocus={autofocus} className="form-control" onChange={this.saveInStateHandler.bind(null, fieldName)} placeholder={fieldDescription} required={true} type={typePassword ? 'password' : ''}/>
        </div>
      </div>
    );
  },
  render: function() {
    var error = null;
    if(this.props.error) {
      error = <div className="alert alert-danger" role="alert">{t("Such user already exists!")}</div>;
    }
    var passwordsMatchError = null;
    if(!this.passwordsMatch()) {
      passwordsMatchError = <div className="alert alert-warning" role="alert">{t("Passwords do not match!")}</div>;
    }
    var registerButton = null;
    if(this.isValidForm()) {
      registerButton = <button type="submit" className="btn btn-lg btn-primary btn-block btn-register">{t("Register")}</button>;
    } else {
      registerButton = <button type="submit" className="btn btn-lg btn-primary btn-block btn-register disabled">{t("Register")}</button>;
    }
    return (
      <div className="fullscreen">
        <Background/>
        {error}
        {passwordsMatchError}
        <div className="container login-form">
          <div className="panel panel-default">
            <div className="panel-body">
              <form className="form-signin" onSubmit={this.handleSubmit}>
                <h5 className="form-signin-heading centered">{t("Registration")}</h5>
                {this.renderInput('username', t('Username'), true, false)}
                {this.renderInput('name', t('Firstname and lastname'), false, false)}
                {this.renderInput('password', t('Password'), false, true)}
                {this.renderInput('secondPassword', t('Repeat password'), false, true)}
                <div className="btn-group gender-btn-group" data-toogle="buttons">
                  <label className="btn btn-default gender-btn">
                    <input type="radio" name="gender" value="M" onChange={this.saveInStateHandler.bind(null, 'gender')}/> {t("Male")}
                  </label>
                  <label className="btn btn-default gender-btn">
                    <input type="radio" name="gender" value="F" onChange={this.saveInStateHandler.bind(null, 'gender')}/> {t("Female")}
                  </label>
                </div>
                <div className="picker birthday-picker centered" ref="birthdayPicker" onInput={this.birthdayChangeHandler}></div>
                {registerButton}
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = RegisterScreen;
