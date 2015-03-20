/** @jsx React.DOM */
'use strict';
var React = require('react');
var Router = require('react-router');
var t = require('../../translate.js');
var app = require('../../app.js');

var MenuScreen = require("../../components/IndexMenuView.jsx");

var AdminMenuScreen = React.createClass({
  isAdmin: function() {
    return app.hasRole('admin');
  },
  render: function() {
    var message = null;
    var admin = this.isAdmin();
    return (
      <MenuScreen returnTo="menu" title="Panel administracyjny">
        <Router.Link className="btn btn-default" to='admin-user-list'>Zarządzaj użytkownikami</Router.Link>
        {admin && <Router.Link className="btn btn-default" to='task-editor'>Zarządzaj zadaniami</Router.Link>}
        {admin && <Router.Link className="btn btn-default" to='exam-list'>Zarządzaj egzaminami</Router.Link>}
      </MenuScreen>
    );
  }
});

module.exports = AdminMenuScreen;
