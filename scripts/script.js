var LaconaView = React.createFactory(require('./lacona/lacona-view'));
var ConfigView = React.createFactory(require('./config/config-view'));

var div = React.createFactory('div');
var input = React.createFactory('input');

var freetext = require('lacona-phrase-freetext');
var datetime = require('lacona-phrase-datetime');
var lacona = require('lacona');

var defaultPhrases = [
  function() {
return lacona.createPhrase({
  name: 'demo/reminder',
  describe: function () {
    return lacona.sequence({children: [
      lacona.literal({text: 'remind me to ', category: 'action'}),
      freetext({
        id: 'reminderName',
        splitOn: /( )/,
        regex: /\w$/,
        default: 'feed the dog',
        category: 'argument',
        limit: 1
      }),
      lacona.literal({text: ' ', join: true}),
      datetime.date({category: 'addition'})
    ]});
  }
});
  }, function() {
function literal(text, category) {
  return lacona.literal({text: text, value: text, category: category});
}
return lacona.createPhrase({
  name: 'demo/superhero',
  describe: function () {
    return lacona.sequence({children: [
      literal('my favorite superhero is ', 'action'),
      lacona.choice({category: 'argument', children: [
        literal('Captain America'),
        literal('Iron Man'),
        literal('Thor'),
        literal('Hawkeye'),
        literal('Black Widow'),
        literal('Hulk'),
        literal('Nick Fury'),
        literal('Ant-Man'),
        literal('Spider-Man')
      ]})
    ]});
  }
});
  }, function() {
var searchEngines = lacona.createPhrase({
  name: 'demo/searchEngines',
  describe: function () {
    return lacona.choice({children: [
      lacona.literal({text: 'Google'}),
      lacona.literal({text: 'Yahoo'}),
      lacona.literal({text: 'Bing'})
    ]});
  }
});
return lacona.createPhrase({
  name: 'demo/search',
  describe: function () {
    return lacona.choice({children: [
      lacona.sequence({children: [
        lacona.literal({text: 'search ', category: 'action'}),
        searchEngines({category: 'actor'}),
        lacona.literal({text: ' for ', category: 'conjunction', join: true}),
        freetext({
          default: 'current selection',
          category: 'argument'
        })
      ]}),
      lacona.sequence({children: [
        lacona.literal({text: 'search ', category: 'action'}),
        lacona.literal({text: 'for ', category: 'conjunction', join: true, optional: true}),
        freetext({
          default: 'current selection',
          category: 'argument',
          splitOn: /( )/,
          regex: /\w$/,
          limit: 1
        }),
        lacona.choice({limit: 1, category: 'conjunction', children: [
          lacona.literal({text: ' with ', join: true}),
          lacona.literal({text: ' on ', join: true}),
          lacona.literal({text: ' using ', join: true})
        ]}),
        searchEngines({category: 'actor'})
      ]})
    ]});
  }
});
}];

var DemoInstance = React.createFactory(React.createClass({
  displayName: 'Lacona Demo Instance',
  getInitialState: function () {
    return {
      grammarString: this.props.defaultPhrase,
      settings: {
        fuzzy: 'phrase'
      }};
  },
  updateGrammarString: function (newGrammar) {
    this.setState({grammarString: newGrammar});
  },
  updateSettings: function (newSettings) {
    this.setState({settings: newSettings});
  },
  render: function () {
    return div(
      {className: 'demo-instance'},
      ConfigView({
        grammar: this.state.grammarString,
        sentences: this.state.sentences,
        settings: this.state.settings,
        updateGrammar: this.updateGrammarString,
        updateSettings: this.updateSettings
      }),
      LaconaView({
        grammars: [new Function(
          'lacona', 'freetext', 'datetime',
          this.state.grammarString
        )(lacona, freetext, datetime)],
        sentences: this.state.sentences,
        settings: this.state.settings
      })
    );
  }
}));

var instances = defaultPhrases.map(function (phrase) {
  return {defaultPhrase: phrase.toString().split('\n').slice(1, -1).join('\n')};
}).map(DemoInstance);

React.render(div.apply(null, [null].concat(instances)), document.body);
