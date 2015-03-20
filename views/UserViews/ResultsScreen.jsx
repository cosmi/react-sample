/** @jsx React.DOM */
'use strict';
var React = require('react');
var Router = require('react-router');
var t = require('../../translate.js');
var app = require('../../app.js');
var reactListener = require('../../spine/reactListener.js');
var Bootstrap = require('react-bootstrap');
var Model = require('../../spine/Model.js');
var Users = require('../../model/Users.js');
var User = require('../../model/User.js');
var Exam = require('../../model/Exam.js');
var Exams = require('../../model/Exams.js');
var LoadingModal = require('../../components/LoadingModal.jsx');
var InlineModal = require('../../components/InlineModal.jsx');

var Results = require('../../model/Exam.js');
var Result = require('../../model/Result.js');

var ExamResultsComponent = require('./ExamResultsComponent.jsx');

var Alert=Bootstrap.Alert;

var ResultsScreen = React.createClass({
  propTypes: {
    result: React.PropTypes.instanceOf(Result),
  },
  mixins: [
    reactListener('result')
  ],
  renderSummary: function() {
    var rows = [];
    var tests = "ABCDE".split("");
    var points = this.props.result.getPoints();
    var max = this.props.result.getExam().getPoints();
    for(var i in tests) {
      var test = tests[i];
      rows.push(
        <tr key={i}>
          <td>Test {test}</td>
          <td>{points[test]}</td>
          <td>{max[test]}</td>
        </tr>
      )
      
    }
    
    return (
      <table className="table table-bordered table-striped">
        <thead><tr><th>Test</th><th>Uzyskane punkty</th><th>Maksimum</th></tr></thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    )
    
  },
  renderInfo: function() {
    var user = this.props.result.getUser();
    var exam = this.props.result.getExam();
    var data = user.getUserData();
    var vals = [
      [t("Login"), data.login],
      [t("Firstname and lastname"), data.realName],
      [t("Birthdate"), data.birthdate],
      [t("Exam"), exam.getLabel()]
    ];
    var list = [];
    for (var key in vals) {
      list.push(<dt key={"dt-"+key}>{vals[key][0]}</dt>);
      list.push(<dd key={"dd-"+key}>{vals[key][1]}</dd>);
    }
    return <dl className="dl-horizontal">{list}</dl>
  },
  handleRemove: function() {
    if(confirm(t("Are you sure?"))){
      this.props.result.destroy();
    }
  },
  renderRemove: function() {
    if(app.hasRole('admin')) {
      return (
        <div className="alert alert-danger centered">
          <button className="btn btn-danger" onClick={this.handleRemove}>{t("Remove results")}</button>
        </div>
      );
    }
  },
  render: function() {
    var params = this.props.asAdmin?{userId: this.props.user.getId()}:undefined
    var footer = (
      <Router.Link className="btn btn-default" to={this.props.asAdmin?'admin-user-details':'menu'} params={params}>
        {t("Back")}
      </Router.Link>
    );
    return (
      <InlineModal title={t("Results")} wide={true}footer={footer}>
        <div className="row">
          <div className="col-xs-6">
      {this.renderInfo()}
      {this.renderRemove()}
            
          </div>
          <div className="col-xs-6">
          {this.renderSummary()}
          </div>
        </div>
        <ExamResultsComponent result={this.props.result}/>
      </InlineModal>
    );
  }
});

var ResultsScreenWrapper = React.createClass({
  mixins: [Router.State],
  getUserId: function() {
    var userId =this.getParams().userId;
    if(!userId) userId = app.getCurrentUser().getId();
    return userId;
  },
  getExamId: function() {
    var examId =this.getParams().examId;
    if(!examId) {
      examId = app.getCurrentUser().getCurrentExamId();
    }
    return examId;
  },
  asAdmin: function() {
    return !!this.getParams().userId;
  },
  componentWillMount: function() {
    this.reload();
  },
  getInitialState: function() {
    return {user: null, userId: null};
  },
  reset: function() {
    this.replaceState(this.getInitialState());
    this.reload();
  },
  reloadUser: function() {
    if(this.asAdmin()) {
      var user = new User(this.getUserId());
      user.load(function() {
        this.setState({user: user});
      }.bind(this));
    } else {
      this.setState({user: app.getCurrentUser()});
    }
  },
  reloadExam: function() {
    var exam = new Exam(this.getExamId());
    exam.load(function() {
      this.setState({exam: exam});
    }.bind(this))
    
  },
  reload: function() {
    var newUserId = this.getParams().userId;
    
    this.reloadUser();
    this.reloadExam();
  },
  componentDidUpdate: function(oldProps) {
    var exam = this.state.exam;
    var user = this.state.user;
    if(user && user.getId() != this.getUserId()) {
      this.reloadUser();
    }
    if(exam && exam.getId() != this.getExamId()) {
      this.reloadExam();
    }
  },
  render: function() {

    var exam = this.state.exam;
    var user = this.state.user;
    if(!exam || !user || !(exam.getState() == Model.States.LOADED && user.getState() == Model.States.LOADED)) {
      return <LoadingModal/>;
    }
    
    var result = user.getExamResult(exam);
    return (
      <ResultsScreen result={result} user={user} exam={exam} asAdmin={this.asAdmin()}/>
    );
  }
});


module.exports = ResultsScreenWrapper;
