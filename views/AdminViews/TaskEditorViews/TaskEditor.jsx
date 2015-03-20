/** @jsx React.DOM */
'use strict';
var React = require('react');
var Router = require('react-router');
var t = require('../../../translate.js');
var app = require('../../../app.js');
var Subtests = require('../../../model/Subtests.js');
var _ = require('underscore');
var MenuScreen = require("../../../components/IndexMenuView.jsx");
var InfoModalComponent = require("../../../components/InfoModalComponent.jsx");

var SelectSquares2Editor = require("./Editors/SelectSquares2Editor.jsx");
var SelectMoves1Editor = require("./Editors/SelectMoves1Editor.jsx");
var SelectMoves3Editor = require("./Editors/SelectMoves3Editor.jsx");
var RepeatSequenceEditor = require("./Editors/RepeatSequenceEditor.jsx");

var highlightTypes = {
  redSquare : t("Czerwony kwadrat"),
  greenDot: t("Zielona kropka"), 
  yellowSquare: t("Żółte podświetlenie"), 
  greenSquare: t("Zielone podświetlenie")
};

var testEditors = {
  A: SelectSquares2Editor,
  B: SelectMoves1Editor,
  C: SelectMoves3Editor,
  D: SelectMoves1Editor,
  E: RepeatSequenceEditor
};
var defaultDescriptions = {
  A: "Nazwij pola, na których znajdują się króle.",
  B: "Mat w jednym posunięciu",
  C: "Mat w dwóch posunięciach",
  D: "Dokończ otwarcie.",
  E: "Powtórz posunięcia.",
};

var TaskEditor = React.createClass({
  getInitialState: function() {
    return { 
    };
  },
  isNew: function() {
    return !this.props.subtest;
  },
  getTestId: function() {
    return this.props.testId || this.props.subtest.getTestId();
  },
  getInitialData: function() {
    if(this.isNew()) {
      return { 
        label: t("Task from") + " " + new Date().toLocaleString(app.getLang()), 
        description: defaultDescriptions[this.getTestId()]
      };
    } else {
      var obj = _.pick( this.props.subtest.getData().doc, 'data', 'label', 'description');
      _.extend(obj, this.props.subtest.getData().doc.highlights);
      return obj;
    }
  },
  getSeedData: function() {
    if(!this.isNew()) {
      return this.props.subtest.getData().doc.data;
    }
  },
  initializeData: function() {
    this.replaceState(this.getInitialData());
  },
  componentWillMount: function() {
    this.initializeData();
  },
  onSaved: function() {
    this.setState({saving: false, saved:true});
  },
  handleSave: function(newData) {
    if(!this.isNew()) {
      if(!confirm(t("Exams will not be changed"))) return;
    }
    if(!this.validateHighlights()) {
      alert(t("Incorrect highlight markers"));
      return;
    }
    var label = this.state.label || "";
    var description = this.state.description;
    if(label.length < 5 || label.length > 60) {
      this.setState({error: t("Incorrect task name length")});
      return;
    }
    this.setState({saving: true});
    if(this.isNew()) {
      
      Subtests.createNew({
        label: label,
        description: description,
        data: newData,
        highlights: this.getHighlights(),
        test: this.getTestId()
      }, this.onSaved,
        function(error) {
          this.setState({error: t("Database save error")});
        }
      );
    } else {
      this.props.subtest.updateData({
        label: label,
        description: description,
        data: newData,
        highlights: this.getHighlights(),
        test: this.getTestId()
      }, this.onSaved,
        function(error) {
          this.setState({error: t("Database save error")});
        }
      );
    }

  },
  getHighlights: function() {
    var highlights = {};
    for(var k in highlightTypes) {
      highlights[k] = this.state[k];
    }
    return highlights;
  },
  validateHighlights: function() {
    for(var k in highlightTypes) {
      if(!this.validHighlight(k)) return false;
    }
    return true;
  },
  validHighlight: function(field) {
    var val = this.state[field] || "";
    return (/^\s*([a-h][1-8])?(\s+[a-h][1-8])*\s*$/).test(val);
  },
  renderEditor: function() {
    var Editor = testEditors[this.getTestId()];
    return <Editor onSave={this.handleSave} initialData={this.getSeedData()} highlights={this.getHighlights()}/>;
  },
  changeHandler: function(field) {
    return function(e) {
      var obj = {};
      obj[field] = e.target.value;
      this.setState(obj);
    }.bind(this);
  },
  clearErrors: function() {
    this.setState({error:undefined});
  },
  renderHighlights: function() {
    var inputs = [];
    var types = highlightTypes;
    for(var type in types) {
      var label = types[type];
      var value = this.state[type];
      inputs.push(
        <div className={"form-group col-xs-3" + (this.validHighlight(type)?"":" has-error")} key={type}>
          <label>{label}</label>
          <input className="form-control" value={value} onChange={this.changeHandler(type)}/>
        </div>
      );
    }
    return (
        <div className="row">
          {inputs}
        </div>
    );
  },
  render: function() {
    if(this.state.error) {
      return <InfoModalComponent title={t("Error")}>
        <p>{this.state.error}</p>
        <button className="btn btn-default" onClick={this.clearErrors}>{t("Cancel")}</button>
      </InfoModalComponent>;
    }
    if(this.state.saving) {
      return (
        <MenuScreen title={t("Saving")}>
          {t("Saving task... Please wait.")}
        </MenuScreen>
      )
    }
    if(this.state.saved) {
      return (
        <MenuScreen title={t("Saved")} returnTo="task-editor">
          {t("Task save successful")}
        </MenuScreen>
      );
    }

    var test = this.getTestId();
    return (
      <MenuScreen wide={true} title={t("Creating new task in test") + " " + this.getTestId()} >
        <div className="form-group">
          <label>Nazwa zadania</label>
          <input className="form-control" value={this.state.label} onChange={this.changeHandler('label')}/>
        </div>
        <div className="form-group">
          <label>Treść zadania</label>
          <input className="form-control" value={this.state.description} onChange={this.changeHandler('description')}/>
        </div>
        {this.renderEditor()}

        {this.renderHighlights()}
      </MenuScreen>
    );
  }
});

module.exports = TaskEditor;

