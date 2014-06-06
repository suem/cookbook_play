/**
 * @jsx React.DOM
 */

'use strict';
var React = require('react/addons');
var Backbone = require('backbone')
var $ = require('jquery');
Backbone.$ = $;
var MenuBar = require('./components/MenuBar.js');
var CookbookList = require('./components/CookbookList.js');
var CookbookView = require('./components/CookbookView.js');
var RecipeView = require('./components/RecipeView.js');
var RecipeForm = require('./components/recipeForm/RecipeForm.js');
var Service = require('./RecipeService.js');
var DummyService = require('./DummyService.js');

var menubarContainer = document.getElementById('menubar');
var mainContainer = document.getElementById('content');

React.renderComponent(<MenuBar currentUser={DummyService.currentUser} onLogin={DummyService.login} onLogout={DummyService.logout}/>,menubarContainer);

var Router = Backbone.Router.extend({
  routes : {
    "" : "cookbookList",
    "cookbooks" : "cookbookList",
    "cookbooks/:id" : "cookbookView"


    // "recipes" : "recipeList",
    // "recipes/:id" : "recipeDetail",
    // "recipes/:id/edit" : "editRecipe",
    // "new" : "newRecipe"
  },
  cookbookList: function () {
    React.renderComponent(<CookbookList cookbooks={DummyService.cookbooks}/>, document.getElementById('content'));
  },
  cookbookView: function (id) {
    React.renderComponent(<CookbookView cookbook={DummyService.getCookbook(id)}/>, document.getElementById('content'));
  }


  // recipeList : function() {
  //   var recipes = Service.recipes()
  //   var sub = recipes.subscribe(
  //     function(recipes){
  //       console.log(recipes);
  //       React.renderComponent(<RecipeList recipes={recipes}/>, document.getElementById('content'));
  //     }, 
  //     function (err) {
  //       handleError(err);
  //     }
  //   );
  // },
  // recipeDetail : function(id) {
  //   var recipe = Service.recipe(id);
  //   recipe.subscribe(
  //     function(recipe){
  //     React.renderComponent(<RecipeDetail recipe={recipe}/>, document.getElementById('content'));
  //   },
  //   function(err){
  //     handleError(err);
  //   });
  // },
  // editRecipe : function (id) {
  //   var recipe = Service.recipe(id);
  //   recipe.subscribe(
  //     function(recipe){
  //     var recipeCopy = JSON.parse(JSON.stringify(recipe))
  //     var onSave = function (recipe) {
  //       console.log('save recipe:');
  //       console.log(recipe);
  //       Service.safeRecipe(recipe)
  //     }
  //     React.renderComponent(<RecipeForm onSave={onSave} recipe={recipeCopy}/>, document.getElementById('content'));
  //   },
  //   function(err){
  //     handleError(err);
  //   });
  // },
  // newRecipe : function () {
  //   var newRecipe = {id: null, ingredients: []};
  //   var onSave = function (recipe) {
  //     console.log('save recipe:');
  //     console.log(recipe);
  //     Service.safeRecipe(recipe)
  //   }
  //   React.renderComponent(<RecipeForm onSave={onSave} recipe={newRecipe}/>, document.getElementById('content'));
  // }
});

new Router();
Backbone.history.start();

function handleError(err) {
  //TODO create error component
  console.log(err);
  React.renderComponent(<div>{JSON.stringify(err.message)}</div>, document.getElementById('content'));
}


