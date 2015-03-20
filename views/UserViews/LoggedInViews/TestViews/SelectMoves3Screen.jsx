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
var SelectMoves3Screen = React.createClass({
  propTypes: {
    subtest: React.PropTypes.instanceOf(Subtest).isRequired,
    onSubmit: React.PropTypes.func.isRequired,
    isTraining: React.PropTypes.bool,
    buttons: React.PropTypes.array
  },
  mixins: [CommonsMixin],
  getInitialState: function() {
    return {idx:0};
  },
  
  isValidSubmission: function() {
    return (
      this.state.move0 && this.state.move1 && this.state.move2
    );
  },
  handleSubmit: function() {
    this.props.onSubmit({solution: [this.state.move0, this.state.move1, this.state.move2].join(' ')});
  },
  
  isReadyToSubmit: function() {
    return this.isValidSubmission();
  },
  setIdx: function(idx) {
    this.setState({
      idx: idx
    })
  },
  getMove: function(idx) {
    switch(idx) {
    case 0:
      return this.state.move0;
    case 1:
      return this.state.move1;
    case 2:
      return this.state.move2;
    }
  },
  renderStepButtons: function(idx) {
    return (
      <div className="btn-group btn-group-justified" role="group" aria-label="...">
        <div className="btn-group" role="group">
          <button className="btn btn-default" disabled={idx===0} onClick={this.setIdx.bind(this, idx-1)}>{t("Go back")}</button>
        </div>
        <div className="btn-group" role="group">
          <button className="btn btn-primary" disabled={idx===2 || !this.getMove(idx)} onClick={this.setIdx.bind(this, idx+1)}>{t("Next move")}</button>
        </div>
      </div>
    );
  },
  renderHistory: function() {
    var rows = [];
    for(var i = 0; i<3; i++) {
      rows.push(
        <div className="col-xs-4"><input className="form-control" value={this.getMove(i)} readOnly={true}/></div>
      );
    }
    return (
      <div className="row" style={{marginLeft:30, marginRight:30}}>
        {rows}
      </div>
    );
  },
  render: function() {
    var second = this.state.secondMove;
    var idx = this.state.idx;
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
              {this.renderHistory()}
            <div className={"center-block" + (idx !== 0?" hidden":"")} style={{width: 383}}>
              <SelectMove move={this.state.move0} title={t("First white move")} onChange={this.changeHandler('move0')}/>
              {this.renderStepButtons(0)}
            </div>
            <div className={"center-block" + (idx !== 1?" hidden":"")} style={{width: 383}}>
              <SelectMove move={this.state.move1} title={t("First black move")} onChange={this.changeHandler('move1')}/>
              {this.renderStepButtons(1)}
            </div>              
            <div className={"center-block" + (idx !== 2?" hidden":"")} style={{width: 383}}>
              <SelectMove move={this.state.move2} title={t("Second white move")} onChange={this.changeHandler('move2')}/>
              {this.renderStepButtons(2)}
            </div>              
            <hr className="select-move-horizontal-line"></hr>
              {this.renderButtons()}
          </div>
        </div>
      </div>
    );
  }
});

module.exports = SelectMoves3Screen;
