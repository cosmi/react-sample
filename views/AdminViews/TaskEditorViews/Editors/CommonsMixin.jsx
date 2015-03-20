/** @jsx React.DOM */
'use strict';
var React = require('react');
var Router = require('react-router');
var t = require('../../../../translate.js');
var app = require('../../../../app.js');
var utils = require('../../../../utils.js');
var _ = require('underscore');

var ChessBoard = require('../../../../vendor/chessboard.js');

var NavBar = require("../../../../components/NavBar.jsx");
var SelectSquare = require("../../../../components/SelectSquare.jsx");

var CommonsMixin = {
  changeHandler: function(field) {
    return function(v) {
      if(v && v.target) {
        if(v.target.value) {
          v = v.target.value;
        } else {
          v = "";
        }
      }
      var obj = {};
      obj[field] = v;
      this.setState(obj);
    }.bind(this);
  },
  isMoveValid: function(str) {
    return utils.isMoveValid(str);
  }, 
  isMoveValidShort: function(str) {
    return utils.isMoveValidShort(str);
  }, 
  propagatePosition: function(ref, state) {
    var pos = this.refs[ref].getPosition();
    var obj = {};
    obj[state] = pos;
    this.setState(obj);
  },
  isValidField: function(field) {
    if(this.validators[field]){
      return this.validators[field].call(this, this.state[field] || "");
    } else {
      return true;
    }
  },
  validClass: function(field) {
    if(this.state[field] || this.state.showErrors) {
      if(!this.isValidField(field)) {
        return "has-error";
      } else {
        return "has-success";
      }
    }
  },
  renderButtons: function() {
    var buttons= this.props.buttons || [];    
    var submitButton = null;
    if(this.isReadyToSubmit()) {
      submitButton = <button className="btn btn-primary" onClick={this.handleSubmit}>Zapisz</button>;
    } else {
      submitButton = <button className="btn btn-primary" disabled>Zapisz</button>;
    }
    var returnButton = <Router.Link className="btn btn-default" to='task-editor'>Powrót</Router.Link>
    var nbuttons = buttons.concat([submitButton, returnButton]);
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
