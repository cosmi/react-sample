/** @jsx React.DOM */
'use strict';
var React = require('react');
var t = require('../../../../translate.js');
var app = require('../../../../app.js');
var utils = require('../../../../utils.js');
var _ = require('underscore');
var $ = require('jquery');

var ChessBoard = require('../../../../vendor/chessboard.js');
var Bootstrap = require('react-bootstrap');
var Alert = Bootstrap.Alert;

var ChessboardComponent = require("../../../../components/ChessboardComponent.jsx");
var Legend = require("../../../../components/Legend.jsx");
var NavBar = require("../../../../components/NavBar.jsx");
var CommonsMixin= require('./CommonsMixin.jsx');

var startPosition = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';

var Bootstrap = require("react-bootstrap");
var Glyphicon = Bootstrap.Glyphicon;

var RepeatSequenceEditor = React.createClass({
  propTypes: {
    onSave: React.PropTypes.func.isRequired,
    initialData: React.PropTypes.object.isRequired
  },
  mixins: [CommonsMixin],
  getInitialState: function() {
    var data = this.props.initialData;
    if(data) {
      return {
        position: data.positions[data.positions.length - 1],
        moves: data.moves,
        positions: data.positions,
        initialPosition: data.board,
        state: this.States.MOVE,
        timeout: (data.timeout || "4000") + ""
      }
    }
    return {
      position: startPosition,
      moves: [],
      positions: [],
      state: this.States.INITIAL,
      timeout: "4000"
    };
  },
  States: {
    INITIAL: 'INITIAL',
    MOVE: 'MOVE',
    POSITION: 'POSITION'
  },
  getTaskData: function() {
    return {
      board: this.state.initialPosition,
      moves: this.state.moves,
      positions: this.state.positions,
      timeout: Number(this.state.timeout)
    }
  },
  validators: {
    timeout: function(n) {
      var val = Number(n)
      if(val%1 === 0) {
        return val >= 1000 && val <= 120000;
      }
    },
    state: function(val){
      return val === this.States.MOVE;
    },
    positions: function(val){
      return val.length > 0;
    },
    moves: function(val){
      return val.length === this.state.positions.length;
    }
  },
  
  handleSubmit: function() {
    this.props.onSave(this.getTaskData());
  },
  getBoardFEN: function() {
    return this.refs.board && this.refs.board.getPosition();
  },
  componentDidUpdate: function(oldProps, oldState) {
    if(oldState.position !== this.state.position) {
      this.forceUpdate();
    }
  },
  isValidSubmission: function() {
    return _.every(['state', 'positions', 'timeout', 'moves'], this.isValidField);
  },
  isReadyToSubmit: function() {
    return this.isValidSubmission();
  },
  saveStep: function(move, newPos) {
    var position = this.state.position;
    switch(this.state.state) {
    case this.States.INITIAL:
      this.setState({
        state:this.States.MOVE, 
        initialPosition: position,
        positions: [],
        moves: []
      });
      break;
    case this.States.MOVE:
      this.setState({
        state: this.States.POSITION,
        moves: this.state.moves.concat([move])
      });
      if(newPos) {
        this.setState({position: newPos});
      }
      break;
      
    case this.States.POSITION:
      this.setState({
        state: this.States.MOVE,
        positions: this.state.positions.concat([position])
      });
      break;
    }
    
  },
  revertStep: function() {
    var moves = this.state.moves;
    var positions = this.state.positions;
    switch(this.state.state) {
      
    case this.States.INITIAL:
      this.setState({position: startPosition});
      break;
      
    case this.States.MOVE:
      if(moves.length == 0) {
        this.setState({position: this.state.initialPosition,
                       state: this.States.INITIAL});
      } else {
        this.setState({
          state:this.States.POSITION,
          positions: positions.slice(0, positions.length-1),
          position: positions[positions.length-1]
        });
      }
      break;
      
    case this.States.POSITION:
      this.setState({
        state: this.States.MOVE,
        moves: moves.slice(0, moves.length-1),
        position: positions.length>0?positions[positions.length-1]:this.state.initialPosition
      });
      break;
    }
    
  },
  handleDrop: function(source, target, piece, newPos, oldPos, orientation) {
    if(_.isEqual(newPos, oldPos)) return;
    setTimeout(function() {
      var pos = ChessBoard.objToFen(newPos);
      switch(this.state.state) {
      case this.States.INITIAL:
      case this.States.POSITION:
        this.setState({position: pos});
        break;
      case this.States.MOVE:
        if(target === 'offboard') return;
        this.saveStep(source+'-'+target);
        this.setState({position: pos});
        break;
      }
    }.bind(this), 0);
  },
  showPos: function(pos) {
    this.setState({shownPosition: pos});
  },
  renderMoves: function() {
    if(this.state.state !== this.States.INITIAL) {
      var arr = [];
      var cnt = this.state.positions.length + 1;
      var positions = this.state.positions;
      var moves = this.state.moves;
      for(var i = 0 ; i<cnt; i++) {
        var move = moves.length>i?moves[i]:"";
        var pos = positions.length>i?positions[i]:"";
        var posInput = undefined;
        switch(this.state.state) {
        case this.States.POSITION:
          if(i == positions.length){
            pos = this.state.position;
            posInput = (
              <div>
                <input className="form-control" value={pos} onChange={this.changeHandler('position')}/>
              </div>
            );
          }
          break;
        case this.States.MOVE:
          if(i == moves.length){
            move = "Wybierz ruch..."
          }
          break;
        }
        var posInput;
        if(!posInput) {
          if(!pos) {
            posInput = (
              <div>
                <input className="form-control" value={pos} onChange={this.changeHandler('position')}/>
              </div>
            );
          } else {
            posInput = (
              <div className="input-group">
                <input className="form-control" value={pos} readOnly={true}/>
                <span className="input-group-addon" onMouseEnter={this.showPos.bind(this, pos)} onMouseLeave={this.showPos.bind(this, null)}>
                  <Glyphicon glyph="search"/>
                </span>
              </div>
            );
          }
        }
        
        arr.push(
          <div className="row">
            <div className="col-xs-6">
            
              <input className="form-control" 
                  value={move} 
                  readOnly={true}/>
            
            </div>
            <div className="col-xs-6">
                {posInput}
            </div>
          </div>
        
        )
      }
      
      return arr;
    }
  },
  renderInitialPositionInput: function() {
    var err, value, handler, blurHandler, readOnly;
    if(this.state.state === this.States.INITIAL){
      var FEN = this.getBoardFEN();
      var correctPosition = !FEN || FEN == this.state.position;
      err = (correctPosition?"":" has-error");
      value = this.state.position;
      handler = this.changeHandler('position');
      blurHandler = this.propagatePosition.bind(this, 'board', 'position');
    } else {
      value = this.state.initialPosition;
      readOnly = true;
    }
    
    var input = (
      <input className="form-control" value={value} onChange={handler} onBlur={blurHandler} readOnly={readOnly}/>
    );
    
    if(readOnly) {
      input = (
        <div className="input-group">
          {input}
          <span className="input-group-addon" onMouseEnter={this.showPos.bind(this, value)} onMouseLeave={this.showPos.bind(this, null)}>
            <Glyphicon glyph="search"/>
          </span>
        </div>
      );
    }else {
      input = (
        <div className="">
          {input}
        </div>
      );
    }
    return (
      <div className={"form-group" + err}>
        <label>Plansza początkowa w notacji FEN. Można też edytować planszę poniżej metodą drag and drop.</label>
        {input}
      </div>
    )
  },
  renderStepButtons: function() {
    var backDisabled = this.state.state === this.States.INITIAL && this.state.position === startPosition;
    var nextDisabled = this.state.state === this.States.MOVE;
    return (
      <div className="btn-group btn-group-justified" role="group" aria-label="...">
        <div className="btn-group" role="group">
          <button type="button" onClick={this.revertStep} 
            className="btn btn-default" disabled={backDisabled}>Cofnij</button>
        </div>
        <div className="btn-group" role="group">
          <button type="button" onClick={this.saveStep} 
            className="btn btn-primary" disabled={nextDisabled}>Następny krok</button>
        </div>
      </div>
    )
  },
  makeCastling: function(type, white) {
    var moves = utils.convertCastling(type, white);
    var newPos = this.refs.board.move(moves, false);
    this.saveStep(moves.join(' '), newPos);
  },
  renderCastlingButtons: function() {
    if(this.state.state !== this.States.MOVE) return;
    
    var btns = [];
    var vals = [
      ['O-O-O', true, "Roszada długa białych"],['O-O', true, "Roszada krótka białych"],
      ['O-O-O', false, "Roszada długa czarnych"],['O-O', false, "Roszada krótka czarnych"],
    ];          
    
    for(var i = 0; i<vals.length; i++) {
      var mv = vals[i]
      var type = mv[0], white=mv[1], label=mv[2];
      btns.push(
        <div className="btn-group" role="group">
          <button type="button" onClick={this.makeCastling.bind(this, type, white)} key={i}
            className="btn btn-default">{label}</button>
        </div>
      );
    }
    
    return (
      <div className="btn-group btn-group-justified" role="group" aria-label="...">
      {btns}
      </div>
    )
  },
  
  renderAlert: function() {
    var info;
    switch(this.state.state) {
    case this.States.INITIAL:
      info='Wybierz ustawienie początkowe i kliknij "Następny krok"';
      break;
    case this.States.MOVE:
      info='Wybierz ruch, który ma wykonać uczeń przeciągając bierki na planszy.';
      break;
    case this.States.POSITION:
      info='Upewnij się, że plansza jest ustawiona odpowiednio. Jeżeli np. nastąpiło w przelocie, zdejmij zbitego piona.';
      break;
    }
    
    return (
      <Alert bsStyle="info">
        {info}
      </Alert>
    );
  },
  renderExtraParams: function() {
    return (
      <div className={"form-group" + this.validClass('timeout')}>
        <label>Odstęp między ruchami przy odtwarzaniu sekwencji w milisekundach (4000 - 120000).</label>
        <input className="form-control" value={this.state.timeout} onChange={this.changeHandler('timeout')}/>
      </div>
    );
  },
  
  renderChessboard: function() {
    
    if(this.state.shownPosition) {
      return (
        <ChessboardComponent ref="board" 
          highlights={this.props.highlights}
          draggable={false}
          onDrop={this.handleDrop} 
          initialPosition={this.state.shownPosition} 
          sparePieces={false}/>
      );
    }

    var position = this.state.position;
    return (
      <ChessboardComponent ref="board" 
        highlights={this.props.highlights}
        draggable={true}
        onDrop={this.handleDrop} 
        initialPosition={position} 
        sparePieces={this.state.state!==this.States.MOVE}/>
    )
  },
  render: function() {
    return (
      <div>
        <div>{this.renderExtraParams()}</div>
        <div>{this.renderAlert()}</div>
        <div>{this.renderInitialPositionInput()}</div>
        
        <div>{this.renderMoves()}</div>

        <div>{this.renderStepButtons()}</div>
        <div>{this.renderCastlingButtons()}</div>
        <div className="testArea">
        
          <div className="floatLeft">
            {this.renderChessboard()}
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

module.exports = RepeatSequenceEditor;
