var React = require('react');

var Subtests = require('../../../model/Subtests.js');
var Subtest = require('../../../model/Subtest.js');
var _ = require('underscore');
var t = require('../../../translate.js');

var Exam = require('../../../model/Exam.js');
var Exams = require('../../../model/Exams.js');


var SubtestPane = React.createClass({
  propTypes: {
    subtest: React.PropTypes.instanceOf(Subtest).isRequired,
    position: React.PropTypes.number,
    maxPosition: React.PropTypes.number.isRequired,
    onSwitch: React.PropTypes.func,
    onChangePosition: React.PropTypes.func
  },
  positionHandler: function(direction) {
    return function(e) {
      var position = this.props.position;
      if(position+direction>= 0 && position+direction < this.props.maxPosition) {
        this.props.onChangePosition(position + direction);
      }
      e.preventDefault();
      e.stopPropagation();
    }.bind(this);
  },
  switchHandler: function(e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.onSwitch();
  },
  renderBadges: function() {
    return (
      <div className="btn-group btn-group-xs" role="group" aria-label="...">
        <button className="btn btn-default" onClick={this.positionHandler(-1)}>-</button>
        <button className="btn btn-default" disabled>{1 + this.props.position }</button>
        <button className="btn btn-default" onClick={this.positionHandler(+1)}>+</button>
      </div>
    );
  },
  render: function() {
    var subtest = this.props.subtest;
    var position = this.props.position;
    var selected = !isNaN(position)
    var badges;
    if(selected) {
      badges = this.renderBadges();
    }
    return (
      <li className={"list-group-item" + (selected?" active": "")} onClick={this.switchHandler}>
        {subtest.getLabel()}
        {badges}
      </li>
    );
  }
});

module.exports = SubtestPane