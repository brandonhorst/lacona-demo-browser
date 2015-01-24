var ReactCSSTransitionGroup = React.createFactory(React.addons.CSSTransitionGroup);
var _ = require('lodash');
var fulltext = require('lacona-util-fulltext');

var div = React.createFactory('div');

function m() {
  var res = {};
  var i, l
  for (i = 0, l = arguments.length; i < l; i++) {
    if (arguments[i]) {
      _.assign(res, arguments[i]);
    }
  }
  return res;
};

var LaconaOptions = React.createClass({
  displayName: 'Lacona Options',
  createDivs: function () {
    var this_ = this;

    var i = 0;

    return suggestDivs = this.props.suggestions.map(function (option) {
      var options = {
        key: option.id,
        option: option.data,
        position: i - this_.props.selection,
        prefix: 'category'
      };

      i++;

      return LaconaOption(options);
    });
  },
  render: function () {
    return div(null,
      div({
      // ReactCSSTransitionGroup({
        // transitionName: 'option',
        // component: 'div',
        className: 'options non-central'
      }, this.createDivs()),
      div({
      // ReactCSSTransitionGroup({
        // transitionName: 'option',
        // component: 'div',
        className: 'options central'
      }, this.createDivs())
    );
  }
});

var LaconaOption = React.createFactory(React.createClass({
  displayName: 'Lacona Option',
  render: function () {
    var this_ = this;

    var divs = ['match', 'suggestion', 'completion'].map(function (type) {
      return this_.props.option[type].map(function (item) {
        var className = this_.props.prefix + '-' + item.category;
        if (item.input === true) {
          className += ' highlighted';
        } else if (item.input === false) {
          className += ' not-highlighted';
        }
        return div({className: className}, item.string);
      });
    });

    var top = 40 * this.props.position;

    return div( {className: 'option', style: {top: top}},
      div.apply(null, [{className: 'match'}].concat(divs[0])),
      div.apply(null, [{className: 'suggestion'}].concat(divs[1])),
      div.apply(null, [{className: 'completion'}].concat(divs[2]))
    );
  }
}));

module.exports = LaconaOptions;
