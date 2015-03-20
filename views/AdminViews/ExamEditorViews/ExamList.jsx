/** @jsx React.DOM */
'use strict';
var React = require('react');
var Router = require('react-router');
var t = require('../../../translate.js');
var app = require('../../../app.js');
var Model = require('../../../spine/Model.js');
var reactListener = require('../../../spine/reactListener.js');
var Subtests = require('../../../model/Subtests.js');
var Subtest = require('../../../model/Subtest.js');
var _ = require('underscore');
var MenuScreen = require("../../../components/IndexMenuView.jsx");
var InfoModalComponent = require("../../../components/InfoModalComponent.jsx");
var ItemListView = require("../../../components/ItemList.jsx");

var Exam = require('../../../model/Exam.js');
var Exams = require('../../../model/Exams.js');

var InlineModal = require("../../../components/InlineModal.jsx");
var LoadingModal = require("../../../components/LoadingModal.jsx");

var Bootstrap = require('react-bootstrap');

var ExamList = React.createClass({
  propTypes: {
    exams: React.PropTypes.instanceOf(Exams).isRequired
  },
  mixins: [reactListener('exams')],
  getInitialState: function() {
    return {
      mode: Exam.States.EDITABLE
    }
  },
  renderRow: function(exam) {
    return [exam.getLabel()]
  },
  renderActions: function(item) {
    switch(item.getExamStatus()) {
    case Exam.States.EDITABLE:
      return (
        <div>
          <button className="btn btn-danger" onClick={this.handleRemove.bind(this, item)}>
            Usuń
          </button>
          <Router.Link className="btn btn-primary" to='exam-editor-edit' params={{examId: item.getId()}}>{t("Edit")}</Router.Link>
          <button className="btn btn-success" onClick={function() {
            if(confirm(t("Are you sure to save the exam?"))) {
              this.handleSetStatus(item, Exam.States.CLOSED);
            }
          }.bind(this)}>
            Zapisz
          </button>
        </div>
      );
    case Exam.States.CLOSED:
      return (
        <div>
          <button className="btn btn-danger" onClick={this.handleSetStatus.bind(this, item, Exam.States.ARCHIVED)}>
            Archiwizuj
          </button>
        </div>
      );
    case Exam.States.ARCHIVED:
      return (
        <div>
          <button className="btn btn-success" onClick={this.handleSetStatus.bind(this, item, Exam.States.CLOSED)}>
            Przywróć
          </button>
        </div>
      );
    }
  },
  handleRemove: function(item) {
    if(confirm(t("Confirm exam deletion"))){
      item.destroy(function(){
        this.props.exams.removeRow(item.getId());
        this.reload();
      }.bind(this));
    }
  },
  handleSetStatus: function(item, status) {
    item.updateExamStatus(status, function(){
      this.forceUpdate();
    }.bind(this));
    
  },
  reload: function() {
    this.props.exams.load();
  },
  setMode: function(mode) {
    this.setState({mode: mode});
  },
  renderButtons: function(){
    var mode = this.state.mode;
    return (
      <div className="btn-group btn-group-justified" role="group" aria-label="...">
        <div className="btn-group" role="group">
          <button type="button" onClick={this.setMode.bind(this, Exam.States.EDITABLE)} 
          className={"btn btn-" + (mode===Exam.States.EDITABLE?'primary':'default')}>{t('Editable')}</button>
        </div>
        <div className="btn-group" role="group">
          <button type="button" onClick={this.setMode.bind(this, Exam.States.CLOSED)} 
            className={"btn btn-" + (mode===Exam.States.CLOSED?'primary':'default')}>{t('Saved')}</button>
        </div>
        <div className="btn-group" role="group">
          <button type="button" onClick={this.setMode.bind(this, Exam.States.ARCHIVED)} 
          className={"btn btn-" + (mode===Exam.States.ARCHIVED?'primary':'default')}>{t('Archived')}</button>
        </div>
      </div>
    )
  },
  getItems: function() {
    var exams = this.props.exams.getAllRows();
    var mode = this.state.mode
    return _.filter(exams, function(it) {
      return it.getExamStatus() === mode;
    });
  },
  render: function() {
    if(this.props.exams.getState() !== Model.States.LOADED) {
      return <LoadingModal footer={<Router.Link className="btn btn-default" to='admin'>{t("Back")}</Router.Link>}/>;
    }
    var footer = [
      <Router.Link key={1} className="btn btn-default" to='admin'>{t("Back")}</Router.Link>,
      <Router.Link key={2} className="btn btn-primary" to='exam-editor-new'>{t("Create new exam")}</Router.Link>
    ];
    return (
      <InlineModal title={t("Exam list")} footer={footer}>
      {this.renderButtons()}
        <ItemListView items={this.getItems()} actions={this.renderActions}
          itemRenderer={this.renderRow}/>
      </InlineModal>
    );
  }
});

var ExamListWrapper = React.createClass({
  mixins: [Router.State],
  getInitialState: function() {
    return {};
  },
  componentWillMount: function() {
    this.reload();
  },
  reload: function() {
    var model = new Exams();
    this.setState({exams: model});
    model.load();

  },
  getExams: function() {
    return this.state.exams;
  },
  render: function() {
    return <ExamList exams={this.getExams()}/>;
  }

});

module.exports = ExamListWrapper;

