/**
 * @jsx React.DOM
 */

var React = require('react/addons');
var Router = require('../Router.js')
var Service = require('../Service.js')
var SubjectStateBinder = require('../util/SubjectStateBinder.js')

var CookbookListElement = React.createClass({
  /*jshint ignore:start */
  render: function () {
    var cookbook = this.props.cookbook;
    return (
      <div  className="col-md-3 text-center" onClick={Router.navigateToCookbook(cookbook.id)} >
        <h4>{this.props.cookbook.name}</h4>
        <div style={{fontSize:'80px'}}> <span className="glyphicon glyphicon-book"></span> </div>
        <a href={Router.linkToCookbook(cookbook.id)} className="btn btn-default btn-sm">Anschauen</a>
      </div>
      )
  }
  /*jshint ignore:end */
});


var CookbookList = React.createClass({
  /*jshint ignore:start */
  render: function () {
    var cookbooks = this.props.cookbooks.map(function (c) { return <CookbookListElement cookbook={c} key={'cookbook_entry_'+c.id}/> })
    return (
      <div> 
          <ol className="breadcrumb">
            <li className="active">Kochb&uuml;cher</li>
          </ol>
          <div className="page-header">
            <h1>Kochb&uuml;cher</h1>
          </div> 
          <div className="row">
            {cookbooks}
          </div>
      </div>
      )
  }
  /*jshint ignore:end */
});



module.exports = CookbookList;
