/** @jsx React.DOM */
'use strict';
var React = require('react');
var t = require('../../../../translate.js');
var app = require('../../../../app.js');
var _ = require('underscore');

var ChessBoard = require('../../../../vendor/chessboard.js');

var NavBar = require("../../../../components/NavBar.jsx");
var SelectSquare = require("../../../../components/SelectSquare.jsx");

var CommonsMixin = {
  isTraining: function() {
    return !!this.props.showTraining;
  },
  getSubtest: function() {
    return this.props.subtest;
  },
  getTestId: function() {
    return this.getSubtest().getTestId();
  },
  getBoard: function() {
    return this.getSubtest().getBoard();
  },
  getHighlights: function() {
    if(this.isTraining() || this.getTestId() === 'A') {
      return this.getSubtest().getHighlights();
    }
  },
  changeHandler: function(field) {
    return function(val) {
      var obj = {};
      obj[field] = val;
      this.setState(obj);
    }.bind(this);
  },
  
  renderButtons: function() {
    var buttons= this.props.buttons || [];    
    var submitButton = null;
    if(this.isReadyToSubmit()) {
      submitButton = <button className="btn btn-primary" onClick={this.handleSubmit}>{t("Save")}</button>;
    } else {
      submitButton = <button className="btn btn-primary" disabled>{t("Save")}</button>;
    }
    var nbuttons = buttons.concat([submitButton]);
    return (
      <div className="btn-group btn-group-justified" role="group" aria-label="...">
        {
          _.map(nbuttons, function(el, idx) {
            return (
              <div key={idx} className="btn-group" role="group">
                {el}
              </div>
            );
          })
        }
      </div>
    );
  },
};

module.exports = CommonsMixin;
