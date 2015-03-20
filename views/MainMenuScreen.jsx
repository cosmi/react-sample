/** @jsx React.DOM */
'use strict';
var React = require('react');
var Router = require('react-router');
var Bootstrap = require('react-bootstrap');
var Alert = Bootstrap.Alert;

var app = require('../app.js');
var Background = require('../components/Background.jsx');
var Model = require('../spine/Model.js');
var Users = require('../model/Users.js');
var reactListener = require('../spine/reactListener.js');
var t = require('../translate.js');

var testTypes = ['A', 'B', 'C', 'D', 'E'];

var MainMenuScreen = React.createClass({
  canAdminister: function() {
    return app.hasRole('admin');
  },
  mixins:[reactListener('exam'), reactListener('result')],
  handleLogout: function() {
    Users.logOut();
  },
  getExam: function() {
    return this.props.exam;
  },
  getEnabledTest: function() {
    var result = this.props.result;
    if(!result) return -1;
    if(result.getState() == Model.States.LOADED) {
      for(var i in testTypes) {
        if (result.getFirstSubtestNotDone(testTypes[i])) {
          return i;
        }
      }
      return testTypes.length;
    } else return -1;
  },
  render: function() {
    var err;
    
    if(!this.props.exam || this.props.exam.getState() === Model.States.ERROR) {
      err = (
        <div className="alert alert-danger centered" role="alert">
          {t("No current exam")}
        </div>
      );
    } else if(this.props.exam.getState() === Model.States.LOADING) {
      err = (
        <div className="alert alert-info centered" role="alert">
          {t("Loading data... Please wait.")}
        </div>
      );
    }
    var enabledTest = -1;
    var items = [];
    if(!err) {
      enabledTest = this.getEnabledTest();
      for(var i in testTypes) {
        var testType = testTypes[i];
        items.push(
          <li className="list-group-item" key={i}>
            <div className="row list-group-item-div">
              <span className="list-item-description">{'Test ' + testType}</span>
              <div className="btn-group menu-list-button-group" role="group">
                <Router.Link className="btn btn-default" to='training' params={{ testId: testType }}>{t("Train")}</Router.Link>
                <Router.Link className="btn btn-default btn-primary" to='test' params={{ testId: testType }} disabled={i!==enabledTest}>
                  {t("Test")}
                </Router.Link>
              </div>
            </div>
          </li>
        );
      }
      items = (
        <ul className="list-group main-menu-content">
          {items}
        </ul>
      );
    }
    var exam = this.getExam();
    var resultsReady;  
    if(enabledTest === testTypes.length) {
      
      var showResults = exam.areResultsEnabled()?
        <Router.Link to='user-exam-results'>{t("See results")}</Router.Link>:"";
      
      resultsReady = (
        <div className="alert alert-success centered" role="alert">
        <strong>{t("Exam finished")}</strong> {showResults}
        </div>
      )
    }
    
    return (
      <div className="fullscreen">
        <Background/>
        <div className="panel panel-default menu-panel main-menu-panel">
          <div className="panel-heading centered">
            <h3 className="panel-title">Menu główne</h3>
          </div>
          <div className="panel-body">
            <div className="alert alert-info centered" role="alert">
              {t("Welcome")} <strong>{app.getCurrentUserLogin()}</strong>.
            </div>
            {err}
            {items}
            {resultsReady}
          </div>
          
          <div className="panel-footer">
            <div className="btn-group btn-group-justified main-menu-footer" role="group">
              <Router.Link className="btn btn-default" to='change-password'>{t("Change password")}</Router.Link>
              {this.canAdminister() && <Router.Link className="btn btn-default" to='admin'>{t("Administer")}</Router.Link>}
              <div className="btn-group" role="group">
                <button className="btn btn-default" onClick={this.handleLogout}>{t("Logout")}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

var MainMenuWrapper = React.createClass({
  componentWillMount: function() {
    this.reload();
  },
  getInitialState: function() {
    return {}
  },
  reload: function() {
    var examId = app.getCurrentUser().getCurrentExamId();
    if(examId) {
      var exam = new Exam(examId);
      this.setState({exam: exam});
      exam.load();
    }
  },

  render: function() {
    var result = app.getCurrentUser().getExamResult(this.state.exam);
    return (
      <MainMenuScreen
        exam={this.state.exam} result={result}/>
    );
  }
  
});


module.exports = MainMenuWrapper;
