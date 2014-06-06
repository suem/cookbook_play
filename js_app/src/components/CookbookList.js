/**
 * @jsx React.DOM
 */

var React = require('react/addons');

var CookbookListElement = React.createClass({
  /*jshint ignore:start */
  render: function () {
    var cookbookLink = '#/cookbooks/'+this.props.cookbook.id
    return (
      <div className="col-md-3 text-center">
        <h4>{this.props.cookbook.displayname}</h4>
        <div style={{fontSize:'80px'}}> <span className="glyphicon glyphicon-book"></span> </div>
        <a href={cookbookLink} className="btn btn-default btn-sm">Anschauen</a>
      </div>
      )
  }
  /*jshint ignore:end */
});


var CookbookList = React.createClass({
  getInitialState: function () {
    return {cookbooks: []}
  },
  componentWillMount: function(){
    var self = this;
    this.props.cookbooks.subscribe(function (cookbookList) {
      self.setState({cookbooks: cookbookList})
    });
  },
  /*jshint ignore:start */
  render: function () {
    return (
      <div> 
          <ol className="breadcrumb">
            <li className="active">Kochb&uuml;cher</li>
          </ol>
          <div className="page-header">
            <h1>Kochb&uuml;cher</h1>
          </div> 
          <div className="row">
            {this.state.cookbooks.map(function (c) { return <CookbookListElement cookbook={c} /> })}
          </div>



      </div>
      )
  }
  /*jshint ignore:end */
});



module.exports = CookbookList;
