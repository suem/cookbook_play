/**
 * @jsx React.DOM
 */

'use strict';
var React = require('react/addons');
var Backbone = require('backbone')
var Rx = require('rx')
var $ = require('jquery');
Backbone.$ = $;

var Service = require('./Service.js');
var RemoteService = require('./RemoteService.js');
var Router = require('./Router.js')

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var MenuBar = require('./components/MenuBar.js');
var CookbookList = require('./components/CookbookList.js');
var CookbookView = require('./components/CookbookView.js');
var RecipeView = require('./components/RecipeView.js');
var RecipeForm = require('./components/recipeForm/RecipeForm.js');

// render global menubar
React.renderComponent(<MenuBar currentUser={Service.getCurrentUser()} onLogin={Service.login} onLogout={Service.logout}/>, document.getElementById('menubar'));

var toCookbookListComponent = function (cookbooks) {
  return <CookbookList key="cookbookList" cookbooks={cookbooks}/>;
}

var toCookbookViewComponent = function (cookbook, recipes, currentUser) {
  return (
    <CookbookView key={cookbook.id} cookbook={cookbook} recipes={recipes} isOwner={Service.ownsCookbook(cookbook,currentUser)}/>);
}

var toRecipeViewComponent = function (cookbook, recipe, currentUser) {
  return (
    <RecipeView key={'recipe_'+recipe.id} cookbook={cookbook} recipe={recipe} 
      isOwner={Service.ownsCookbook(cookbook,currentUser)} onDelete={Service.removeRecipe} />
  );
}

var toRecipeFormComponent = function(cookbook, recipe, ingredientSuggestions, unitSuggestions) {
  return ( <RecipeForm 
    key={cookbook.id+'_edit_'+recipe.id} 
    cookbook={cookbook} 
    recipe={recipe} 
    onSave={Service.storeRecipe} 
    unitSuggestions={unitSuggestions}
    ingredientSuggestions={ingredientSuggestions} />) 
}

var currentSubscription = new Rx.BehaviorSubject().subscribe(function(){}); 
var mainContainer = document.getElementById('content');
var renderSubject = function (componentSubject) {
  currentSubscription.dispose();
  currentSubscription = componentSubject.subscribe(function(component) {
    React.unmountComponentAtNode(mainContainer)
    React.renderComponent(component, mainContainer);
  });
}

var App = {
  renderCookbookList :  function () {
    console.log("cookbook list");
    var componentSubject = Service.getCookbooks().map(toCookbookListComponent);
    renderSubject(componentSubject)
  },
  renderCookbookView : function (cookbookId) {
    console.log("cookbook: "+cookbookId);
    var cookbook = Service.getCookbook(cookbookId);
    var recipes = Service.getRecipes(cookbookId);
    var currentUser = Service.getCurrentUser();
    var componentSubject = cookbook.combineLatest(recipes, currentUser, toCookbookViewComponent);
    renderSubject(componentSubject)
  },
  renderRecipeView : function (cookbookId, recipeId) {
    console.log("recipe: "+cookbookId+", "+recipeId);
    var cookbook = Service.getCookbook(cookbookId);
    var currentUser = Service.getCurrentUser();
    var recipe = Service.getRecipe(cookbookId,recipeId);
    var componentSubject = cookbook.combineLatest(recipe, currentUser, toRecipeViewComponent);
    renderSubject(componentSubject)
  },
  renderRecipeForm : function (cookbookId, recipeId) {
    var cookbook = Service.getCookbook(cookbookId);
    var ingredientSuggestions = Service.getIngredientSuggestions();
    var unitSuggestions = Service.getUnitSuggestions();
    var recipe
    if(recipeId) {
      recipe = Service.getRecipe(cookbookId, recipeId).map(function (r) { return JSON.parse(JSON.stringify(r)) })
    } else {
      recipe = new Rx.BehaviorSubject({id: null, name:'', description:'', instructions:'', ingredients: []});
    }
    var componentSubject = cookbook.combineLatest(recipe, ingredientSuggestions,unitSuggestions,toRecipeFormComponent);
    renderSubject(componentSubject)
  }

}

Router.init(App)

module.exports = App;

