/** @jsx React.DOM */
'use strict';
var React = require('react');
var Router = require('react-router');
var t = require('../../../translate.js');
var _ = require('underscore');
var Users = require('../../../model/Users.js');


var RemoveUserScreen = React.createClass({
  componentWillMount: function() {
    this.reload();
  },
  getInitialState: function() {
    return {users: []};
  },
  onChange: function(event) {
    this.setState({ selectedUserId: event.target.value });
  },
  onSubmit: function(event) {
    Users.removeUserById(this.state.selectedUserId, this.reset);
  },
  reset: function() {
    this.replaceState(this.getInitialState());
    this.reload();
  },
  reload: function() {
    Users.getList(function(users) {
      users = _.filter(users, function(i) {
        return i.id.indexOf(Users.userPrefix) === 0;
      });
      this.setState({users: users});
    }.bind(this));
  },
  renderUserLabel:function(user) {
    return user.id.substr(Users.userPrefix.length);
  },
  render: function() {
    var usersList = [<option value="" key=""></option>];
    for (var i in this.state.users) {
      var user = this.state.users[i];
      var id = user.id;
      usersList.push(<option value={id} key={id} >{this.renderUserLabel(user)}</option>);
    }
    var removeUserButton = null;

    if (this.state.selectedUserId && this.state.selectedUserId.length > 0) {
      removeUserButton = <button className="btn btn-default" onClick={this.onSubmit} type="button">{t("Remove user")}</button>;
    } else {
      removeUserButton = <button className="btn btn-default disabled" type="button" disabled>{t("Remove user")}</button>;
    }
    return (
      <div className="fullscreen">
        <div className="panel panel-default menu-panel">
          <div className="panel-heading">
            <h3 className="panel-title">{t("Choose which user to remove")}</h3>
          </div>
          <div className="panel-body centered">
            <form onSubmit={this.handleSubmit}>
              <select className="form-control" onChange={this.onChange} value={this.state.selectedUserId}>
                {usersList}
              </select>
              {removeUserButton}
            </form>
            <br/>
            <Router.Link className="btn btn-default btn-block" to="admin-user-list">{t("Back to menu")}</Router.Link>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = RemoveUserScreen;
