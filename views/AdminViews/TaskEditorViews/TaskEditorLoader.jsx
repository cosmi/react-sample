/** @jsx React.DOM */
'use strict';
var React = require('react');
var Router = require('react-router');
var _ = require('underscore');
var Router = require('react-router');
var t = require('../../../translate.js');
var app = require('../../../app.js');
var Model = require('../../../spine/Model.js');
var LoadingModal = require('../../../components/LoadingModal.jsx');
var InlineModal = require('../../../components/InlineModal.jsx');


var Exam = require('../../../model/Exam.js');
var User = require('../../../model/User.js');
var Result = require('../../../model/Result.js');

var Bootstrap = require('react-bootstrap');
var Modal = Bootstrap.Modal;

var TaskEditor = require('./TaskEditor.jsx');

var TaskEditorLoader = React.createClass({
  mixins: [Router.State],
  componentWillMount: function() {
    this.reload();
  },
  componentDidReceiveProps: function() {
    if((this.state.subtest && this.state.subtest.getId()) !== this.getParams().taskId) {
      this.reload();
    }
  },
  reload: function() {
    var subtest = new Subtest(this.getParams().taskId);
    this.setState({subtest: subtest});
    subtest.load(this.forceUpdate.bind(this, null));
  },
  render: function() {
    if(!this.state.subtest || this.state.subtest.getState() !== Model.States.LOADED) {
      return <LoadingModal/>;
    } else {
      return <TaskEditor subtest={this.state.subtest}/>
    }
  },
  
});

module.exports = TaskEditorLoader;

