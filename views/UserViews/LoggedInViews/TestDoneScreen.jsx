/** @jsx React.DOM */
'use strict';
var React = require('react');
var t = require('../../../translate.js');

var Background = require('../../../components/Background.jsx');

var TestDoneScreen = React.createClass({
  propTypes: {
    onReturn: React.PropTypes.func.isRequired,
  },
  render: function() {
    return (
      <div className="fullscreen">
        <Background/>
        <div className="panel panel-default menu-panel">
          <div className="panel-heading">
            <h3 className="panel-title">{t("The end")}</h3>
          </div>
          <div className="panel-body centered">
            <h4>Test zakończony.</h4>{/* TODO to chyba trzeba zrobić ładniej */}
            <button className="btn btn-default" onClick={this.props.onReturn}>{t("Back to menu")}</button>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = TestDoneScreen;
