/** @jsx React.DOM */
'use strict';
var React = require('react');
var Router = require('react-router');
var t = require('../../../translate.js');
var t = require('../../../app.js');
var _ = require('underscore')
var app = require('../../../app.js');
var Model = require('../../../spine/Model.js');

var Users = require('../../../model/Users.js');
var UserColl = require('../../../model/UserColl.js');
var app = require('../../../app.js');
var Model = require('../../../spine/Model.js');
var LoadingModal = require('../../../components/LoadingModal.jsx');
var InlineModal = require('../../../components/InlineModal.jsx');

var reactListener = require('../../../spine/reactListener.js');

var Exam = require('../../../model/Exam.js');
var User = require('../../../model/User.js');
var Result = require('../../../model/Result.js');

var Bootstrap = require('react-bootstrap');
var Modal = Bootstrap.Modal;

var ItemList = require("../../../components/ItemList.jsx");

var UserListScreen = React.createClass({
  propTypes: {
    users: React.PropTypes.instanceOf(UserColl).isRequired
  },
  mixins: [reactListener('users')],
  renderRow: function(user) {
    return [user.getLabel()];
  },
  getInitialState: function() {
    return {
      mode: 'students',
    }
  },
  handleRemove: function(item) {
    item.destroy(function(){
      this.props.users.removeRow(item.getId());
      this.reload();
    }.bind(this));
  },
  renderActions: function(item){
    return (
      <div>
      <Router.Link className="btn btn-default" to="admin-user-details" params={{userId: item.getId()}}>
        Szczegóły
      </Router.Link>
      <Router.Link className="btn btn-default" to="admin-edit-user" params={{userId: item.getId()}}>
        Edycja
      </Router.Link>
      <button className="btn btn-danger" onClick={this.handleRemove.bind(this, item)}>
        Usuń
      </button>
      </div>
    );
  },
  setMode: function(mode) {
    this.setState({mode: mode});
  },
  renderButtons: function(){
    var mode = this.state.mode;
    return (
      <div className="btn-group btn-group-justified" role="group" aria-label="...">
        <div className="btn-group" role="group">
          <button type="button" onClick={this.setMode.bind(this, 'students')} 
            className={"btn btn-" + (mode==='students'?'primary':'default')}>Twoi podopieczni</button>
        </div>
        <div className="btn-group" role="group">
          <button type="button" onClick={this.setMode.bind(this, 'admins')} 
            className={"btn btn-" + (mode==='admins'?'primary':'default')}>Administratorzy</button>
        </div>
        <div className="btn-group" role="group">
          <button type="button" onClick={this.setMode.bind(this, 'all')} 
          className={"btn btn-" + (mode==='all'?'primary':'default')}>Wszyscy</button>
        </div>
      </div>
    )
  },
  reload: function() {
    this.props.exams.load();
  },
  getShownUsers: function() {
    var users = this.props.users.getAllRows();
    var filter;
    switch(this.state.mode) {
      case 'admins':
        filter = function(user) {
          return 'admin' === user.getRole();
        }
        break;
      case 'students':
        filter = function(user) {
          return app.getCurrentUser().getId() === user.getModerator();
        }
        break;
    }
    if(filter) {
      return _.filter(users, filter);
    } else {
      return users;
    }
  },
  render: function() {
    var footer = [
      <Router.Link key={1} className="btn btn-default" to='admin'>Powrót</Router.Link>,
      <Router.Link key={2} className="btn btn-primary" to='admin-add-user'>Stwórz nowego użytkownika</Router.Link>
    ];
    return (
      <InlineModal title="Lista użytkowników" footer={footer}>
        <Router.Link className="btn btn-primary btn-block" to='admin-add-user'>Stwórz nowego użytkownika</Router.Link>
        {this.renderButtons()}
        <ItemList items={this.getShownUsers()} actions={this.renderActions}
          itemRenderer={this.renderRow}/>
      </InlineModal>
    );
  }
});




var UserListScreenWrapper = React.createClass({
  mixins: [Router.State],
  getInitialState: function() {
    return {};
  },
  componentWillMount: function() {
    this.reload();
  },
  reload: function() {
    var users = new UserColl();
    users.load(function() {
      this.setState({users:users});
    }.bind(this));
  },
 
  renderLoadingModal: function() {
    return <LoadingModal />
  },
  render: function() {
    if(!this.state.users || this.state.users.getState() !== Model.States.LOADED) {
     
      return this.renderLoadingModal();
    }
    return (
      <UserListScreen
        users={this.state.users}/>
    );
  }
  
});
module.exports = UserListScreenWrapper;
