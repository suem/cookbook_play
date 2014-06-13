/**
 * @jsx React.DOM
 */

var _ = require('underscore');
var React = require('react/addons');
var Service = require('../RecipeService.js')
var Router = require('../Router.js')

var LoginForm = React.createClass({
  getInitialState: function () {
    return {error: null}
  },
  logout: function () {
    this.props.onLogout();  
    return false;
  },
  login: function () {
    var username = this.refs.username.getDOMNode().value.trim();
    var password = this.refs.password.getDOMNode().value.trim();
    var self = this;
    this.props.onLogin(username,password, function (error) {
      self.setState({error:error});
    })
    return false;
  },
  render: function() {
    var dropdownText; 
    var formContent;
    if(this.props.currentUser != null) {
      dropdownText = "Mein Konto";
      formContent = this.getLoggedIn();
    } else {
      dropdownText = "Anmelden";
      formContent =  this.getLoggedOut();
    }
    var errorMessage = this.state.error != null ?  <p className="text-danger">{this.state.error}</p> : null;
    return (
      <ul className="nav navbar-nav navbar-right">
        <li className="dropdown">
          <a href="#" id="drop3" role="button" className="dropdown-toggle" data-toggle="dropdown">
            {dropdownText}
            <b className="caret"></b>
          </a>
          <div className="dropdown-menu" style={{padding: "15px", width:"200px"}}>
            {errorMessage}
            {formContent}
          </div>
        </li>
      </ul>
    )
  },
  getLoggedIn: function() {
    return (
      <form onSubmit={this.logout}>
        <p>{this.props.currentUser.displayname}</p>
        <button className="btn btn-warning btn-block btn-sm">Abmelden</button>
      </form>
    ) 
  },
  getLoggedOut: function () {
    var marginSyle = {marginBottom: '5px'}
    return (
      <form onSubmit={this.login}>
        <input ref="username" type="text" className="form-control" placeholder="Benutzername" style={marginSyle}/>
        <input ref="password" type="password" className="form-control" placeholder="Passwort" style={marginSyle}/>
        <button type="submit" className="btn btn-default btn-sm btn-block">Anmelden</button>
      </form>
    )
  }

})

var MenuBar = React.createClass({
  getInitialState: function () {
    return {currentUser: null}
  },
  componentWillMount: function(){
    var self = this;
    this.props.currentUser.subscribe(function (user) {
      self.setState({currentUser: user})
    });
  },
  render: function () {
    var myRecipesLink = null;
    if(this.state.currentUser != null) {
      myRecipesLink = (<li><a href={Router.linkToCookbook(this.state.currentUser.id)}>Meine Rezepte</a></li>)
    }
    return (
      <div className="navbar navbar-inverse navbar-fixed-static" role="navigation">
        <div className="container">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a className="navbar-brand" href={Router.linkToCookbooks()}><span className="glyphicon glyphicon-th"></span></a>
          </div>
          <div className="collapse navbar-collapse">
            <ul className="nav navbar-nav">
              {myRecipesLink }
            </ul>
            <form className="navbar-form navbar-left" role="search" >
              <div className="form-group">
                <input type="text" className="form-control" placeholder="Schnellsuche" />
              </div>
            </form>
            <LoginForm currentUser={this.state.currentUser} onLogin={this.props.onLogin} onLogout={this.props.onLogout}/>
          </div>
        </div>
      </div>
    )    
  }

});

module.exports = MenuBar;
