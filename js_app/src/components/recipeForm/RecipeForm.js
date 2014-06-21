/**
 * @jsx React.DOM
 */
var _ = require('underscore');
// var $ = require('jquery');
var React = require('react/addons');
var SuggestionInput = require('./SuggestionInput.js');
var Router = require('../../Router.js')

var RecipeForm = React.createClass({
  getInitialState: function () {
    var recipe = this.props.recipe;  
    recipe.validationsActive = false;
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
      return false;
  },
  removeIngredient: function (index) {
      delete this.state.ingredients[index];
      this.setState({ingredients: this.state.ingredients},this.onStateUpdate);
      return false;
  },
  isRecipeValid: function () {
    var self = this;
    var messages = ['name', 'description', 'instructions'].map(function (name) { return self.getErrorMessage(name) == null; });
    this.state.ingredients.forEach(function (ing,index) {
      var ingMessages = ['name','unit','amount'].map(function (name) {
        return self.getErrorMessage('ingredients',index,name) == null;
      });
      ingMessages.forEach(function (m) { messages.push(m) });
    });
    return messages.reduce(function (a,b) { return a && b; }, true); 
  },
  isValid: function (name,index,prop) {
    return this.getErrorMessage(name,index,prop) == null;
  },
  getErrorMessage: function (name,index,prop) {
    if(!this.state.validationsActive) return null;
    
    var notNull = function (val) {
      var message = null;
      if(val == undefined || val == null || val == "") message = "Wert darf nicht leer sein"; 
      return message
    }

    var isNumeric = function (val) {
      var message = null;
      if(isNaN(val)) message = "Wert muss Zahl sein"
      return message;
    }

    if(index === undefined) {
      var validations = { name: notNull, description: notNull, instructions: notNull }
      return validations[name](this.state[name]);
    } else {
      var validations = { name: notNull, unit: notNull, amount: isNumeric}
      if(index < this.state.ingredients.length - 1) return validations[prop](this.state.ingredients[index][prop]);
      else return null;
    }
      
  },
  saveRecipe: function () {
    this.state.validationsActive = true;
    this.setState({validationsActive:true});
    if(this.isRecipeValid()){
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
      this.props.onSave(this.props.cookbook.id, recipe);
    }
    return false;
  },
  render: function () {
    var cookbook = this.props.cookbook;
    var ingredientSuggestions = this.props.ingredientSuggestions
    var unitList = this.props.unitSuggestions

    var ingredientList = ingredientSuggestions.map(function (s) {return s.name});
    var unitMap = {}
    ingredientSuggestions.forEach(function (s) { unitMap[s.name] = s.unit });

    var hasError = function (name,index,prop) {
      return this.isValid(name,index,prop) ? '' : 'has-error';
    }.bind(this)


    return (
      <div>
        <ol className="breadcrumb">
          <li><a href={Router.linkToCookbooks()}>Kochb&uuml;cher</a></li>
          <li><a href={Router.linkToCookbook(cookbook.id)}>{cookbook.name}</a></li>
          <li className="active">{this.state.id ? this.state.name : 'Neues Rezept'}</li>
        </ol>

        <div className="page-header">
          <h1 className="page-header">{this.state.id ? 'Rezept Bearbeiten' : 'Neues Rezept'}</h1>
        </div>

        <form className="form-horizontal">

          <div className={'form-group ' + hasError('name')}>
            <label htmlFor="title" className="col-md-2 control-label">Name</label>
            <div className="col-md-10">
              <input valueLink={this.indexedLinkState('name')} type="text" autofocus="true" className="form-control" id="name" placeholder="Name des Rezept" />
              <small className="help-block">{this.getErrorMessage('name')}</small>
            </div>
          </div>
          
          <div className={'form-group ' + hasError('description')}>
            <label htmlFor="description" className="col-md-2 control-label">Beschreibung</label>
            <div className="col-md-10">
              <input valueLink={this.indexedLinkState('description')} type="text" className="form-control" id="description" placeholder="kurze Beschreibung"/>
              <small className="help-block">{this.getErrorMessage('description')}</small>
            </div>
          </div>


          <div className="form-group">
            <label htmlFor="ingredients" className="col-md-2 control-label">Zutaten</label>
            <div className="col-md-10">
              {this.state.ingredients.map(function(ing,index,arr) {
                var isLast = index==arr.length-1;
                var onSelect = function (e) {
                  console.log('selected '+e);
                  this.state.ingredients[index].unit = unitMap[e]
                  this.setState({ingredients: this.state.ingredients})
                }.bind(this);
                return (
                  <div className="row form-group" key={'ing_'+index}>
                    <div className={'col-md-7 ' + hasError('ingredients', index, 'name')}>
                      <SuggestionInput 
                        onSelect={onSelect} 
                        entries={ingredientList} 
                        valueLink={this.indexedLinkState('ingredients',index,'name')} 
                        type="text" className="form-control" placeholder="Zutat (z.B. Milch)"/>
                      <small className="help-block">{this.getErrorMessage('ingredients',index,'name')}</small>
                    </div>
                    <div className={'col-md-2 ' + hasError('ingredients', index, 'amount')}>
                      <input valueLink={this.indexedLinkState('ingredients',index,'amount')} type="text" className="form-control" placeholder="Menge (z.B. 2)"/>
                      <small className="help-block">{this.getErrorMessage('ingredients',index,'amount')}</small>
                    </div>
                    <div className={'col-md-2 ' + hasError('ingredients', index, 'unit')}>
                      <SuggestionInput 
                        entries={unitList} 
                        valueLink={this.indexedLinkState('ingredients',index,'unit')} 
                        type="text" className="form-control" placeholder="Einheit (z.B. gr)"/>
                      <small className="help-block">{this.getErrorMessage('ingredients',index,'unit')}</small>
                    </div>
                    <div className="col-md-1">
                      <button style={{display:(isLast ? 'none' : 'block')}} type="button" className="btn btn-default" onClick={this.removeIngredient.bind(this,index)}>
                        <span className="glyphicon glyphicon-remove"></span>
                      </button>
                    </div>
                  </div>
                  );
              }.bind(this))}
            </div>
          </div>

          <div className="form-group">
            <div className="col-md-offset-2 col-md-10">
              <button className="btn btn-default" onClick={this.addIngredient}>neue Zutat</button>
            </div>
          </div>

          <div className={'form-group ' + hasError('instructions')}>
            <label htmlFor="instructions" className="col-sm-2 control-label">Anleitung</label>
            <div className="col-sm-10">
              <textarea valueLink={this.indexedLinkState('instructions')} type="password" className="form-control" id="instructions" placeholder="Man nehme.." rows="10" />
              <small className="help-block">{this.getErrorMessage('instructions')}</small>
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
