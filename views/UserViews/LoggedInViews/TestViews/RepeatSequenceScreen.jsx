/** @jsx React.DOM */
'use strict';
var React = require('react');
var t = require('../../../../translate.js');
var app = require('../../../../app.js');
var utils = require('../../../../utils.js');
var _ = require('underscore');

var ChessboardComponent = require("../../../../components/ChessboardComponent.jsx");

var Legend = require("../../../../components/Legend.jsx");
var NavBar = require("../../../../components/NavBar.jsx");

var SelectMove = require("../../../../components/SelectMove.jsx");

var CommonsMixin= require('./CommonsMixin.jsx');
var RepeatSequenceScreen = React.createClass({
  propTypes: {
    subtest: React.PropTypes.instanceOf(Subtest).isRequired,
    onSubmit: React.PropTypes.func.isRequired,
    isTraining: React.PropTypes.bool,
    buttons: React.PropTypes.array
  },
  mixins: [CommonsMixin],
  States: {
    INITIAL: "INITIAL",
    SHOWING: "SHOWING",
    REPEATING: "REPEATING",
    FINISHED: "FINISHED"
  },
  getInitialState: function() {
    return {
      state: this.States.INITIAL,
    };
  },
  
  isValidSubmission: function() {
    return (
      this.state.state === this.States.FINISHED
    );
  },
  handleSubmit: function() {
    this.props.onSubmit({
      answers: this.state.answers,
      mistake: this.state.mistake
    });
  },
  
  isReadyToSubmit: function() {
    return this.isValidSubmission();
  },
  countSteps: function() {
    return this.getSubtest().getMoves().length;
  },
  getCurrentPosition: function() {
    var idx = this.state.idx;
    if(idx === 0) {
      return this.getBoard();
    } else {
      return this.getSubtest().getPositions()[idx - 1];
    }
  },
  startShowing: function() {
    this.setState({
      state: this.States.SHOWING,
      idx: 0
    }, this.showNext);
  },
  startRepeating: function() {
    this.setState({
      state: this.States.REPEATING,
      idx: 0
    });
  },
  movePieces: function(move) {
    this.refs.board.move(move.split(' '));
  },
  onTimeout: function(ts) {
    if(this._timeoutTimestamp != ts) return;
    if(this.state.state !== this.States.SHOWING) return;
    if(!this.isMounted()) return;
    this.handleShowNext();
  },
  queueTimeout: function(delta) {
    var ts = new Date();
    if(this._timeoutObj) {
      clearTimeout(this._timeoutObj);
    }
    this._timeoutObj = setTimeout(
      this.onTimeout.bind(this, ts),
      delta
    );
    this._timeoutTimestamp = ts;
  },
  getTimeoutValue: function() {
    return this.getSubtest().getTimeoutBetweenSteps();
  },
  showNext: function() {
    var idx = this.state.idx;
    var moves = this.getSubtest().getMoves()
    if(idx<moves.length) {
      this.movePieces(moves[idx]);
      this.queueTimeout(this.getTimeoutValue());
    } else {
      this.startRepeating();
    }
  },
  handleShowNext: function() {
    this.setState({
      idx: this.state.idx+1
    }, this.showNext);
  },
  nextRepeat: function() {
    var idx = this.state.idx +1;
    if(idx<this.countSteps()) {
      this.setState({
        idx:idx
      });
    } else {
      this.setState({
        state: this.States.FINISHED,
        mistake: false
      })
    }
  },
  reportMove: function(move) {
    this.setState({answers: (this.state.answers || []).concat([move])})
  },
  repeatOK: function(move) {
    this.reportMove(move);
    this.nextRepeat();
  },
  repeatMistake: function(move) {
    this.reportMove(move);
    this.setState({
      state: this.States.FINISHED,
      mistake: true
    });
  },
  handleMove: function(done) {
    var move = this.getSubtest().getMoves()[this.state.idx];
    if(move === done) {
      this.repeatOK(done);
    } else {
      this.repeatMistake(done);
    }
  },
  handleDrop: function(source, target, piece, newPos, oldPos, orientation) {
    if(_.isEqual(newPos, oldPos)) return;
    setTimeout(function() {
      
      var done = source+'-'+target;
      if(piece=='wK' || piece=='bK') {
        var castling = utils.catchCastling(done);
        if(castling) done = castling.join(' ');
      }
      this.handleMove(done);
      
    }.bind(this), 0);
  },
  renderChessboard: function() {
    switch(this.state.state) {
      case this.States.INITIAL:
        return <ChessboardComponent highlights={this.getHighlights()} ref="board"
           initialPosition={this.getBoard()} showNotation={this.isTraining()}/>;
      case this.States.SHOWING:
        return <ChessboardComponent highlights={this.getHighlights()} ref="board"
           moveSpeed="slow"  initialPosition={this.getCurrentPosition()} showNotation={this.isTraining()}/>;                  
      case this.States.REPEATING:
      case this.States.FINISHED:
        return <ChessboardComponent highlights={this.getHighlights()} ref="board"
           onDrop={this.handleDrop} draggable={true} initialPosition={this.getCurrentPosition()} showNotation={this.isTraining()}/>;                  
    }
  },
  // renderCastlingButtons: function() {
  //   if(this.state.state!==this.States.REPEATING) return;
  //   var btns = [];
  //   var vals = [
  //     ['O-O-O', true, "Roszada długa białych"],['O-O', true, "Roszada krótka białych"],
  //     ['O-O-O', false, "Roszada długa czarnych"],['O-O', false, "Roszada krótka czarnych"],
  //   ];
  //
  //   for(var i = 0; i<vals.length; i++) {
  //     var mv = vals[i]
  //     var type = mv[0], white=mv[1], label=mv[2];
  //     btns.push(
  //       <div className="btn-group" role="group">
  //         <button type="button" onClick={this.makeCastling.bind(this, type, white)} key={i}
  //           className="btn btn-default">{label}</button>
  //       </div>
  //     );
  //   }
  //
  //   return (
  //     <div className="btn-group btn-group-justified" role="group" aria-label="...">
  //     {btns}
  //     </div>
  //   )
  // },
  renderStatusInfo: function() {
    switch(this.state.state) {
      case this.States.INITIAL:
        return <h3>{t("Press start to begin")}</h3>
      case this.States.SHOWING:
        return (
          <h3>{t("Step")} {this.state.idx+1} {t("of")} {this.countSteps()}</h3>
        )
      case this.States.REPEATING:
        return (
          <h3>{t("Repeat step")} {this.state.idx+1} {t("of")} {this.countSteps()}</h3>
        )
      case this.States.FINISHED:
        return (
          <h3>{t("The end")}</h3>
        )
    } 
  },
  renderControlButtons: function() {
    var btns = [];
    var vals = []
    switch(this.state.state) {
      case this.States.INITIAL:
        vals.push([t("Start"), this.startShowing]);
        break;
      case this.States.SHOWING:
        vals.push([t("Next"), this.handleShowNext]);
        break;
      case this.States.REPEATING:
        break;
      case this.States.FINISHED:
        vals.push([t("OK"), this.handleSubmit]);
    }
    if(vals.length === 0) return null;
    for(var i = 0; i<vals.length; i++) {
      var mv = vals[i]
      var label = mv[0], handler=mv[1];
      btns.push(
        <div className="btn-group" role="group">
          <button type="button" onClick={handler} key={i}
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
  render: function() {
    return (
      <div className='testArea'>
        <div className="floatLeft">
          {this.renderChessboard()}
        </div>
        <div className="floatRight">
          <div className="panel panel-default selection-panel centered">
            <h3 className="select-move-title">
              {this.getSubtest().getDescription()}
            </h3>
            <hr className="select-move-horizontal-line"></hr>
            <div className="center-block" style={{width: 383}}>
              {this.renderStatusInfo()}
              {this.renderControlButtons()}
            </div>
            <hr className="select-move-horizontal-line"></hr>
              {this.renderButtons()}
          </div>
        </div>
      </div>
    );
  }
});

module.exports = RepeatSequenceScreen;
