/** @jsx React.DOM */
'use strict';
var React = require('react');
var t = require('../../../../translate.js');
var app = require('../../../../app.js');
var _ = require('underscore');

var ChessboardComponent = require("../../../../components/ChessboardComponent.jsx");
var BlackSquare = require("../../../../components/BlackSquare.jsx");
var NavBar = require("../../../../components/NavBar.jsx");
var SelectSquare = require("../../../../components/SelectSquare.jsx");
var Subtest = require("../../../../model/Subtest.js");

var RepeatSequenceScreen = require('../TestViews/RepeatSequenceScreen.jsx');
var SelectMoves1Screen = require('../TestViews/SelectMoves1Screen.jsx');
var SelectMoves3Screen = require('../TestViews/SelectMoves3Screen.jsx');
var SelectSquares2Screen = require('../TestViews/SelectSquares2Screen.jsx');

var TaskScreen = React.createClass({
  propTypes: {
    subtest: React.PropTypes.instanceOf(Subtest).isRequired,
    centerLabel: React.PropTypes.string.isRequired,
    leftLabel: React.PropTypes.string.isRequired,
    onSubmit: React.PropTypes.func.isRequired,
    rightLabel: React.PropTypes.string.isRequired,
    showTraining: React.PropTypes.bool,
  },
  getInitialState: function() {
    return {};
  },
  getSubtest: function() {
    return this.props.subtest;
  },
  getTestId: function() {
    return this.getSubtest().getData().doc.test;
  },
  getCurrentScreen: function() {
    switch(this.getTestId()) {
      case "E":
        return RepeatSequenceScreen;

      case "B":
      case "D":
        return SelectMoves1Screen;

      case "C":
        return SelectMoves3Screen;

      case "A":
        return SelectSquares2Screen;
    }
  },
  render: function() {
    
    var Screen = this.getCurrentScreen();
    return (
      <div className="fullscreen intest">
        <NavBar leftLabel={this.props.leftLabel} centerLabel={this.props.centerLabel} rightLabel={this.props.rightLabel}/>
        <Screen subtest={this.getSubtest()} buttons={this.props.buttons} onSubmit={this.props.onSubmit}
        showTraining={this.props.showTraining}/>

      </div>
    );
  }
});

module.exports = TaskScreen;
