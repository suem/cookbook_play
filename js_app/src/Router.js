var Backbone = require('backbone')
var $ = require('jquery');
Backbone.$ = $;

var Router = {
  router: null,
  init: function(app) {
    var AppRouter = Backbone.Router.extend({
      routes : {
        '' : 'cookbookList',
        'cookbooks' : 'cookbookList',
        'cookbooks/:id' : 'cookbookView',
        'cookbooks/:cookbookId/new' : 'newRecipeView',
        'cookbooks/:cookbookId/:recipeId' : 'recipeView',
        'cookbooks/:cookbookId/:recipeId/edit' : 'editRecipeView',
      },
      cookbookList: app.renderCookbookList,
      cookbookView: app.renderCookbookView,
      recipeView: app.renderRecipeView,
      newRecipeView: app.renderNewRecipeView,
      editRecipeView: app.renderEditRecipeView
    });
    this.router = new AppRouter();
    Backbone.history.start();
  },
  navigate: function(location) {
    this.router.navigate(location, {trigger: true});
  },
  navigateToCookbooks: function () {
    this.navigate('cookbooks');
    return false;
  },
  linkToCookbooks: function() {
    return '#cookbooks';
  },
  navigateToCookbook: function (cookbookId) {
    return function(){
      this.navigate('cookbooks/'+cookbookId);
      return false;
    }.bind(this);
  },
  linkToCookbook: function (cookbookId) {
    return '#cookbooks/'+cookbookId;
  },
  navigateToRecipe: function (cookbookId, recipeId) {
    return function(){
      this.navigate('cookbooks/'+cookbookId+'/'+recipeId);
      return false;
    }.bind(this);
  },
  linkToRecipe: function (cookbookId, recipeId) {
    return '#cookbooks/'+cookbookId+'/'+recipeId;
  },
  navigateToNewRecipe: function (cookbookId) {
    return function() {
      this.navigate('cookbooks/'+cookbookId+'/new');
      return false;
    }.bind(this);
  },
  linkToNewRecipe: function (cookbookId) {
    return '#cookbooks/'+cookbookId+'/new';
  },
  navigateToEditRecipe: function (cookbookId, recipeId) {
    return function() {
      this.navigate('cookbooks/'+cookbookId+'/'+recipeId+'/edit');
      return false;
    }.bind(this);
  },
  linkToEditRecipe: function (cookbookId, recipeId) {
    return '#cookbooks/'+cookbookId+'/'+recipeId+'/edit';
  }
}

module.exports = Router
