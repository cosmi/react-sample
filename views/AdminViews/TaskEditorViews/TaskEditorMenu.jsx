
/** @jsx React.DOM */
'use strict';
var React = require('react');
var Router = require('react-router');
var t = require('../../../translate.js');
var app = require('../../../app.js');
var Subtests = require('../../../model/Subtests.js');

var MenuScreen = require("../../../components/IndexMenuView.jsx");

var TaskEditorMenu = React.createClass({
  render: function() {
    var tasks=[];
    var categories = Subtests.categories;
    for (var i in categories) {
      tasks.push({
        to: 'task-editor-list',
        params: {test: i},
        label: categories[i]
      });
    }
    
    return (
      <MenuScreen returnTo="admin" links={tasks}>
      </MenuScreen>
    );
  }
});

module.exports = TaskEditorMenu;
