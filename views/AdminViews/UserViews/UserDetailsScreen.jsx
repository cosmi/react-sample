/** @jsx React.DOM */
'use strict';
var React = require('react');
var Router = require('react-router');
var t = require('../../../translate.js');
var reactListener = require('../../../spine/reactListener.js');
var Bootstrap = require('react-bootstrap');
var Model = require('../../../spine/Model.js');
var Users = require('../../../model/Users.js');
var User = require('../../../model/User.js');
var Exam = require('../../../model/Exam.js');
var Exams = require('../../../model/Exams.js');
var LoadingModal = require('../../../components/LoadingModal.jsx');
var InlineModal = require('../../../components/InlineModal.jsx');

var Results = require('../../../model/Exam.js');
var Result = require('../../../model/Result.js');
var _ = require('underscore');



var UserDetailsScreen = React.createClass({
  propTypes: {
    user: React.PropTypes.instanceOf(User),
    exams: React.PropTypes.instanceOf(Exams).isRequired,
  },
  mixins: [
    reactListener('exams'),
    reactListener('user')
  ],
  shownData: {
    login: "Login",
    realName: "Imię i nazwisko",
    birthDate: "Data urodzin",
    gender: "Płeć",
    moderator: "Moderator"
  },
  getInitialState: function() {
    return {};
  },
  componentWillMount: function() {
    this.reloadResults()
  },
  componentDidUpdate: function(oldprops, oldstate) {
    if(oldprops.user !== this.props.user || oldstate.showArchived !== this.state.showArchived) {
      this.reloadResults();
    }
  },
  reloadResults: function() {
    var exams = this.getExams();
    var obj = {};
    var user = this.props.user;
    for(var k in exams) {
      var exam = exams[k];
      var result = user.getExamResult(exam, this.forceUpdate.bind(this, null));
      obj[exam.getId()] = result;
    }
    
    this.setState({results: obj});
  },
  getExams: function() {
    var exams = this.props.exams.getAllRows();
    var closed = _.filter(exams, function(it) {
      return it.getExamStatus() === Exam.States.CLOSED 
    });
    var archived = []
    if(this.state.showArchived) {
      archived = _.filter(exams, function(it) {
        return it.getExamStatus() === Exam.States.ARCHIVED;
      });
    }
    return closed.concat(archived);
  },
  getResultLabel: function(exam) {
    var result = this.state.results[exam.getId()];
    if(result && result.getState() === Model.States.LOADED) {
      var answers = result.countAnswers() ;
      if(answers === 0) {
        return t("No responses");
      }
      return answers + " " + t("responses");
    } else {
      
    }
  },
  showArchived: function(e) {
    e.preventDefault();
    this.setState({showArchived: true});
  },
  render: function() {
    var user = this.props.user;

    var exams = this.props.exams;
    var data = user.getUserData();
    
    if(data.moderator) {
      var prefix = "org.couchdb.user:";
      data.moderator = data.moderator.slice(prefix.length);
    }
    
    var dataList = [];
    for (var key in this.shownData) {
      dataList.push(<dt key={"dt-"+key}>{this.shownData[key]}</dt>);
      dataList.push(<dd key={"dd-"+key}>{data[key]}</dd>);
    }
    var currentExamId = user.getCurrentExamId();
    var currentExam = currentExamId && exams && exams.getRowById(currentExamId);
    

    var examResults = [];
    var examRows = this.getExams();
    for(var key in examRows) {
      var exam1 = examRows[key];
      
      examResults.push(
        <li key={"dd-"+key}>
          {exam1.getLabel()} - <Router.Link to="admin-user-exam-results" 
            params={{userId: user.getId(), examId: exam1.getId()}}>
            {this.getResultLabel(exam1)}
          </Router.Link>
        </li>
      );
    }
    
    var footer = (
      <Router.Link className="btn btn-default" to='admin-user-list'>Powrót
      </Router.Link>
    );
    return (
      <InlineModal title="Dane użytkownika" wide={true} footer={footer}>
        <dl className="dl-horizontal">
        {dataList}
          <dt> Przypisany egzamin </dt>
          <dd> {
            currentExam?
            <Router.Link to="admin-user-exam-results" params={{userId: user.getId(), examId: currentExam.getId()}}>{currentExam.getLabel()}</Router.Link>
            :"Brak"
            }
          </dd>
        </dl>
        <h3>Wyniki egzaminów</h3>
        <ul className="dl-horizontal">
            {examResults}
            {!this.state.showArchived?
              <a href="#" onClick={this.showArchived}>{t("Show archived")}</a>
              :null}
        </ul>
      </InlineModal>
    );
  }
});

var UserDetailsScreenWrapper = React.createClass({
  mixins: [Router.State],
  componentWillMount: function() {
    this.reload();
    var exams=  new Exams();

    exams.load(function() {
      this.setState({exams: exams});
    }.bind(this));
  },
  getInitialState: function() {
    return {user: null, userId: null};
  },
  reset: function() {
    this.replaceState(this.getInitialState());
    this.reload();
  },
  reload: function() {
    var newUserId = this.getParams().userId;
    this.setState({user: null, userId:newUserId})
    Users.getById(this.getParams().userId, function(user) { 
      if(this.state.userId === newUserId){
        var model = User.makeFromPouchDB(user);
        this.setState({user: model});
      }
    }.bind(this));
  },
  componentDidUpdate: function(oldProps) {
    if(this.getParams().userId !== this.state.userId) {
      this.reload();
    }
  },
  render: function() {
    var user = this.state.user;
    var exams = this.state.exams;
    if(!user || !exams || user.getState()!=Model.States.LOADED || exams.getState()!=Model.States.LOADED) {
      return <LoadingModal/>;
    }
    return (
      <UserDetailsScreen user={user} exams={exams}/>
    );
  }
});


module.exports = UserDetailsScreenWrapper;
