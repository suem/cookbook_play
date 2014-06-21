/**
 * @jsx React.DOM
 */

var _ = require('underscore');
var React = require('react/addons');
var Router = require('../Router.js')

var RecipeView = React.createClass({
  onDelete: function () {
    if(confirm("Rezept wirklich loeschen?")) this.props.onDelete(this.props.cookbook.id, this.props.recipe.id); 
    return false;
  },
  render: function () {
    var recipe = this.props.recipe;
    var cookbook = this.props.cookbook;
    var isOwner = this.props.isOwner;

    var ingredients = recipe.ingredients.map(function (i,j) {
      return <li key={j}>{i.name}, {i.amount} {i.unit}</li>
    });

    var editLinks = isOwner ? (
      <div className="btn-toolbar">
        <a onClick={Router.navigateToEditRecipe(cookbook.id,recipe.id)} 
          href={Router.linkToEditRecipe(cookbook.id,recipe.id)} className="btn btn-warning">
          Bearbeiten
        </a>
        <a href={Router.linkToCookbook(cookbook.id)} onClick={this.onDelete} className="btn btn-danger">
          L&ouml;schen
        </a>
      </div>
    ) : null;

    return (
        <div>

          <ol className="breadcrumb">
            <li><a href={Router.linkToCookbooks()}>Kochb&uuml;cher</a></li>
            <li><a href={Router.linkToCookbook(cookbook.id)}>{cookbook.name}</a></li>
            <li className="active">{recipe.name}</li>
          </ol>

          <h1 className="page-header">
            {recipe.name}<br/>
            <small>{recipe.description}</small>
          </h1>

          <div className="row">
            <div className="col-md-3">
              <div className="panel panel-default">
                <div className="panel-heading">
                  <h3 className="panel-title">Zutaten</h3>
                </div>
                <div className="panel-body">
                  <ul>{ingredients}</ul>
                </div>
              </div>
            </div>
            <div className="col-md-9 text-justify">
              <h3>Anleitung</h3>
              {recipe.instructions}
            </div>
          </div>

          <div className="row">
            <div className="col-xs-2">
              <a className="btn btn-default">
                <span className="glyphicon glyphicon-print"></span> Drucken
              </a>
            </div>
            <div className="col-xs-10 text-right">
              {editLinks}
            </div>
          </div>

        </div>
    )
  }
});

module.exports = RecipeView;
