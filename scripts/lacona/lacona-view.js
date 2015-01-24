var _ = require('lodash');
var lacona = require('lacona');
var Stateful = require('lacona-addon-stateful');
var Ordered = require('lacona-addon-ordered');
var Unique = require('lacona-addon-unique');
var Readable = require('stream').Readable;
var fulltext = require('lacona-util-fulltext');

var laconaOptions = React.createFactory(require('./options'));
var laconaInput = React.createFactory(require('./input'));

var div = React.createFactory('div');

function matchSuggestion(option) {
  return fulltext.match(option) + fulltext.suggestion(option);
}

var LaconaView = React.createClass({
  displayName: "Lacona View",
  getInitialState: function () {
    return {
      userInput: '',
      suggestions: [],
      selection: 0
    };
  },
  createParser: function (props) {
    var parser, stateful, ordered;

    parser = new lacona.Parser(props.settings);
    parser.sentences = props.grammars.map(function (sentence) {
      return sentence();
    });

    stateful = new Stateful({serializer: fulltext.all});

    ordered1 = new Ordered({serializer: fulltext.all});
    ordered2 = new Ordered({serializer: fulltext.all});

    unique = new Unique({serializer: matchSuggestion});

    this.suggestions = [];
    this.selection = 0;

    this.inputStream = new Readable({objectMode: true});
    this.inputStream._read = function noop() {};
    this.inputStream
      .pipe(parser)
      .pipe(stateful)
      .pipe(ordered1)
      .pipe(unique)
      .pipe(ordered2)
      .on('data', this.handleNewData);
  },

  handleNewData: function (newData) {
    var deleteIndex;
    switch(newData.event) {
      case 'insert':
        this.suggestions.splice(newData.sortIndex, 0, {id: newData.id, data: newData.data});
        if (newData.id <= this.selection) {
          this.selection = this.normalizeSelection(this.selection + 1);
        }
        break;
      case 'delete':
        deleteIndex = _.findIndex(this.suggestions, {id: newData.id}, 'id');
        this.suggestions.splice(deleteIndex, 1);
        if (deleteIndex <= this.selection) {
          this.selection = this.normalizeSelection(this.selection - 1);
        }
        break;
    }

    this.setState({
      suggestions: this.suggestions,
      selection: this.selection
    });
  },
  normalizeSelection: function(selection) {
    return Math.max(Math.min(selection, this.suggestions.length - 1), 0);
  },
  componentDidMount: function () {
    this.createParser(this.props);
    this.inputStream.push('');
  },
  componentWillReceiveProps: function (nextProps) {
    this.createParser(nextProps);
  },
  updateInput: function (newInput) {
    this.setState({userInput: newInput});
    this.inputStream.push(newInput);
  },
  completeSelection: function () {
    if (this.suggestions.length > 0) {
      var newString = fulltext.match(this.suggestions[this.selection].data) +
        fulltext.suggestion(this.suggestions[this.selection].data);

      this.updateInput(newString);
    }
  },
  moveSelection: function (steps) {
    this.selection = this.normalizeSelection(this.selection + steps);

    this.setState({selection: this.selection});
  },
  render: function () {
    return div({className: 'lacona-view'},
      laconaInput({
        update: this.updateInput,
        completeSelection: this.completeSelection,
        moveSelection: this.moveSelection,
        userInput: this.state.userInput
      }),
      laconaOptions({
        suggestions: this.state.suggestions,
        selection: this.state.selection
      }));
  }
});

module.exports = LaconaView;
