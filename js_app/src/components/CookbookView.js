/**
 * @jsx React.DOM
 */

var React = require('react/addons');
var Router = require('../Router.js')
var _ = require('underscore')

var RecipeListElement = React.createClass({
  /*jshint ignore:start */
  render: function () {
    var recipe = this.props.recipe;
    var cookbook = this.props.cookbook;
    return (
      <div className="panel panel-default" onClick={Router.navigateToRecipe(cookbook.id, recipe.id)}>
            <div className="panel-heading">
                <div className="row">
                    <h3 className="panel-title col-xs-8">
                        {recipe.name}
                    </h3>
                    <div className="col-xs-4 text-right">
                      <a
                        onClick={Router.navigateToRecipe(cookbook.id,recipe.id)}
                        href={Router.linkToRecipe(cookbook.id,recipe.id)} className="btn btn-default">View</a>
                    </div>
                </div>
            </div>
            <div className="panel-body">
                {recipe.description}
            </div>
        </div>
      )
  }
  /*jshint ignore:end */
});

var CookbookView = React.createClass({
  render: function () {
    var cookbook = this.props.cookbook;
    var elems = _.map(cookbook.recipes, function (r) {
        return <RecipeListElement key={r.id} cookbook={cookbook} recipe={r} />
    });
    var isOwner = this.props.isOwner;

    var addRecipeButton = isOwner ? (
      <div className="text-right">
        <a onClick={Router.navigateToNewRecipe(cookbook.id)} href={Router.linkToNewRecipe(cookbook.id)} className="btn btn-primary">Neues Rezept </a>
      </div>
    ) : null;

    return (

      <div>

        <ol className="breadcrumb">
          <li><a href={Router.linkToCookbooks()}>Kochb&uuml;cher</a></li>
          <li className="active">{cookbook.name}</li>
        </ol>

        <div className="page-header">
          <h1 className="page-header">{cookbook.name}</h1>
        </div> 


          <div className="row">

            <div className="col-md-3">
              <div className="list-group">
                <a href="#" className="list-group-item active">Alle<span className="badge">{elems.length}</span></a>
                <a href="#" className="list-group-item ">Bla..<span className="badge">0</span></a>
              </div>
              {addRecipeButton}
            </div>

            <div className="col-md-9">
              {elems}
            </div>

          </div>

      </div>
      )
  }
});

module.exports = CookbookView;
