/**
 * @jsx React.DOM
 */

'use strict';
var React = require('react/addons');
var Backbone = require('backbone')
var $ = require('jquery');
Backbone.$ = $;

var Service = require('./Service.js');
var Router = require('./Router.js')

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var MenuBar = require('./components/MenuBar.js');
var CookbookList = require('./components/CookbookList.js');
var CookbookView = require('./components/CookbookView.js');
var RecipeView = require('./components/RecipeView.js');
var RecipeForm = require('./components/recipeForm/RecipeForm.js');

// render global menubar
var menubarContainer = document.getElementById('menubar');
React.renderComponent(<MenuBar currentUser={Service.currentUser} onLogin={Service.login} onLogout={Service.logout}/>, menubarContainer);


var AppView = React.createClass({
  getInitialState: function() {
    return {component: <div />};
  },
  render: function () {
    return this.state.component;
  }
});

var mainContainer = document.getElementById('content');

var currentSubscription = null;
var renderSubject = function (componentSubject) {
  if(currentSubscription) currentSubscription.dispose();
  currentSubscription = componentSubject.subscribe(function(component) {
    React.unmountComponentAtNode(mainContainer)
    React.renderComponent(component, mainContainer);
  });
}






var App = {
  renderCookbookList :  function () {
    console.log("cookbook list");
    var componentSubject = Service.cookbooks.map(function(cookbooks){
      return (<CookbookList key="cookbookList" cookbooks={cookbooks}/>);
    });
    renderSubject(componentSubject)
  },
  renderCookbookView : function (cookbookId) {
    console.log("cookbook: "+cookbookId);
    var cookbook = Service.getCookbook(cookbookId);
    var currentUser = Service.currentUser;
    var componentSubject = cookbook.combineLatest(currentUser, function(cookbook, currentUser) {
      var isOwner = Service.ownsCookbook(cookbook,currentUser)
      return (
        <CookbookView key={cookbookId} cookbook={cookbook} currentUser={Service.currentUser} isOwner={isOwner} />
      );
    });

    renderSubject(componentSubject)
  },
  renderRecipeView : function (cookbookId, recipeId) {
    console.log("recipe: "+cookbookId+", "+recipeId);

    var cookbook = Service.getCookbook(cookbookId);
    var currentUser = Service.currentUser;

    var componentSubject = cookbook.combineLatest(currentUser, function(cookbook, currentUser) {
      var recipe = cookbook.recipes[recipeId]
      var isOwner = Service.ownsCookbook(cookbook,currentUser)
      return (
        <RecipeView key={recipeId} cookbook={cookbook} recipe={recipe} isOwner={isOwner} />
      );
    });

    renderSubject(componentSubject)
  },
  renderNewRecipeView : function (cookbookId) {
    console.log("new recipe: "+cookbookId);
    var onSave = function (recipe) {
      Service.storeRecipe(cookbookId,recipe);
    }
    var componentSubject = Service.getCookbook(cookbookId).map(function (cookbook) {
      return ( <RecipeForm key={cookbookId+'_new'} cookbook={cookbook} recipe={{ingredients: []}} onSave={onSave} />) 
    })
    renderSubject(componentSubject)
  },
  renderEditRecipeView : function (cookbookId, recipeId) {
    console.log("recipe: "+cookbookId+", "+recipeId);

    var cookbook = Service.getCookbook(cookbookId);
    var currentUser = Service.currentUser;

    var componentSubject = cookbook.map(function(cookbook) {
      //make copy of objet s.t. original isn't edited
      var recipe = JSON.parse(JSON.stringify(cookbook.recipes[recipeId]));
      var onSave = function (recipe) {
        Service.storeRecipe(cookbook.id,recipe);
      }
      return ( <RecipeForm key={cookbookId+'_edit_'+recipeId} cookbook={cookbook} recipe={recipe} onSave={onSave} />) 
    });
    renderSubject(componentSubject)
  }
}

Router.init(App)

module.exports = App;

