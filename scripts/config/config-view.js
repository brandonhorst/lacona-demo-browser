var div = React.createFactory('div');
var input = React.createFactory('input');
var label = React.createFactory('label');

var CM = React.createFactory(window.CodeMirrorEditor);

var tempId = 0;

var GrammarField = React.createFactory(React.createClass({
  displayName: 'Lacona Grammar Field',
  render: function () {
    return div(null,
      CM({
        textAreaStyle: {minHeight: '10em'},
        value: this.props.grammar,
        mode: 'javascript',
        theme: 'lacona',
        lineNumbers: true,
        onChange: function (e) {
          this.props.update(e.target.value);
        }.bind(this)
      })
    );
  }
}));

var SettingsField = React.createFactory(React.createClass({
  displayName: 'Lacona Settings Field',
  render: function () {
    tempId++;
    return div({className: 'settings'},
      'Fuzzy: ',
      label(null,
        input({
          type: 'radio',
          name: 'fuzzy' + tempId,
          value: 'none',
          checked: this.props.settings.fuzzy === 'none',
          onChange: function (e) { this.props.update({fuzzy: 'none'}); }.bind(this)
        }), 'none'),
      label(null,
        input({
          type: 'radio',
          name: 'fuzzy' + tempId,
          value: 'phrase',
          checked: this.props.settings.fuzzy === 'phrase',
          onChange: function (e) { this.props.update({fuzzy: 'phrase'}); }.bind(this)
        }), 'phrase'),
      label(null,
        input({
          type: 'radio',
          name: 'fuzzy' + tempId,
          value: 'all',
          checked: this.props.settings.fuzzy === 'all',
          onChange: function (e) { this.props.update({fuzzy: 'all'}); }.bind(this)
        }), 'all')
    )
  }
}));

var ConfigView = React.createClass({
  displayName: 'Lacona Config View',
  render: function () {
    return div({className: 'config-view'},
      GrammarField({
        grammar: this.props.grammar,
        update: this.props.updateGrammar
      }),
      SettingsField({
        settings: this.props.settings,
        update: this.props.updateSettings
      })
    );
  }
});

module.exports = ConfigView;
