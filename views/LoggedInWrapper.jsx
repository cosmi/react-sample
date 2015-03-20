/** @jsx React.DOM */
'use strict';
var React = require('react');
var t = require('../translate.js');
var app = require('../app.js');

var Router = require('react-router'),
  RouteHandler = Router.RouteHandler;
var reactListener = require('../spine/reactListener.js');
var LoginScreen = require('./UserViews/LoginScreen.jsx');
var LoggedInWrapper = React.createClass({
  mixins: [reactListener(app)],
  isLoggedIn: function() {
    return app.getCurrentUser();
  },
  // componentDidMount: function() {
  //   if(!this.isLoggedIn()){
  //     app.navigateToLogin();
  //   }
  // },
  render: function() {
    
    return (
      <div className="container">
      {this.isLoggedIn()?<RouteHandler/>:<LoginScreen noRedirect={true}/>}
      </div>
    );
  }
});

module.exports = LoggedInWrapper;
