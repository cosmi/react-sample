/** @jsx React.DOM */
'use strict';
var React = require('react');
var t = require('../../../translate.js');

var LoadedTestScreen = React.createClass({
  propTypes: {
    onReturn: React.PropTypes.func.isRequired,
    onStartTest: React.PropTypes.func.isRequired,
  },
  render: function() {
    return (
      <div className="fullscreen">
        <div className="panel panel-default menu-panel">
          <div className="panel-heading">
            <h3 className="panel-title">{t('Loading test')}</h3>
          </div>
          <div className="panel-body centered">
            <div className="btn-group-vertical" role="group">
              <button className="btn btn-default" onClick={this.props.onStartTest}>{t("Begin test")}</button><br/>
              <button className="btn btn-default" onClick={this.props.onReturn}>{t("Back to menu")}</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = LoadedTestScreen;
