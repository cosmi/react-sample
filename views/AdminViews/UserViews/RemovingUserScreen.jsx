/** @jsx React.DOM */
'use strict';
var React = require('react');
var t = require('../../../translate.js');

var RemovingUserScreen = React.createClass({
  render: function() {
    return (
      <div className="fullscreen">
        <div className="panel panel-default menu-panel">
          <div className="panel-heading">
            <h3 className="panel-title">{t("Removing user")}</h3>
          </div>
          <div className="panel-body centered">
            {t("Please wait...")}
          </div>
        </div>
      </div>
    );
  }
});

module.exports = RemovingUserScreen;
