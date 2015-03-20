/** @jsx React.DOM */
'use strict';
var React = require('react');
var _ = require('underscore');
var Router = require('react-router');
var t = require('../../../translate.js');
var app = require('../../../app.js');
var Model = require('../../../spine/Model.js');
var LoadingModal = require('../../../components/LoadingModal.jsx');
var InlineModal = require('../../../components/InlineModal.jsx');

var TaskScreen = require('./TestViews/TaskScreen.jsx');

var Exam = require('../../../model/Exam.js');
var User = require('../../../model/User.js');
var Result = require('../../../model/Result.js');

var Bootstrap = require('react-bootstrap');
var Modal = Bootstrap.Modal;

var BlackSquare = require("../../../components/BlackSquare.jsx");

var States = {
  PRE_TEST: "PRE_TEST",
  SHOW_TEST: "SHOW_TEST",
  SAVING_RESULT: "SAVING_RESULT",
  FINISHED: "FINISHED",
};

var TestScreen = React.createClass({
  propTypes: {
    exam: React.PropTypes.instanceOf(Exam).isRequired,
    user: React.PropTypes.instanceOf(User).isRequired,
    result: React.PropTypes.instanceOf(Result).isRequired,
    testId: React.PropTypes.string.isRequired,
    isTraining: React.PropTypes.bool
  },
  mixins: [Router.State],
  getInitialState: function() {
    return { state: States.PRE_TEST };
  },
  getExam: function() {
    return this.props.exam;
  },
  getUser: function() {
    return this.props.user;
  },
  getResult: function() {
    return this.props.result;
  },
  getTestId: function() {
    return this.props.testId;
  },
  isTraining: function() {
    return this.props.isTraining;
  },
  initializeTest: function() {
    this.loadNextSubtest();
  },
  componentWillReceiveProps: function(newProps) {
    if(newProps.testId !== this.getTestId()) {
      this.initializeTest();
    }
  },
  componentWillMount: function() {
    this.initializeTest()
  },

  getFirstSubtestNotDone: function() {
    return this.getResult().getFirstSubtestNotDone(this.getTestId());
  },
  getRandomSubtestNotDone: function() {
    return this.getResult().getRandomSubtestNotDone(this.getTestId());
  },
  countSubtestsDone: function() {
    var subtests = this.getExam().getSubtestsForTest(this.getTestId());
    var result = this.getResult();
    var cnt = 0;
    for(var key in subtests) {
      var subtest = subtests[key];
      var answer = result.getAnswerForSubtestId(subtest.getId());
      if(!answer) break;
      cnt++;
    }
    return cnt;
  },
  countSubtests: function () {
    return this.getExam().getSubtestsForTest(this.getTestId()).length;
  },
  isRandomOrder: function() {
    return this.getExam().isRandomOrder();
  },
  loadNextSubtest: function(e) {
    if(e) e.preventDefault();
    
    var subtest;
    if(this.isRandomOrder()) {
      subtest = this.getRandomSubtestNotDone();
    } else { 
      subtest = this.getFirstSubtestNotDone();
    }
    if(subtest) {
      this.setState({
        subtest: subtest,
        state: States.PRE_TEST
      });
    } else {
      this.setState({
        state: States.FINISHED
      });
    }
  },
  startSubtest: function(e) {
    if(e) e.preventDefault();
    this.setState({
      state: States.SHOW_TEST,
      testStart: new Date()
    });
  },
  saveAnswer: function(solution) {
    var testEnd = new Date();
    var testStart = this.state.testStart;
    var delta = testEnd.getTime() - testStart.getTime();
    this.setState({
      state: States.SAVING_RESULT,
      hintsShown: false
    });
    var obj = {
      time: delta,
      startedAt: testStart.toISOString(),
      finishedAt: testEnd.toISOString(),
    };
    _.extend(obj, solution);
    var result = this.getResult();
    result.saveAnswer(this.state.subtest, obj, this.answerSaved)
  },
  answerSaved: function() {
    this.loadNextSubtest();
  },
  showTraining: function() {
    this.setState({showTraining: true});
  },
  componentDidUpdate: function(oldProps, oldState) {
    if(oldState.state === States.PRE_TEST && this.state.state === States.SHOW_TEST) {
      this.setState({white: !this.state.white});
    }
  },
  renderButtons: function() {
    var buttons = [
      <Router.Link to="menu" className="btn btn-default">{t("Stop test")}</Router.Link>
    ];
    if(this.isTraining() && this.getTestId() !== 'A') {
      buttons.push(<button className="btn btn-default"
        onClick={this.showTraining} 
        disabled={this.state.showTraining}>{t("Show hints")}</button>);
    }
    return buttons;
  },
  renderContent: function() {
    switch(this.state.state) {
      case States.PRE_TEST:
        var subtest = this.state.subtest;
        var ok = (
          <button className="btn btn-primary" onClick={this.startSubtest}>{t("OK")}</button>
        )
        return (
          <InlineModal title={t("Task")+ " " + (1 + this.countSubtestsDone()) + " " + t("of") + " " + this.countSubtests()}
            footer={ok}>
            {subtest.getDescription()}
          </InlineModal>
        );
      case States.SHOW_TEST:
        var subtest = this.state.subtest;
        var leftLabel = t("Task") + " " + (1 + this.countSubtestsDone()) + " " + t("of") + " " + this.countSubtests();
        var centerLabel = "Test " + this.getTestId() + "";
        var rightLabel = t("Logged in as:") + " " + app.getCurrentUserLogin();
       
        
        return (
          <TaskScreen
            centerLabel={centerLabel}
            leftLabel={leftLabel}
            onSubmit={this.saveAnswer}
            rightLabel={rightLabel}
            buttons={this.renderButtons()}
            showTraining={this.state.showTraining}
            subtest={subtest}/>
        );
      
      case States.SAVING_RESULT:
        return (
          <InlineModal title={t("Saving answer")}>
            {t("Please wait...")}
          </InlineModal>
        );

      case States.FINISHED:
        var ok = (
          <Router.Link className="btn btn-primary" to='menu'>{t("Back to menu")}</Router.Link>
        )
        return (
          <InlineModal title={t("Test done")}
            footer={ok}>
            Test {this.getTestId()} {t("finished")}.
          </InlineModal>
        );
        
    }
    
    
  },
  render: function() {
    return (
      <div>
        <BlackSquare white={this.state.white}/>
        {this.renderContent()}
      </div>
    )
    
  }
});


var TestScreenWrapper = React.createClass({
  propType: {
    training: React.PropTypes.bool
  },
  mixins: [Router.State],
  componentWillMount: function() {
    this.reload();
  },
  reload: function() {
    var user = app.getCurrentUser();
    this.setState({user:user});
    this.loadExam(user);
  },
  loadExam: function(user) {
    // var user = this.state.user;
    
    var exam;
    if(this.props.isTraining){
      exam = new Exam(user.getCurrentTrainingId());
    } else {
      exam = new Exam(user.getCurrentExamId());
    }
    
    exam.load(function() {
      this.setState({exam:exam});
      this.loadResult()
    }.bind(this));
  },
  loadResult: function() {
    var user = this.state.user;
    var exam = this.state.exam;
    if(user.getState() === Model.States.LOADED && exam.getState() === Model.States.LOADED) {
      if(this.props.isTraining) {
        var result = user.getTrainingResult(exam);
        this.setState({result:result});        
      } else {
        var result = user.getExamResult(exam, function() {
          this.setState({result: result});
        }.bind(this));    
      }
    }
  },
  renderLoadingModal: function() {
    var progress = 0;
    var els = [this.state.result, this.state.user, this.state.exam];
  
    for(var k in els) {
      var el = els[k];
      if(el && el.getState() === Model.States.LOADED) {
        progress++;
      }
    }
    return (
      <LoadingModal progress={progress} maxProgress={els.length}/>
    );
  },
  render: function() {
    if(!this.state.result || this.state.result.getExamState() === Result.States.LOADING) {
     
      return this.renderLoadingModal();
    }
    return (
      
        <TestScreen
          exam={this.state.exam}
          user={this.state.user}
          result={this.state.result}
          testId={this.getParams().testId}
          isTraining={this.props.isTraining}/>
    );
  }
  
});

module.exports = TestScreenWrapper;
