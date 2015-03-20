/** @jsx React.DOM */
'use strict';
var React = require('react');
var t = require('../../../translate.js');

var Background = require('../../../components/Background.jsx');

var LoadingScreen = React.createClass({
  render: function() {
    return (
      <div className="fullscreen">
        <Background/>
        <div className="panel panel-default menu-panel">
          <div className="panel-heading">
            <h3 className="panel-title">{t('Loading test')}</h3>
          </div>
          <div className="panel-body centered">
            {t("Please wait...")}
          </div>
        </div>
      </div>
    );
  }
});

module.exports = LoadingScreen;
