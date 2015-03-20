/** @jsx React.DOM */
'use strict';
var React = require('react');
var t = require('../translate.js');
var app = require('../app.js');
var _ = require('underscore');

var ChessBoard = require('../vendor/chessboard.js');

var ChessboardComponent = require("../components/ChessboardComponent.jsx");
var NavBar = require("../components/NavBar.jsx");

var BoardTest = React.createClass({
  getInitialState: function() {
    return {
      key: 0,
      position: 'start',
      value: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR'
    };
  },
  handleDrop: function(source, target, piece, newPos, oldPos, orientation) {
    this.setState({ value: ChessBoard.objToFen(newPos) });
  },
  setEmpty: function() {
    this.setState({ key: this.state.key + 1, position: '8/8/8/8/8/8/8/8', value: '8/8/8/8/8/8/8/8' });
  },
  setStart: function() {
    this.setState({ key: this.state.key + 1, position: 'start', value: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR' });
  },
  render: function() {
    return (
      <div className="fullscreen">
        <NavBar leftLabel="test" centerLabel="test" rightLabel="test"/>
        <div className="panel panel-default">
          <div className="panel-body">
            <h5>
              Test robienia planszy
            </h5>
          </div>
        </div>
        <div className="row">
          <div className="floatLeft">
            <ChessboardComponent key={this.state.key} draggable={true} dropOffBoard="trash" initialPosition={this.state.position} onDrop={this.handleDrop} sparePieces={true}/>
          </div>
          <div className="floatLeft">
            <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
            <button onClick={this.setEmpty} style={{width: "250px"}}>Pusta plansza</button>
            <button onClick={this.setStart} style={{width: "250px"}}>Startowa plansza</button><br/>
            <input readOnly={true} value={this.state.value} style={{width: "100%"}}/>
          </div>
        </div>
        <div style={{position: "fixed", top: "0px", bottom: "0px", left: "0px", right: "0px", width: "100%", height: "100%", backgroundColor: "grey", zIndex: "-1000"}}></div>
      </div>
    );
  }
});

module.exports = BoardTest;
