/** @jsx React.DOM */
'use strict';
var React = require('react');
var t = require('../translate.js');
var app = require('../app.js');

var Router = require('react-router'),
  RouteHandler = Router.RouteHandler;

var InfoModalComponent = require('../components/InfoModalComponent.jsx');  

var LoggedAsRoleWrapper = React.createClass({
  mixins: [Router.State],
  rolesAllowed: function() {
    var o = {};
    var roles = this.props.roles;
    for(var k in roles) {
      o[roles[k]] = true;
    }
    return o;
  },
  hasCorrectRole: function() {
    var roles = app.getCurrentUser().getRoles();
    var corr = this.rolesAllowed();
    for(var k in roles) {
      if(roles[k] in corr) return true;
    }
    return false;
  },
  render: function() {
    
    return (
      <div className="container">
      {this.hasCorrectRole()?
        <RouteHandler/>:
        <InfoModalComponent title={t("No permissions")}>
          {t("No permissions long")} <Router.Link to="menu">{t("Back")}</Router.Link>
        </InfoModalComponent>}
      </div>
    );
  }
});

module.exports = LoggedAsRoleWrapper;
