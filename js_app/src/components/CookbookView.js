/**
 * @jsx React.DOM
 */

var React = require('react/addons');
var _ = require('underscore')

var RecipeListElement = React.createClass({
  /*jshint ignore:start */
  render: function () {
    var recipe = this.props.recipe;
    var showDetailLink = '#recipes/'+recipe.id;
    return (
        <div className="panel panel-default">
            <div className="panel-heading">
                <div className="row">
                    <h3 className="panel-title col-xs-8">
                        {recipe.name}
                    </h3>
                    <div className="col-xs-4 text-right">
                      <a href={showDetailLink} className="btn btn-default">View</a>
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
  getInitialState: function () {
    return {displayname: '', recipes: []}
  },
  componentWillMount: function(){
    var self = this;
    this.props.cookbook.subscribe(function (cookbook) {
      self.setState({recipes: _.values(cookbook.recipes), displayname: cookbook.displayname})
    });
  },
  render: function () {
    var elems = this.state.recipes.map(function (r) {
        return <RecipeListElement recipe={r} />
    });
    return (

      <div>
        <ol className="breadcrumb">
          <li><a href="#/cookbooks">Kochb&uuml;cher</a></li>
          <li className="active">{this.state.displayname}</li>
        </ol>
        <div className="page-header">
          <h1 className="page-header">{this.state.displayname}</h1>
          {elems}
        </div> 
      </div>
      )
  }
});

module.exports = CookbookView;
