/** @jsx React.DOM */
'use strict';
var React = require('react');
var t = require('../../../../translate.js');
var app = require('../../../../app.js');
var _ = require('underscore');

var ChessboardComponent = require("../../../../components/ChessboardComponent.jsx");
var BlackSquare = require("../../../../components/BlackSquare.jsx");
var Legend = require("../../../../components/Legend.jsx");
var NavBar = require("../../../../components/NavBar.jsx");
var SelectMove = require("../../../../components/SelectMove.jsx");

var CommonsMixin= require('./CommonsMixin.jsx');
var SelectMoves1Screen = React.createClass({
  propTypes: {
    subtest: React.PropTypes.instanceOf(Subtest).isRequired,
    onSubmit: React.PropTypes.func.isRequired,
    isTraining: React.PropTypes.bool,
    buttons: React.PropTypes.array
  },
  mixins: [CommonsMixin],
  getInitialState: function() {
    return {};
  },
  
  isValidSubmission: function() {
    return (
      !!this.state.move
    );
  },
  handleSubmit: function() {
    this.props.onSubmit({solution: this.state.move});
  },
  
  isReadyToSubmit: function() {
    return this.isValidSubmission();
  },
  render: function() {
    return (
      <div className='testArea'>
        <div className="floatLeft">
          <ChessboardComponent highlights={this.getHighlights()} initialPosition={this.getBoard()} showNotation={this.isTraining()}/>
        </div>
        <div className="floatRight">
          <div className="panel panel-default selection-panel centered">
            <h3 className="select-move-title">
              {this.getSubtest().getDescription()}
            </h3>
            <hr className="select-move-horizontal-line"></hr>
            <div className="center-block" style={{width: 383}}>
              <SelectMove move={this.state.move} title={t("White move")} onChange={this.changeHandler('move')}/>
            </div>
            <hr className="select-move-horizontal-line"></hr>
              {this.renderButtons()}
          </div>
        </div>
      </div>
    );
  }
});

module.exports = SelectMoves1Screen;
