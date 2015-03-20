/** @jsx React.DOM */
'use strict';
var React = require('react');
var t = require('../../../../translate.js');
var app = require('../../../../app.js');
var _ = require('underscore');
var $ = require('jquery');

var ChessBoard = require('../../../../vendor/chessboard.js');

var ChessboardComponent = require("../../../../components/ChessboardComponent.jsx");
var Legend = require("../../../../components/Legend.jsx");
var NavBar = require("../../../../components/NavBar.jsx");
var CommonsMixin= require('./CommonsMixin.jsx');

var SelectMoves3Editor = React.createClass({
  propTypes: {
    onSave: React.PropTypes.func.isRequired,
    initialData: React.PropTypes.object.isRequired
  },
  mixins: [CommonsMixin],
  getInitialState: function() {
    var data = this.props.initialData;
    if(data) {
      return {
        answers: data.solutions.join(' / '),
        position: data.board
      }
    }
    return  {
      answers: "",
      position: '8/8/8/8/8/8/8/8'
    };
  },
  handleDrop: function(source, target, piece, newPos, oldPos, orientation) {
    setTimeout(function() {
      this.setState({ position: ChessBoard.objToFen(newPos) });
    }.bind(this), 0);
  },
  handleSubmit: function() {
    this.props.onSave({
      board: this.state.position,
      solutions: this.parseResults(this.state.answers)
    });
  },
  parseResults: function(results) {
    var res = results.split('/');
    res = _.map(res, function(s) {
      return $.trim(s).split(/\s+/);
    });
    
    var corr = _.every(res, function(s) {
      return (
        s.length == 2 &&
        this.isMoveValid(s[0]) &&
        this.isMoveValid(s[1])
      )
    }.bind(this));
    
    res = _.map(res, function(s) {
      return s.join(' ');
    })
    if(corr) {
      return res;
    }
  },
  getBoardFEN: function() {
    return this.refs.board && this.refs.board.getPosition();
  },
  
  isValidSubmission: function() {
    return (
      (this.getBoardFEN() == this.state.position) &&
      this.parseResults(this.state.answers)
    )
  },
  isReadyToSubmit: function() {
    return this.isValidSubmission();
  },
  componentDidUpdate: function(oldProps, oldState) {
    if(oldState.position !== this.state.position) {
      this.forceUpdate();
    }
  },
  render: function() {
    var result = this.parseResults(this.state.answers);
    var FEN = this.getBoardFEN();
    var correctPosition = !FEN || FEN == this.state.position;
    return (
      <div>
        <div className={"form-group" + (correctPosition?"":" has-error")}>
          <label>Plansza w notacji FEN. Można też edytować planszę poniżej metodą drag and drop.</label>
          <input className="form-control" value={this.state.position} onChange={this.changeHandler('position')} onBlur={this.propagatePosition.bind(this, 'board', 'position')}/>
        </div>
        <div className={"form-group" + (result?"":" has-error")}>
          <label>
            Poprawna odpowiedź.
            Jeżeli jest więcej niż jedna, należy oddzielić warianty znakiem /.
            Ruchy należy oznaczać notacją algebraiczną pełną, oznaczając figury zgodnie z legendą (z wyjątkiem piona) oraz pomijając oznaczenie bicia (np. Ka2-b3 lub c3-c4). 
            Należy podać pierwszy ruch białego i drugi ruch białego oddzielone spacją. Ruch czarnego należy pominąć.
          </label>
          <input className="form-control" value={this.state.answers} onChange={this.changeHandler('answers')}/>
        </div>
              
        <Legend allowAnyMove={true}/>
        <div className="testArea">
        
          <div className="floatLeft">
            <ChessboardComponent ref="board"
              highlights={this.props.highlights}
              draggable={true} dropOffBoard="trash" onDrop={this.handleDrop} initialPosition={this.state.position} sparePieces={true}/>
          </div>
          <div className="floatRight">
            <div className="panel panel-default">
              <div className="panel-body">
              
                {this.renderButtons()}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = SelectMoves3Editor;
