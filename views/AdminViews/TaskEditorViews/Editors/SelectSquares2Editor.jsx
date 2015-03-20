/** @jsx React.DOM */
'use strict';
var React = require('react');
var t = require('../../../../translate.js');
var app = require('../../../../app.js');
var _ = require('underscore');

var ChessBoard = require('../../../../vendor/chessboard.js');

var NavBar = require("../../../../components/NavBar.jsx");
var SelectSquare = require("../../../../components/SelectSquare.jsx");

var ChessboardComponent = require("../../../../components/ChessboardComponent.jsx");
var CommonsMixin= require('./CommonsMixin.jsx');
var SelectSquares2Editor = React.createClass({
  propTypes: {
    onSave: React.PropTypes.func.isRequired,
    initialData: React.PropTypes.object.isRequired
  },
  mixins: [CommonsMixin],
  getInitialState: function() {
    var data = this.props.initialData;
    if(data) {
      var sl = data.solutions[0].split(' ');
      return {
        src: sl[0],
        dst: sl[1],
        position: data.board
      }
    }
    return {};
  },
  isValidSubmission: function() {
    var square1 = this.state.src;
    var square2 = this.state.dst;
    return (square1 && square2 && square1 != square2);
  },
  isReadyToSubmit: function() {
    return this.isValidSubmission();
  },
  stateToFen: function() {
    var obj = {};
    var square1 = this.state.src;
    var square2 = this.state.dst
    if(square1) obj[square1] = "wK";
    if(square2) obj[square2] = "bK";
    return ChessBoard.objToFen(obj);
  },
  handleSubmit: function() {
    var square1 = this.state.src;
    var square2 = this.state.dst;
    
    this.props.onSave({
      board: this.stateToFen(),
      solutions: [square1+" "+square2]
    });
  },
  render: function() {
    
    return (
        <div className="testArea clearfix">
          
          <div className="floatLeft">
            <div className="panel panel-default selection-panel centered">
              <hr className="select-move-horizontal-line"></hr>
            
              <div className="center-block" style={{width: 383}}>
                <div className="row centered selection-row">
                  <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                    <SelectSquare title={t("White king")} 
                      onChange={this.changeHandler('src')}
                      field={this.state.src}/>
                  </div>
                  <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                    <SelectSquare title={t("Black king")} 
                      onChange={this.changeHandler('dst')}
                      field={this.state.dst}/>
                  </div>
                </div>
              </div>
              <hr className="select-move-horizontal-line"></hr>
              {this.renderButtons()}
            </div>
          </div>
          <div className="floatRight">
            <ChessboardComponent initialPosition={this.stateToFen()}               
              highlights={this.props.highlights}/>
          </div>
        </div>
    );
  }
});

module.exports = SelectSquares2Editor;
