/** @jsx React.DOM */
'use strict';
var React = require('react');
var pouchdb = require('pouchdb');
var _ = require('underscore');

var t = require('../translate.js');
var app = require('../app.js');
var config = require('../config.js');

var Ajax = require('../spine/Ajax.js');

var data = {
  "_users": [
    {
      _id: "org.couchdb.user:admin",
      name: "admin",
      password: "admin",
      roles: ["admin"],
      type: "user"
    }
  ],
  "chess-exams": [],
  "chess-results": [],
  "chess-subtests": [
    {
      _id: "07b9589c-c82a-4403-a706-906b54dd5af4",
      label: "ZadanieE8 – test",
      description: "Powtórz sekwencję posunięć.",
      test: "E",
      highlights: { },
      data: {
        board: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",
        positions: [
          "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR",
          "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR",
          "rnbqkbnr/pppp1ppp/8/4p3/4P3/2N5/PPPP1PPP/R1BQKBNR",
          "rnbqk1nr/pppp1ppp/8/2b1p3/4P3/2N5/PPPP1PPP/R1BQKBNR",
          "rnbqk1nr/pppp1ppp/8/2b1p3/4P3/2N3P1/PPPP1P1P/R1BQKBNR",
          "rnbqk2r/pppp1ppp/5n2/2b1p3/4P3/2N3P1/PPPP1P1P/R1BQKBNR",
          "rnbqk2r/pppp1ppp/5n2/2b1p3/4P3/2N3P1/PPPP1PBP/R1BQK1NR",
          "rnbqk2r/pp1p1ppp/2p2n2/2b1p3/4P3/2N3P1/PPPP1PBP/R1BQK1NR",
          "rnbqk2r/pp1p1ppp/2p2n2/2b1p3/4P3/2N3P1/PPPPQPBP/R1B1K1NR",
          "rnbqk2r/pp3ppp/2p2n2/2bpp3/4P3/2N3P1/PPPPQPBP/R1B1K1NR",
          "rnbqk2r/pp3ppp/2p2n2/2bpp3/4P3/2NP2P1/PPP1QPBP/R1B1K1NR",
          "rnbq1rk1/pp3ppp/2p2n2/2bpp3/4P3/2NP2P1/PPP1QPBP/R1B1K1NR",
          "rnbq1rk1/pp3ppp/2p2n2/2bpp3/4P3/2NP1NP1/PPP1QPBP/R1B1K2R",
          "r1bq1rk1/pp1n1ppp/2p2n2/2bpp3/4P3/2NP1NP1/PPP1QPBP/R1B1K2R",
          "r1bq1rk1/pp1n1ppp/2p2n2/2bpp3/4P3/2NP1NP1/PPP1QPBP/R1B2RK1",
          "r1bqr1k1/pp1n1ppp/2p2n2/2bpp3/4P3/2NP1NP1/PPP1QPBP/R1B2RK1"
        ],
        moves: [
          "e2-e4",
          "e7-e5",
          "b1-c3",
          "f8-c5",
          "g2-g3",
          "g8-f6",
          "f1-g2",
          "c7-c6",
          "d1-e2",
          "d7-d5",
          "d2-d3",
          "e8-g8 h8-f8",
          "g1-f3",
          "b8-d7",
          "e1-g1 h1-f1",
          "f8-e8"
        ]
      }
    }
  ]
};

var DatabaseSetup = React.createClass({
  getInitialState: function() {
    return {};
  },
  setupDatabase: function() {
    this.setState({ disabled: true });
    var promises = [];
    Object.keys(data).forEach(function(key) {
      var db = new pouchdb(config.dbAddr + "/" + key);
      data[key].forEach(function(value) {
        promises.push(db.put(value));
      });
      if(key === "_users") {
        promises.push(new Promise(function(resolve, reject) {
          var security = { admins: {
            roles: ["admin"]
          }};
          Ajax.put(config.dbAddr + "/_users/_security", {
            200: resolve,
            error: reject
          }, { data: security });
        }));
      }
    });
    Promise.all(promises).then(function() {
      alert(t("Success"));
      app.refreshTo('#/');
    }).catch(function(error) {
      console.log("Błąd", error);
    });
  },
  render: function() {
    return (
      <div style={{ textAlign: "center" }}>
        <br/><br/><br/><br/><br/><br/><br/><br/>
        <button className="btn btn-default" disabled={this.state.disabled} onClick={this.setupDatabase}>{t("Setup database")}</button>
      </div>
    );
  }
});

module.exports = DatabaseSetup;
