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
var InlineModal = require("../../../components/InlineModal.jsx");
var LoadingModal = require("../../../components/LoadingModal.jsx");
var InfoModalComponent = require("../../../components/InfoModalComponent.jsx");

var Exam = require('../../../model/Exam.js');
var Exams = require('../../../model/Exams.js');

var SubtestPane = require('./SubtestPane.jsx');

var SubtestList = React.createClass({
  propTypes: {
    testId: React.PropTypes.string.isRequired,
    subtests: React.PropTypes.instanceOf(Subtests).isRequired,
    selected: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    onChange: React.PropTypes.func.isRequired,
  },
  switchHandler: function(id) {
    var arr = this.props.selected;
    var idx = arr.indexOf(id);
    if(idx == -1) {
      arr = arr.concat([id]);
    } else {
      arr = _.clone(arr);
      arr.splice(idx,1);
    }
    this.props.onChange(arr);
  },
  moveHandler: function(id, newIdx) {
    var arr = _.clone(this.props.selected);
    var idx = arr.indexOf(id);
    if(idx != -1) {
      arr.splice(idx, 1);
    }
    arr.splice(newIdx, 0, id);
    this.props.onChange(arr);
  },
  render: function() {
    var testId = this.props.testId;
    var selected = this.props.selected;
    var subtests = _.filter(this.props.subtests.getAllRows(), function(item) {
      return item.getTestId() === testId;
    });
    
    subtests = _.sortBy(subtests, function(item) {
      return item.getCreatedAt() || "0000"+ item.getLabel();
    });
    subtests = subtests.reverse();

    // liczymy na której dany element jest pozycji
    var selectedPositions = {};
    for(var i = 0; i < selected.length; i++) {
      var subt = selected[i];
      selectedPositions[subt] = i;
    }

    console.log(selected);
    console.log(selectedPositions);

    var items = [];
    for(var i in subtests) {
      var subtest = subtests[i];
      var id = subtest.getId();
      items.push(<SubtestPane subtest={subtest} key={"key-"+id} position={selectedPositions[id]} maxPosition={selected.length}
                    onSwitch={this.switchHandler.bind(this, id)}
                    onChangePosition={this.moveHandler.bind(this, id)}/>);
    }

    return (
      <div className="task-list">
        <h3>Test {testId} ({selected.length}/{subtests.length})</h3>
        <table className="list-group">
          <tbody>
            {items}
          </tbody>
        </table>
      </div>
    );
  }
});

var ExamEditor = React.createClass({
  propTypes: {
     exam: React.PropTypes.instanceOf(Exam), // not required
     subtests: React.PropTypes.instanceOf(Subtests), // not required
  },
  mixins: [reactListener('exam'), reactListener('subtests')],
  getExam: function() {
    return this.props.exam;
  },
  getSubtests: function() {
    return this.props.subtests;
  },
  isNew: function() {
    return !this.getExam();
  },
  getInitialState: function() {
    return { 
     };
  },
  initializeState: function() {
    if(this.isNew()){
      this.replaceState({ 
        label: t("Exam from") + ' ' + new Date().toLocaleString(app.getLang()),
        resultsEnabled: true
      });
    } else {
      var exam = this.getExam();
      var selection = exam.getSelectionMap()
      var missing;
      for(var k in selection) {
        for(var j = 0; j< selection[k].length;j++) {
          var id = selection[k][j];
          if(!this.getSubtests().getRowById(id)) {
            missing = true;
            selection[k].splice(j,1);
            j--;
          }
        }
      }
      if(missing) {
        alert(t("Some tasks removed"));
      }
      this.replaceState({ 
        label: exam.getLabel(),
        resultsEnabled: exam.areResultsEnabled(),
        randomOrder: exam.isRandomOrder(),
        selected: selection
      });
    }
  },
  componentWillMount: function() {
    this.initializeState();
  },
  componentDidUpdate: function(oldProps,oldState) {
    if(oldProps.exam !== this.props.exam) {
      this.initializeState();
    }
  },
  changeHandler: function(field) {
    return function(e) {
      if(e && e.target && e.target.value) e = e.target.value;
      var obj = {};
      obj[field] = e;
      this.setState(obj);
    }.bind(this);
  },
  renderInputField: function(label, fieldName) {
    var errorMsg = null;//this.state.errors[fieldName];
    return (
      <div className={"form-group" + (errorMsg?" has-error":"")}>
        <label>{label}</label>
        <input className="form-control" value={this.state[fieldName]} onChange={this.changeHandler(fieldName)}/>
        {errorMsg?<span className="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>:null}
        {errorMsg?<p>{errorMsg}</p>:null}
      </div>
    );
  },
  getSelected: function(testId) {
    var selected = this.state.selected
    return selected && selected[testId] || [];
  },
  selectionChangeHandler: function(testId, newValue) {
    var selected = this.state.selected || {}; // teoretycznie niebezpieczne, w praktyce ok
    selected[testId] = newValue;
    this.setState({selected: selected});
  },
  renderSelector: function() {
    var panes = [];
    var tests = ["A", "B", "C", "D", "E"];
    for(var k in tests) {
      var test = tests[k];

      panes.push(
        <SubtestList key={test} testId={test} subtests={this.getSubtests()} selected={this.getSelected(test)}
          onChange={this.selectionChangeHandler.bind(this, test)}/>
      )
    }
    return (
      <div className="task-lists">
        {panes}
      </div>
    );
  },
  handleSuccess: function(){
    this.setState({saved: true, saving: false});
  },
  handleSave: function() {
    var data = {
      label: this.state.label,
      resultsEnabled: this.state.resultsEnabled,
      randomOrder: this.state.randomOrder || false
    };
    if(this.isNew()) {
      Exam.createFromSelectedMap(data, this.props.subtests, this.state.selected, this.handleSuccess, this.handleError);
    } else {
      this.getExam().saveFromSelectedMap(data, this.props.subtests, this.state.selected, this.handleSuccess, this.handleError)
    }
    this.setState({saving: true});
  },
  handleError: function(msg) {
    this.setState({saving:undefined, error:msg});
  },
  clearErrors: function() {
    this.setState({error:undefined});
  },
  render: function() {
    if(this.state.error) {
      return <InfoModalComponent title={t("Error")}>
        <p>{this.state.error}</p>
        <button className="btn btn-default" onClick={this.clearErrors}>{t("Cancel")}</button>
      </InfoModalComponent>;
    }
    if(this.state.saving) {
      return <InfoModalComponent title={t("Saving")}>{t("Please wait...")}</InfoModalComponent>;
    }
    if(this.state.saved) {
      return (
        <InfoModalComponent title={t("Saved")}>
          {t("Exam save successful.")}
          <p>{this.state.error}</p>
          <Router.Link to="exam-list">{t("OK")}</Router.Link>
        </InfoModalComponent>
      );
      //TODO: coś lepszego
    }
    var subtests = this.getSubtests();
    if(!subtests || subtests.getState() !== Model.States.LOADED) {
      return <InfoModalComponent title={t("Loading")}>{t("Please wait...")}</InfoModalComponent>;
    }
    
    var footer=[
          <Router.Link key={1} to="exam-list" className="btn btn-default">
            {t("Back")}
          </Router.Link>,
          <button key={2} type="submit" className="btn btn-primary btn-large" onClick={this.handleSave}>
            {t("Save new exam")}
          </button>
    ];
    
    return (
      <InlineModal title="Tworzenie nowego egzaminu" wide={true} footer={footer}>
        <div className='exam-editor'>
          {this.renderInputField(t("Exam name"), "label")}
          <div className="checkbox">
            <label>
              <input type="checkbox" checked={this.state.resultsEnabled} 
                onChange={this.changeHandler('resultsEnabled').bind(this, !this.state.resultsEnabled)}/>
              {t("Show results to user")}
            </label>
          </div>
          <div className="checkbox">
            <label>
              <input type="checkbox" checked={this.state.randomOrder} 
                onChange={this.changeHandler('randomOrder').bind(this, !this.state.randomOrder)}/>
              {t("Random order of tasks")}
            </label>
          </div>
          {this.renderSelector()}
          
        </div>
      </InlineModal>
    );
  }
});

var ExamEditorWrapper = React.createClass({
  mixins: [Router.State],
  getInitialState: function() {
    return {};
  },
  componentWillMount: function() {
    var subtests = new Subtests();
    this.setState({subtests: subtests});
    subtests.load(this.forceUpdate.bind(this, null));
    this.reload();
  },
  getExamId: function() {
    return this.getParams().examId;
  },
  componentDidUpdate: function(prevProps) {
    if((this.getExam()?this.getExam().getId():undefined) != this.getExamId()) {
      this.reload();
    }
  },
  reload: function() {
    var id = this.getExamId();
    var model = id && new Exam(id);
    this.setState({exam: model});
    if(model) model.load(this.forceUpdate.bind(this, null));

  },
  getExam: function() {
    return this.state.exam;
  },
  getSubtests: function() {
    return this.state.subtests;
  },
  render: function() {
    var subtests = this.getSubtests();

    var exam = this.getExam();
    if(exam && exam.getState() !== Model.States.LOADED || subtests.getState() !== Model.States.LOADED) {
      return <LoadingModal/>
    }
      
    return <ExamEditor exam={this.getExam()} subtests={this.getSubtests()}/>;

  }

});

module.exports = ExamEditorWrapper;

