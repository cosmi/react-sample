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
var TaskEditorNewWrapper = React.createClass({
  mixins: [Router.State],
  
  render: function() {
    return <TaskEditor testId={this.getParams().testId}/>;
  },
  
});

module.exports = TaskEditorNewWrapper;

