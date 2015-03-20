/** @jsx React.DOM */
'use strict';
var React = require('react');
var Router = require('react-router');
var t = require('../../translate.js');
var reactListener = require('../../spine/reactListener.js');
var Bootstrap = require('react-bootstrap');
var _ = require('underscore');

var Users = require('../../model/Users.js');
var User = require('../../model/User.js');
var Exam = require('../../model/Exam.js');
var Exams = require('../../model/Exams.js');

var Results = require('../../model/Exam.js');
var Result = require('../../model/Result.js');
var ExamResult = React.createClass({
  propTypes: {
    result: React.PropTypes.instanceOf(Result).isRequired,
  },
  mixins: [
    reactListener('result')
  ],
  getResult: function() {
    return this.props.result;
  },
  getExam: function() {
    return this.getResult().getExam();
  },
  getCSV: function() {
    var res = [];
    var corr = _.map(["A","B","C","D","E"], function(testId) {
      return this.getExam().getSubtestsForTest(testId);
    }.bind(this));
    corr = _.flatten(corr, true);
    var result = this.getResult();
    var rows = _.map(corr, function(sub, idx) {
      var answer = result.getAnswerForSubtestId(sub.getId());
      var correct;
      if(answer) {
        correct = sub.isAnswerCorrect(answer);
      }
      var cells = [
        "Test " + sub.getTestId(),
        sub.getLabel(),
        answer?(correct?"1":"0"):"",
        (answer?sub.getPrintableAnswer(answer):''),
        answer?answer.time/1000.:"",
        answer?answer.startedAt:"",
      ];
      return _.map(cells, JSON.stringify).join("\t");
    });
    
    return rows.join("\n");
  },
  loadCSV: function() {
    var data = encodeURI(this.getCSV());
    window.open("data:text/csv;charset=utf-8," + data);
  },
  renderTest: function(testId) {
    var corr = this.getExam().getSubtestsForTest(testId);
    var result = this.getResult();
    var rows = _.map(corr, function(sub, idx) {
      var answer = result.getAnswerForSubtestId(sub.getId());
      var correct;
      if(answer) {
        correct = sub.isAnswerCorrect(answer);
      }
      var cells = [
        "Test " + testId,
        sub.getLabel(),
        answer?(correct?"1":"0"):"",
        (answer?sub.getPrintableAnswer(answer):''),
        answer?answer.time/1000.:"",
        answer?answer.startedAt:"",
      ];
      return (
        <tr key={idx} className={answer&&(correct?"success":"danger")}>
        {/*idx === 0?<td rowSpan={corr.length}>Test {testId}</td>:null*/}
        {_.map(cells, function(cell, key) {return <td key={key}>{cell}</td>})}
        </tr>
      );
    });
    
    return (
      <tbody key={testId}>
        {rows}
      </tbody>
    );
  },
  render: function() {
    var headers = _.map(["Test", "Podtest", "Poprawność", "Odpowiedź", "Czas", "Moment rozpoczęcia"], function(item) {
      return <th key={item}>{item}</th>
    });
    var body = [];
    return (
      <div>
      <table className="table table-bordered">
        <thead>
          <tr>{headers}</tr>
        </thead>
        {_.map(["A","B","C","D","E"], this.renderTest)}
        
      </table>
        <button className="btn btn-primary" onClick={this.loadCSV}>CSV</button>
      </div>
    );
  } 
});

module.exports = ExamResult;
