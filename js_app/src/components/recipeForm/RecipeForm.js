/**
 * @jsx React.DOM
 */
var _ = require('underscore');
// var $ = require('jquery');
var React = require('react/addons');
var SuggestionInput = require('./SuggestionInput.js');

var RecipeService = require('../../RecipeService.js')

var RecipeForm = React.createClass({
  getInitialState: function () {
    var recipe = this.props.recipe;  
    return recipe;
  },
  componentWillMount: function() {
    this.checkEnoughIngredients();
  },
  onStateUpdate: function() {
    this.checkEnoughIngredients();
  },
  checkEnoughIngredients: function() {
    //add new recipe if all names are filled out
    var ingredients = this.state.ingredients;
    if(ingredients.length > 0) {
      var lastName = ingredients[ingredients.length-1].name;
      if(lastName != "" && lastName != null) {
        ingredients.push({});
        this.setState({ingredients:ingredients});
      } 
    } else {
      ingredients.push({});
      this.setState({ingredients:ingredients});
    }
  },
  indexedLinkState: function(name,index,prop) {
    var self = this;
    if(index === undefined) {
      return {
        value: self.state[name], 
        requestChange: function (value) {
          var newState = {};
          newState[name] = value;
          self.setState(newState,self.onStateUpdate);
        }
      };
    } else {
      return {
        value: self.state[name][index][prop], 
        requestChange: function (value) {
          var newState = {};
          newState[name] = self.state[name];
          newState[name][index][prop] = value;
          self.setState(newState,self.onStateUpdate);
        }
      };
    }
  },
  addIngredient: function () {
      this.state.ingredients.push({});
      this.setState({ingredients: this.state.ingredients},this.onStateUpdate);
  },
  removeIngredient: function (index) {
      delete this.state.ingredients[index];
      this.setState({ingredients: this.state.ingredients},this.onStateUpdate);
  },
  saveRecipe: function () {
    //TODO add validation
    var ingredients = this.state.ingredients.filter(function(i){
      return i.name != null && i.name != ""
    }).map(function(i){
      i.amount = Number(i.amount)
      return i
    })
    var recipe = {
        id: this.state.id,
        name: this.state.name, 
        description: this.state.description, 
        ingredients: ingredients,
        instructions: this.state.instructions
    };
    this.props.onSave(recipe);
  },
  render: function () {
    var entryList = ['Mehl','Zucker','Salz','Milch'];
    return (
      <div>
        <h1 className="page-header">Neues Rezept</h1>
        <form className="form-horizontal" role="form">
          <div className="form-group">
            <label htmlFor="title" className="col-sm-2 control-label">Name</label>
            <div className="col-sm-10">
              <input valueLink={this.indexedLinkState('name')} type="text" autofocus="true" className="form-control" id="name" placeholder="Name des Rezept" />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="description" className="col-sm-2 control-label">Beschreibung</label>
            <div className="col-sm-10">
              <input valueLink={this.indexedLinkState('description')} type="text" className="form-control" id="description" placeholder="kurze Beschreibung"/>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="instructions" className="col-sm-2 control-label">Zutaten</label>
            <div className="col-sm-10">
              {this.state.ingredients.map(function(ing,index,arr) {
                var onSelect = function (e) {
                  this.state.ingredients[index].unit = "GUGUS"
                  this.setState({ingredients: this.state.ingredients})
                }.bind(this);
                return (
                  <div className="row form-group" key={'ing_'+index}>
                    <div className="col-xs-7">
                      <SuggestionInput onSelect={onSelect} entries={entryList} valueLink={this.indexedLinkState('ingredients',index,'name')} type="text" className="form-control" placeholder="Zutat (z.B. Milch)"/>
                    </div>
                    <div className="col-xs-2">
                      <input valueLink={this.indexedLinkState('ingredients',index,'amount')} type="text" className="form-control" placeholder="Menge (z.B. 2)"/>
                    </div>
                    <div className="col-xs-2">
                      <input valueLink={this.indexedLinkState('ingredients',index,'unit')} type="text" className="form-control" placeholder="Einheit (z.B. dl)"/>
                    </div>
                    <div className="col-xs-1">
                      <button style={{display:(index==arr.length-1 ? 'none' : 'block')}} type="button" className="btn btn-default" onClick={this.removeIngredient.bind(this,index)}>
                        <span className="glyphicon glyphicon-remove"></span>
                      </button>
                    </div>
                  </div>
                  );
              }.bind(this))}
              <div className="row">
                <div className="col-xs-12">
                  <button className="btn btn-default" onClick={this.addIngredient}>neue Zutat</button>
                </div>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="instructions" className="col-sm-2 control-label">Anleitung</label>
            <div className="col-sm-10">
              <textarea valueLink={this.indexedLinkState('instructions')} type="password" className="form-control" id="instructions" placeholder="Man nehme.." rows="10" />
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              <button onClick={this.saveRecipe} type="submit" className="btn btn-primary">Speichern</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
});

module.exports = RecipeForm;
