/** @jsx React.DOM */
'use strict';
var React = require('react');
var Router = require('react-router');
var t = require('../../../translate.js');

var MenuScreen = require("../../../components/IndexMenuView.jsx");

var Bootstrap = require('react-bootstrap');
var Glyphicon = Bootstrap.Glyphicon;

var ManageUsersScreen = React.createClass({
  render: function() {
    return (
      <MenuScreen returnTo='admin' title="Zarządzaj użytkownikami">
        <Router.Link className="btn btn-primary" to='admin-add-user'><Glyphicon glyph="plus"/> Dodaj użytkownika</Router.Link>
        <Router.Link className="btn btn-default" to='admin-remove-user'><Glyphicon glyph="remove"/> Usuń użytkownika</Router.Link>
        <Router.Link className="btn btn-default" to='admin-user-list'><Glyphicon glyph="list"/> Lista użytkowników</Router.Link>
      </MenuScreen>
    );
  }
});

module.exports = ManageUsersScreen;
