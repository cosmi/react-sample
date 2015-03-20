/** @jsx React.DOM */
'use strict';
var React = require('react');
var t = require('../../../../translate.js');
var app = require('../../../../app.js');
var _ = require('underscore');

var ChessboardComponent = require("../../../../components/ChessboardComponent.jsx");
var BlackSquare = require("../../../../components/BlackSquare.jsx");
var SelectSquare = require("../../../../components/SelectSquare.jsx");
var Subtest = require("../../../../model/Subtest.js");
var CommonsMixin= require('./CommonsMixin.jsx');
var SelectSquares2Screen = React.createClass({
  propTypes: {
    subtest: React.PropTypes.instanceOf(Subtest).isRequired,
    onSubmit: React.PropTypes.func.isRequired,
    isTraining: React.PropTypes.bool,
    buttons: React.PropTypes.object
  },
  mixins: [CommonsMixin],
  getInitialState: function() {
    return {};
  },
  
  isValidSubmission: function() {
    return (
      this.state.src &&
      this.state.dst
    );
  },
  handleSubmit: function() {
    var square1 = this.state.src;
    var square2 = this.state.dst;
    this.props.onSubmit({solution: square1 + " " + square2});
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
                <div className="row centered selection-row">
                  <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                    <SelectSquare title={t("White king")}
                      onChange={this.changeHandler('src')}
                      move={this.state.src}/>
                  </div>
                  <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                    <SelectSquare title={t("Black king")}
                      onChange={this.changeHandler('dst')}
                      move={this.state.dst}/>
                  </div>
                </div>
              </div>
              <hr className="select-move-horizontal-line"></hr>
                {this.renderButtons()}
            </div>
          </div>
        </div>
    );
  }
});

module.exports = SelectSquares2Screen;
