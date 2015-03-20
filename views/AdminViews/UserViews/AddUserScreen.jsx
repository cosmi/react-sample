/** @jsx React.DOM */
'use strict';
var React = require('react');
var t = require('../../../translate.js');

var $ = require('../../../vendor/jquery.js');
var BirthdayPicker = require('birthday-picker');
var _ = require('underscore');

var app = require('../../../app.js');
var Exams = require('../../../model/Exams.js');
var reactListener = require('../../../spine/reactListener.js');
var ExamSelector = require('../../../components/ExamSelector.jsx');
var Router = require('react-router');
var Users = require('../../../model/Users.js');

var ExamSelectorWrapper = React.createClass({
  getInitialState: function() {
    return {};
  },
  componentWillMount: function() {
    this.reload();
  },
  reload: function() {
    var model = new Exams();
    this.setState({exams: model});
    model.load();
  },
  getExams: function() {
    return this.state.exams;
  },
  render: function() {
    return <ExamSelector exams={this.getExams()} {...this.props}/>;
  }
});


var Subtests = require('../../../model/Subtests.js');
var _ = require('underscore');
var MenuScreen = require("../../../components/IndexMenuView.jsx");
var InlineModal = require("../../../components/InlineModal.jsx");
var LoadingModal = require("../../../components/LoadingModal.jsx");
var InfoModalComponent = require("../../../components/InfoModalComponent.jsx");


var AddUserScreen = React.createClass({
  mixins: [reactListener('user')],
  getInitialState: function() {
    if(this.isNew()) {
      return {role: 'user'};
    } else {
      var user = this.getUser().getData().doc;
      return {
        role: (user.roles || [])[0],
        birthdate: user.birthdate,
        name: user.name,
        realName: user.realName,
        gender: user.gender,
        currentExam: user.currentExam,
        currentTraining: user.currentTraining
      };
    }
  },
  isNew: function() {
    return !this.getUser();
  },
  getUser: function() {
    return this.props.user;
  },
  onSaved: function() {
    this.setState({saving: false, saved:true});
  },
  handleSave: function() {
    var obj = _.pick(this.state,
      ['birthdate', 'name', 'realName', 'password', 'currentExam', 'currentTraining', 'gender']);
    obj.roles = [this.state.role];
    if(this.state.role == 'user') {
      obj.moderator = app.getCurrentUser().getId();
    }  else {
      obj.moderator = null;
    }
    
    
    if(this.isNew()) {
      Users.addUser(obj, this.onSaved, this.onError);
      
    } else {
      delete obj.name;
      if(!obj.password){
        delete obj.password
      }
      this.getUser().updateUserWithData(obj, this.onSaved, this.onError);
    }
  },
  reload: function() {
    //TODO;
  },
  componentWillMount: function() {
    this.reload();
  },
  changeHandler: function(field) {
    return function(e) {
      var obj = {};
      obj[field] = e.target.value;
      this.setState(obj);
    }.bind(this);
  },
  onError:function(err) {
    this.setState({error:err, saving: false, saved: false});
  },
  clearErrors: function() {
    this.setState({error:undefined});
  },
  validators: {
    birthdate: function(value) {
      if(!value) return true;
      if(/[0-9]{4}-[0-9]{2}-[0-9]{2}/.test(value)) {
        var d = new Date(value);
        try {
        return d.toISOString().substr(0,10) === value;
        } catch(e) {
          return false;
        }
      }
    }, name: function(value, component) {
      if(!this.isNew()) {
        return true;
      }
      return value.length >= 3 && value.length <= 30;
    }, realName: function(value, component) {
      if(!value) return true;
      return value.length >= 3 && value.length <= 60;
    }, password: function(value, component) {
      if(!value) return !this.isNew();
      return value.length >= 5 && value.length <= 30;
    }, currentExam: function(value, component) {
      return !!value;
    }, currentTraining: function(value, component) {
      return !!value;
    }, gender: function(value, component) {
      if(!value) return true;
      return !!value;
    },
  },
  isValid: function(field) {
    if(this.validators[field]){
      return this.validators[field].call(this, this.state[field] || "");
    } else {
      return true;
    }
  },
  validClass: function(field) {
    if(this.state[field] || this.state.showErrors) {
      if(!this.isValid(field)) {
        return "has-error";
      } else {
        return "has-success";
      }
    }
  },
  isReadyToSubmit: function() {
    return _.every(['birthdate', 'name', 'realName', 'password', 'currentExam', 'currentTraining', 'role', 'gender'], this.isValid);
  },
  render: function() {
    
    if(this.state.error) {
      return <InfoModalComponent title="Błąd">
        <p>{this.state.error}</p>
        <button className="btn btn-default" onClick={this.clearErrors}>Anuluj</button>
      </InfoModalComponent>;
    }
    if(this.state.saving) {
      return (
        <MenuScreen title="Trwa zapisywanie...">
          Trwa zapisywanie użytkownika... proszę czekać.
        </MenuScreen>
      )
    }
    if(this.state.saved) {
      return (
        <MenuScreen title="Zapisano" returnTo="admin-user-list">
          Udało się zapisać użytkownika
        </MenuScreen>
      );
    }
    var footer = [
      <button key={1} className="btn btn-block btn-lg btn-primary" onClick={this.handleSave} disabled={!this.isReadyToSubmit()}>
        Zapisz
      </button>,
      <Router.Link key={2} className="btn btn-block btn-default" to="admin-user-list">
        Anuluj
      </Router.Link>,
    ];
    var examSelector = (
      <div className={"form-group " + this.validClass('currentExam')}>
        <label>Egzamin</label>
        <ExamSelectorWrapper onlyClosed={true} value={this.state.currentExam} onChange={this.changeHandler('currentExam')}/>
      </div>
    );
    var trainingSelector = (
      <div className={"form-group " + this.validClass('currentTraining')}>
        <label>Trening</label>
        <ExamSelectorWrapper value={this.state.currentTraining} onChange={this.changeHandler('currentTraining')}/>
      </div>
    );
    var error;
    if(this.state.error) {
      error = <div className="alert alert-danger" role="alert">{this.state.error}</div>
    }
    var title = "Tworzenie nowego konta użytkownika";
    if(!this.isNew()) {
      title = "Edycja konta użytkownika " + this.getUser().getLogin();
    }
    return (
      <InlineModal title={title} footer={footer}>
        {error}
      
        <div className={"form-group " + this.validClass('name')}>
          <label>Login (3 do 30 znaków)</label>
          <input className="form-control" value={this.state.name} onChange={this.changeHandler('name')}
          readOnly={!this.isNew()}/>
        </div>
        <div className={"form-group " + this.validClass('password')}>
          <label>Hasło (5 do 30 znaków)</label>
          <input type="password" className="form-control" value={this.state.password} onChange={this.changeHandler('password')}/>
        </div>
        <div className={"form-group " + this.validClass('realName')}>
          <label>Imię, nazwisko (3 do 60 znaków)</label>
          <input className="form-control" value={this.state.realName} onChange={this.changeHandler('realName')}/>
        </div>
        <div className={"radio " + this.validClass('gender')}>
          <label className="btn btn-default gender-btn">
            <input type="radio" name="gender" 
              value="M" 
              checked={this.state.gender=="M"} onChange={this.changeHandler('gender')}/> {t("Male")}
          </label>
          <label className="btn btn-default gender-btn">
            <input type="radio" name="gender"
              value="F"
              checked={this.state.gender=="F"} onChange={this.changeHandler('gender')}/> {t("Female")}
          </label>
        </div>
        <div className={"form-group " + this.validClass('birthdate')}>
          <label>Data urodzenia (w formacie RRRR-MM-DD)</label>
          <input className="form-control" value={this.state.birthdate} onChange={this.changeHandler('birthdate')}/>
        </div>
        
        <div className={"form-group "}>
          <label>Rola</label>
          <select className="form-control" value={this.state.role} onChange={this.changeHandler('role')}>
            <option value="user">Uczeń</option>
            <option value="admin">Administrator</option>
          </select>
        </div>
            
        {examSelector}
        {trainingSelector}
      </InlineModal>
    );
  }
});

var AddUserScreenWrapper = React.createClass({
  mixins: [Router.State],
  componentWillMount: function() {
    this.reload();
  },
  getInitialState: function() {
    return {}
  },
  reload: function() {
    this.setState({user: undefined});
    var userId = this.getParams().userId;
    if(userId) {
      var user = new User(userId);

      user.load(function() {
        this.setState({user: user});
      }.bind(this));
    }
  },
  componentDidUpdate: function(oldProps) {
    var userId = this.state.user?this.state.user.getId():undefined;
    if(this.getParams().userId !== userId) {
      this.reload();
    }
  },
  render: function() {
    if(!this.getParams().userId) {
      return <AddUserScreen/>
    } else {
      if(this.state.user) {
        return (
          <AddUserScreen user={this.state.user}/>
        );
      } else {
        return <LoadingModal/>;
      }
      
    }
  }
  
});


module.exports = AddUserScreenWrapper;
