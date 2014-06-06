/**
 * @jsx React.DOM
 */
var _ = require('underscore');
// var $ = require('jquery');
var React = require('react/addons');

var SuggestionInput = React.createClass({
  getInitialState: function () {
    return {showSuggestions: false, matches: [], match_index: 0};
  },
  componentWillReceiveProps: function(newProps) {
    //new value from parent, can set state without rerendering. Perfect to compute the match
    var match_index = 0;
    var matches = this.state.showSuggestions ? this.getMatches(newProps.valueLink.value) : [] ;
    this.setState({match_index: match_index,matches:matches})
  },
  getMatches: function (query) {
    var matches = [];
    var regex = new RegExp(query, 'i');
    this.props.entries.forEach(function (str) {
      if (regex.test(str)) matches.push(str);
    })
    return matches;
  },
  selectMatch: function (i) {
    var match = this.state.matches[i]
    if(match) {
      this.state.showSuggestions = false;
      this.props.valueLink.requestChange(match);
      if(this.props.onSelect) this.props.onSelect(match)
      return true;
    } else return false;
  },
  disableSuggestions: function () {
      this.setState({showSuggestions: false, matches: [], match_index: 0}) 
  },
  onKeyPress: function (e) {
    var ENTER = 13, TAB=9, ESC = 27, ARROW_UP = 38, ARROW_DOWN = 40;
    if(this.state.showSuggestions) {
      if(e.keyCode == ENTER) {
        //select current match
        this.selectMatch(this.state.match_index)
        e.preventDefault();    
      } else if(e.keyCode == TAB ) {
        //about to loose focus, disable suggestions
        this.disableSuggestions();
      } else if(e.keyCode == ESC) {
        //user pressed esc, disable suggestions
        e.preventDefault();
        this.disableSuggestions();
      } else if(e.keyCode == ARROW_DOWN || e.keyCode == ARROW_UP) {
        //focus next match in list
        e.preventDefault();
        var dir = e.keyCode == ARROW_DOWN ? 1 : -1;
        var match_index = (this.state.match_index + dir + this.state.matches.length) % this.state.matches.length;
        this.setState({match_index: match_index})
      }
    } else {
        this.setState({showSuggestions:true});
    }
  },
  onMouseDown: function (i,e) {
    //try to select the matched element, then prevent default s.t. focus is not lost
    if(this.selectMatch(i)) e.preventDefault();
  },
  render: function () {
    var match_index = this.state.match_index;
    var matches = this.state.matches;
    var matchesStyle = {left:'14px',display: this.state.showSuggestions && matches.length > 0 ? 'block' : 'none'}
    var self = this;
    var suggestions = (
      <ul className="dropdown-menu dropdown-menu-left" style={matchesStyle}>
        { this.state.matches.map(function (match, index) { 
          var matchStyle = index == match_index ? 'active': '';
          return <li onMouseDown={self.onMouseDown.bind(self,index)} className={matchStyle} key={'match_'+index}>
            <a href="">
              {match}
            </a>
          </li> 
        }) }
      </ul>
    )
    return (
      <div> 
        <input valueLink={this.props.valueLink} onBlur={this.disableSuggestions} onKeyDown={this.onKeyPress} ref="input" type="text" className="form-control" autoComplete="off"/>
        {suggestions}
      </div>
    );
  }
});


module.exports = SuggestionInput;
