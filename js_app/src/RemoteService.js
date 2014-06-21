'use strict';
var _ = require('underscore');
var Rx = require('rx');
var Router = require('./Router.js')
var $ = require('jquery')

var currentUser = new Rx.BehaviorSubject();

var GET = function (url) {
  return $.getJSON(url)
}

var POST = function (url, json) {
    return $.ajax({
      type: 'POST',
      url: url,
      data: JSON.stringify(json),
      contentType: "application/json",
      dataType: 'json'});
}

var getJSON = function (url) {
    var res = new Rx.AsyncSubject();
    GET(url).done(function(json) {
      res.onNext(json)  
      res.onCompleted();
    }).fail(function(jqxhr, textStatus, error) {
      res.onError(error)
    });
    return res;
}

var postJSON = function(url, data) {
    var res = new Rx.AsyncSubject();
    POST(url,data).done(function (json) {
      res.onNext(json)  
      res.onCompleted();
    }).fail(function(jqxhr, textStatus, error) {
      res.onError(error)
    });
    return res;
}


var Service = {

  getCurrentUser: function () {
    GET('/currentuser').done(function (user) {
      currentUser.onNext(user)
    }).fail(function(jqxhr, textStatus, error) {
      //TODO broadcast error
      console.log('failed to get user: '+error);
      currentUser.onNext(null)
    });
    return currentUser
  },

  login: function (username,password,callback) {
    POST('/login', {loginname:username,password:password}).done(function (user) {
      currentUser.onNext(user)
      callback(null)
    }).fail(function(jqxhr, textStatus, error) {
      //TODO broadcast error
      console.log('failed to login: '+error);
      currentUser.onNext(null)      
      callback(error);
    });
  }, 

  logout: function() {
    GET('/logout').done(function () {
      currentUser.onNext(null)
    }).fail(function(jqxhr, textStatus, error) {
      currentUser.onError(null);
      console.log('Failed to logout'+error);
    });
  },
  getCookbooks: function () { return getJSON('/cookbooks') },
  getCookbook: function (id) { return getJSON('/cookbooks/'+id) },
  getRecipes: function(cookbookId) { return getJSON('/cookbooks/'+cookbookId+'/recipes') },
  getRecipe: function(cookbookId, recipeId) { 
    return getJSON('/cookbooks/'+cookbookId+'/recipes/'+recipeId) 
  },
  getIngredientSuggestions: function () { return getJSON('/ingredientsuggestions') },
  getUnitSuggestions: function () { return getJSON('/unitsuggestions') },
  ownsCookbook: function(cookbook, currentUser) {
    return currentUser != null && cookbook.id == currentUser.id;
  },
  storeRecipe: function (cookbookId, recipe) {
    POST('/cookbooks/'+cookbookId+'/recipes', recipe).done(function (status) {
      Router.navigateToRecipe(cookbookId, status.recipeId)()
    }).fail(function(jqxhr, textStatus, error) {
      console.log('failed to store recipe: '+error);
    });
  },
  removeRecipe: function (cookbookId, recipeId) {
    GET('/cookbooks/'+cookbookId+'/recipes/'+recipeId+'/delete', recipeId).done(function (status) {
      Router.navigateToCookbook(cookbookId)();
    }).fail(function(jqxhr, textStatus, error) {
      console.log('failed to remove recipe: '+error);
      Router.navigateToCookbook(cookbookId)();
    });
  }
}

module.exports = Service;
