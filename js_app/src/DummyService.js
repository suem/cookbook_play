
var _ = require('underscore');
var Rx = require('rx');
var Router = require('./Router.js')

var users = {
  'sam' : {
    id: 'sam', username: 'sam', displayname: "Samuel Ueltschi", name: "Samuel Ueltschi",
    recipes: {
      6: {id: 6, cookbookOwner: 'sam', cookbookId: 'sam', cookbookName: "Samuel Ueltschi", "name":"Riz Casimir","ingredients":[{"name":"Carolina Reis","amount":125,"unit":"g"},{"name":"Poulet-Geschnetzeltes","amount":300,"unit":"g"},{"name":"Hühnerbouillon","amount":2,"unit":"Würfel"},{"name":"Butter","amount":30,"unit":"g"},{"name":"Mehl","amount":20,"unit":"g"},{"name":"Currypulver Mild","amount":6,"unit":"g"},{"name":"Currypulver Madras","amount":4,"unit":"g"},{"name":"Milch","amount":3,"unit":"dl"},{"name":"Annanas","amount":1,"unit":"Dose"},{"name":"Pfirsich","amount":1,"unit":"Dose"}],"description":"Der moderne Schweizer Klassiker","instructions":"Reis mit doppelter menge Wasser und 1 Wurfel Bouillon Kochen.\nPoulet scharf anbraten, Mehl, Butter und Curry dazugeben, mit Milch abloeschen (wie Bechamel).\nBouillonwuerfel dazugene.\n\nOptional: Annanas und Pfirsich"},
      7: {id: 7, cookbookOwner: 'sam', cookbookId: 'sam', cookbookName: "Samuel Ueltschi", name: "Wähenguss", "ingredients": [ { "name": "Ei", "amount": 3, "unit": "Stk." }, { "name": "Zucker", "amount": 2, "unit": "EL" }, { "name": "Rahm", "amount": 2, "unit": "dl" }, { "name": "Vanillezucker", "amount": 1, "unit": "Sachet" } ], "description": "Guss für standard Wähe", "instructions": "Alles gut mischen. Ca. 35min bei 200C baken" }
    }
  },

  'petra': {
    id: 'petra', username: 'petra', displayname: "Petra Wittwer", name: "Petra Wittwer",
    recipes: {  
      8: {id: 8, cookbookOwner: 'petra', cookbookId: 'petra', cookbookName: "Petra Wittwer", name: "Verbrannte Rüebli", "ingredients": [ { "name": "Sämi", "amount": 1, "unit": "Awesome" }, { "name": "Rüebli", "amount": 4, "unit": "Stk." }, { "name": "Boullion", "amount": 1, "unit": "KL" }, { "name": "Pfanne", "amount": 1, "unit": "Stk." }, { "name": { "name": "Mehl", "unit": "g" }, "amount": 200, "unit": "EL" } ], "description": "Sam arbeitet an Kochbuch", "instructions": "Man kocht die Rüebli und hört nicht auf sie zu kochen." },
      9: {id: 9, cookbookOwner: 'petra', cookbookId: 'petra', cookbookName: "Petra Wittwer", "name":"Muffins","ingredients":[{"name":"Mehl","amount":175,"unit":"g"},{"name":"Zucker","amount":90,"unit":"g"},{"name":"Butter","amount":100,"unit":"g"},{"name":"Saurer Halbrahm","amount":180,"unit":"g"},{"name":"Ei","amount":2,"unit":"Stk."},{"name":"Vanillezucker","amount":1,"unit":"Sachet"},{"name":"Salz","amount":1,"unit":"Prise"},{"name":"Backpulver","amount":1.5,"unit":"TL"}],"description":"Mein Muffingrundrezept","instructions":"Ofen auf 220C° vorheizen. Butter auf Raumtemperatur bringen. Alle trockenen Zutaten gut durchmischen. Alle feuchten Zutaten in zweiter Schüssel vermengen. Muffinblech mit Förmchen auslegen oder einölen. Formen zu 2/3 befüllen und im Ofen für ca 15min. backen. Stäbchenprobe."}
    }
  }
};


var currentUser = new Rx.BehaviorSubject();
var cookbookList = new Rx.BehaviorSubject(_.values(users));

var DummyService = {
  getCurrentUser: function () {
    return currentUser;
  },
  getCookbooks: function () {
    return cookbookList;
  },
  
  login: function (username,login,callback) {
    var user = users[username];
    if(user) {
      currentUser.onNext(user); 
      callback(null);
    } else {
      callback('Incorrect username/password');
    }
   }, 
  logout: function() {
    currentUser.onNext(null); 
  },
  getCookbook: function (id) {
    return new Rx.BehaviorSubject(users[id]);
  },
  getRecipe: function(cookbookId, recipeId) {
    return new Rx.BehaviorSubject(users[cookbookId].recipes[recipeId]);
  },
  ownsCookbook: function(cookbook, currentUser) {
    return currentUser != null && cookbook.id == currentUser.id;
  },
  storeRecipe: function (cookbookId, recipe, callback) {
    if(!recipe.id) {
      recipe.id = Math.random().toString(36).substring(7);
    }
    users[cookbookId].recipes[recipe.id] = recipe;
    Router.navigateToRecipe(cookbookId, recipe.id)()
  }
}

module.exports = DummyService;
