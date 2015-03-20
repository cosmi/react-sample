/** @jsx React.DOM */
'use strict';
var React = require('react');
var t = require('../../../translate.js');

var ErrorScreen = React.createClass({
  propTypes: {
    onReturn: React.PropTypes.func.isRequired,
  },
  render: function() {
    return (
      <div className="fullscreen">
        <div className="panel panel-default menu-panel">
          <div className="panel-heading">
            <h3 className="panel-title">{t("Error")}</h3>
          </div>
          <div className="panel-body centered">
            {t("Error occurred")}
            <br/>
            <button className="btn btn-default" onClick={this.props.onReturn}>{t("Back to menu")}</button>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = ErrorScreen;
