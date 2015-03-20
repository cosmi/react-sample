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


var SubtestPane = require('./SubtestPane.jsx');


var SubtestList = React.createClass({
  propTypes: {
    testId: React.PropTypes.string.isRequired,
    subtests: React.PropTypes.instanceOf(Subtests).isRequired,
  },
  mixins: [reactListener('subtests')],
  handleRemove: function(subtest) {
    this.props.subtests.load();
  },
  render: function() {
    var testId = this.props.testId;
    var subtests = _.filter(this.props.subtests.getAllRows(), function(item) {
      return item.getTestId() === testId;
    });
    
    
    subtests = _.sortBy(subtests, function(item) {
      return item.getCreatedAt() || "0000"+ item.getLabel();
    });
    subtests = subtests.reverse();
    
    var items = [];
    for(var i in subtests) {
      var subtest = subtests[i];
      var id = subtest.getId();
      items.push(<SubtestPane subtest={subtest} key={"key-"+id} onRemove={this.handleRemove}/>);
    }

    return (
      <div className="task-list">
        <h3>Test {testId} ({subtests.length})</h3>
        <Router.Link to="task-editor-new" params={{testId: testId}} className="btn btn-primary btn-block">{t("New task")}</Router.Link>
        <table className="list-group">
          <tbody>
            {items}
          </tbody>
        </table>
        
      </div>
    );
  }
});

var SubtestsEditor = React.createClass({
  propTypes: {
     subtests: React.PropTypes.instanceOf(Subtests), // not required
  },
  mixins: [reactListener('subtests')],
  getSubtests: function() {
    return this.props.subtests;
  },
  renderSelector: function() {
    var panes = [];
    var tests = ["A", "B", "C", "D", "E"];
    for(var k in tests) {
      var test = tests[k];

      panes.push(
        <SubtestList key={test} testId={test} subtests={this.getSubtests()}/>
      )
    }
    return (
      <div className="task-lists">
        {panes}
      </div>
    );
  },
  render: function() {
    // if(this.state.error) {
//       return (
//         <InfoModalComponent title="Błąd">
//           <p>{this.state.error}</p>
//           <button className="btn btn-default" onClick={this.clearErrors}>Anuluj</button>
//         </InfoModalComponent>
//       );
//     }
//     if(this.state.saving) {
//       return <InfoModalComponent title="Zapisywanie">Proszę czekać...</InfoModalComponent>;
//     }
//     if(this.state.saved) {
//       return (
//         <InfoModalComponent title="Zapisano">
//           Udało się zapisać nowy egzamin.
//           <p>{this.state.error}</p>
//           <Router.Link to="exam-list">OK</Router.Link>
//         </InfoModalComponent>
//       );
//       //TODO: coś lepszego
//     }
    var subtests = this.getSubtests();
    if(!subtests || subtests.getState() !== Model.States.LOADED) {
      return <InfoModalComponent title={t("Loading")}>{t("Please wait...")}</InfoModalComponent>;
    }
    return (
      <div className='exam-editor'>
        {this.renderSelector()}
      </div>
    );
  }
});

var SubtestsEditorWrapper = React.createClass({
  mixins: [Router.State],
  getInitialState: function() {
    return {};
  },
  componentWillMount: function() {
    this.reload();
  },
  getExamId: function() {
    return this.getParams().examId;
  },
  componentDidUpdate: function(prevProps) {
    if(this.getExam().getId() != this.getExamId()) {
      this.reload();
    }
  },
  reload: function() {
    var id = this.getExamId();
    var model = id && new Exam(id);
    this.setState({exam: model});
    if(model) model.load();

    var subtests = new Subtests();
    this.setState({subtests: subtests});
    subtests.load();
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
    return (
      <MenuScreen title="" returnTo='admin' wide={true}>
        <SubtestsEditor exam={this.getExam()} subtests={this.getSubtests()}/>
      </MenuScreen>
    );

  }

});

module.exports = SubtestsEditorWrapper;

