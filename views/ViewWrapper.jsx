/** @jsx React.DOM */
'use strict';
var React = require('react');
var t = require('../translate.js');
var app = require('../app.js');

var Router = require('react-router'),
  RouteHandler = Router.RouteHandler;

var ViewWrapper = React.createClass({
  render: function() {
    return (
      <div>
        <div className="container">
          <RouteHandler/>
        
        </div>
        <div className="copyright-bar">© 2015 Software Mansion Sp. z o.o.</div>
      </div>
    );
  }
});

module.exports = ViewWrapper;
