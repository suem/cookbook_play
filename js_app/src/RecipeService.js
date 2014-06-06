'use strict';

var _ = require('underscore');
var Rx = require('rx');
var $ = require('jquery');

var Service = {
  recipes: function() {
    var res = new Rx.AsyncSubject();
    var url = '/recipes'
    $.getJSON( url).done(function( json ) {
      res.onNext(json)  
      res.onCompleted();
    }).fail(function( jqxhr, textStatus, error ) {
      res.onError(error)
    });
    return res;
  },
  recipe: function(id) {
    var res = new Rx.AsyncSubject();
    var url = '/recipes/'+id
    $.getJSON( url).done(function( json ) {
      res.onNext(json)  
      res.onCompleted();
    }).fail(function( jqxhr, textStatus, error ) {
      res.onError(error)
    });
    return res;
  },
  safeRecipe: function(recipe) {
    $.ajax({
      type: 'POST',
      url: '/recipes',
      data: JSON.stringify(recipe),
      contentType: "application/json",
      dataType: 'json'}).done(function( json ) {
      console.log(json);
    }).fail(function( jqxhr, textStatus, error ) {
      console.log(error);
    });
  }
}

module.exports = Service;
