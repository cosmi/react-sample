var React = require('react');
var Router = require('react-router');

var Subtests = require('../../../model/Subtests.js');
var Subtest = require('../../../model/Subtest.js');
var _ = require('underscore');

var t = require('../../../translate.js');

var Exam = require('../../../model/Exam.js');
var Exams = require('../../../model/Exams.js');


var reactListener = require('../../../spine/reactListener.js');

var Bootstrap = require('react-bootstrap');
var Glyphicon = Bootstrap.Glyphicon;

var SubtestPane = React.createClass({
  propTypes: {
    subtest: React.PropTypes.instanceOf(Subtest).isRequired,
    onRemove: React.PropTypes.func
  },
  mixins: [reactListener('subtest')],
  handleRemove: function(e) {
    e.preventDefault();
    if(confirm(t("Confirm task deletion"))) {
      this.props.subtest.destroy(this.props.onRemove.bind(null, this.props.subtest));
    }
  },
  renderBadges: function() {
    return [
       <button key="1" className="btn btn-danger btn-xs btn-block" onClick={this.handleRemove}><Glyphicon glyph="trash"/></button>,
       <Router.Link key="2" className="btn btn-danger btn-xs btn-block" to="task-editor-edit" params={{taskId: this.props.subtest.getId()}}>
          <Glyphicon glyph="pencil"/></Router.Link>,
    ];
  },
  render: function() {
    var subtest = this.props.subtest;
    var badges = this.renderBadges();
    return (
      <tr className="list-group-item" style={{ display: "table-row" }}>
        <td className="label-cell">
          {subtest.getLabel()}
        </td>
        <td className="btns-cell">
          {badges}
        </td>
      </tr>
    );
  }
});

module.exports = SubtestPane