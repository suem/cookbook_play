/**
 * @jsx React.DOM
 */

var _ = require('underscore');
var React = require('react/addons');

var CookbookView = React.createClass({
  render: function () {
    var r = this.props.recipe;

    var ingredients = r.ingredients.map(function (i) {
      return <li>{i.name}, {i.amount} {i.unit}</li>
    });

    var editLink = '#recipes/'+r.id+'/edit';

    return (
      <div>
        <div className="container-fluid">
          <h1 className="page-header">
            {r.name}<br/>
            <small>{r.description}</small>
          </h1>
        </div>
        <div className="container-fluid">
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
              {r.instructions}
            </div>
          </div>

          <div className="row">
            <div className="col-xs-2">
              <a className="btn btn-default">
                <span className="glyphicon glyphicon-print"></span> Drucken
              </a>
            </div>
            <div className="col-xs-10 text-right">
              <div className="btn-toolbar">
                <a href={editLink} className="btn btn-warning">
                  Bearbeiten
                </a>
                <a href="" className="btn btn-danger">
                  L&ouml;schen
                </a>
              </div>
            </div>
          </div>

        </div>

      </div>

    )
  }
});

module.exports = CookbookView;
