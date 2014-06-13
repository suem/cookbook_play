var SubjectStateBinder = {
  subscriptions: [],
  bindSubject: function(observable,name) {
    var subscription = observable.subscribe(function (val) {
      var state = {};
      state[name] = val;
      this.setState(state)
    }.bind(this));
    this.subscriptions.push(subscription);
  },
  bindSubjects: function(bindings) {
    Object.keys(bindings).forEach(function (name) {
      this.bindSubject(bindings[name],name);
    }.bind(this))
  },
  componentWillUnmount: function() {
    this.subscriptions.forEach(function(s){
      s.dispose();
    });
  }
};

module.exports = SubjectStateBinder;
