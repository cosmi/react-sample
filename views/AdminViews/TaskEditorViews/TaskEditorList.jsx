/** @jsx React.DOM */
'use strict';
var React = require('react');
var Bootstrap = require('react-bootstrap');
var Router = require('react-router');
var _ = require('underscore');

var app = require('../../../app.js');
var ItemListView = require("../../../components/ItemListView.jsx");
var reactListener = require("../../../spine/reactListener.js");
var Subtests = require('../../../model/Subtests.js');
var t = require('../../../translate.js');

var TaskEditorList = React.createClass({
  mixins: [reactListener('subtests')],
  getTestId: function() {
    return this.props.testId;
  },
  getActions: function() {
    return [
      {
        getLabel: function(item) {return "Usuń"},
        handleClick: function(item) {
          var callback =function(){};
          item.remove(callback, callback, callback);
        }
      }
    ];
  },
  renderItem: function(item) {
    return item.getLabel();
  },
  render: function() {
    var test = this.getTestId();
    var footer = (
      <Router.Link className="btn btn-primary" to="task-editor-new" params={{testId: test}}>{t("Create new task")}</Router.Link>
    );
    return (
      <Bootstrap.Panel header={t("Task list:") + " " + Subtests.categories[test]} footer={footer}>
        <ItemListView items={this.props.subtests.getAllRows()} actions={this.getActions()}
          itemRenderer={this.renderItem}/>
      </Bootstrap.Panel>
    );
  }
});

// Ten wrapper jest, żeby już nie konfundować w środku paramsów z propsami
var TaskEditorListWrapper = React.createClass({
  mixins: [Router.State],

  getTestId: function() {
    return this.getParams().test;
  },
  componentDidUpdate: function(prevProps, prevState) {
    if(this.getTestId() !== this.state.testId) {
      this.reload(this.getTestId());
    }
  },
  componentWillMount: function() {
    this.reload(this.getTestId());
  },
  reload: function(test) {
    var subtests = Subtests.getForTestId(test);
    subtests.load();
    this.setState({
      subtests: subtests,
      testId: test
    });
  },
  render: function() {
    return (
      <TaskEditorList
        testId={this.getTestId()}
        subtests={this.state.subtests}/>
    );
  }
});

module.exports = TaskEditorListWrapper;

